// CombinedChartComponent.js
import React, {useEffect, useRef, useState} from "react";
import Chart from "chart.js/auto";
import Header from "../components/header";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";

const CombinedChartComponent = () => {
  const { getAccessTokenSilently} = useAuth0();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const fetchTokenAndTasks = async () => {
      try {
        const accessToken = await getAccessTokenSilently({ authorizationParams: { audience: process.env.REACT_APP_AUTH0_AUDIENCE } });
        setAccessToken(accessToken);

        return accessToken;
      } catch (error) {
        console.error('Error fetching token or tasks:', error);
      }
    };

    const getTasks = async (accessToken) => {
      try {
        const response = await axios.get('http://localhost:5001/api/task/', {
          headers: { authorization: `Bearer ${accessToken}` },
        });
        return response.data;
      } catch (error) {
        console.error('Cannot grab tasks', error);
      }
    };

    const setupGraph = async () => {
      const token = await fetchTokenAndTasks();
      const data = await getTasks(token);
      // Check if data is defined and not empty
      if (!data || data.length === 0) {
        return;
      }

      const dataCountMap = data.reduce((map, item) => {
        const date = new Date(item.dateCreated);
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
            tooltip: {
              callbacks: {
                label: function (tooltipItem, data) {
                  if (!data) return;
                  // Format the y-axis tooltip value
                  return (
                      data.datasets[tooltipItem.datasetIndex].label +
                      ": " +
                      tooltipItem.yLabel
                  );
                },
                title: function (tooltipItem, data) {
                  // Use the timestamp directly for x-axis tooltip
                  const timestamp = tooltipItem[0].parsed.x;
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
    };
    setupGraph();
  }, [accessToken, getAccessTokenSilently]);

  return (
      <>
        <Header />
        <div className="max-w-screen-xl mx-auto">
          <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
      </>
  );
};

export default CombinedChartComponent;
