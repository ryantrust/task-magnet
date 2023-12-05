// CombinedChartComponent.js
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const CombinedChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Sample data
  const sampleData = [
    { id: 1, date: "2023-12-01" },
    { id: 2, date: "2023-12-01" },
    { id: 3, date: "2023-12-02" },
    { id: 4, date: "2023-12-03" },
    // Add more data with dates as needed
  ];

  useEffect(() => {
    // Check if data is defined and not empty
    if (!sampleData || sampleData.length === 0) {
      return;
    }

    const dataCountMap = sampleData.reduce((map, item) => {
      const date = new Date(item.date);
      const timestamp = date.getTime(); // Convert date to timestamp
      map[timestamp] = (map[timestamp] || 0) + 1;
      return map;
    }, {});

    const labels = Object.keys(dataCountMap);
    const dataValues = Object.values(dataCountMap);

    const ctx = chartRef.current.getContext("2d");

    // Destroy the previous Chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new Chart instance
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Number of Tasks",
            data: dataValues,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Date",
            },
            ticks: {
              callback: function (value, index, values) {
                // Format the timestamp as a date
                return new Date(value).toLocaleDateString();
              },
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Tasks",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Tasks Over Time",
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                // Format the y-axis tooltip value
                return (
                  data.datasets[tooltipItem.datasetIndex].label +
                  ": " +
                  tooltipItem.yLabel
                );
              },
              title: function (tooltipItem, data) {
                // Use the timestamp directly for x-axis tooltip
                const timestamp = parseFloat(tooltipItem[0].label);
                return new Date(timestamp).toLocaleDateString();
              },
            },
          },
        },
      },
    });

    // Cleanup function to destroy the Chart instance when the component is unmounted
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [sampleData]);

  return (
    <div className="max-w-screen-lg mx-auto">
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
};

export default CombinedChartComponent;
