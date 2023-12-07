// CombinedChartComponent.js
import React, {useEffect, useRef, useState} from "react";
import Chart from "chart.js/auto";
import Header from "../components/header";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {format} from "date-fns";

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
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/task/`, {
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
        const timestamp = format(date.getTime(), "MM/dd/yyyy"); // Convert date to timestamp
        map[timestamp] = (map[timestamp] || 0) + 1;
        return map;
      }, {});

      let items = Object.entries(dataCountMap);
      items.sort((itemA, itemB) => itemA > itemB);

      let keys = items.map(entry => entry[0]);
      let vals = items.map(entry => entry[1]);

      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous Chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new Chart instance
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: keys,
          datasets: [
            {
              label: "Number of Tasks",
              data: vals,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Tasks",
              },
              ticks: {
                stepSize: 1
              }
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
