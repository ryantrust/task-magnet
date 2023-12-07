import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/header";
import axios from "axios";
import { getProtectedResource } from "../services/message.service";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    dateDue: null,
    dateCreated: "",
  });

  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  // const [userMetadata, setUserMetadata] = useState(null);
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const [accessToken, setAccessToken] = useState("");
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  // const [userMetadata, setUserMetadata] = useState(null);
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const [accessToken, setAccessToken] = useState("");

  //getting access token
  useEffect(() => {
    let isMounted = true;
    //getting access token
    useEffect(() => {
      let isMounted = true;

      const fetchTokenAndTasks = async () => {
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            },
          });
          setAccessToken(accessToken);
          const fetchTokenAndTasks = async () => {
            try {
              const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                },
              });
              setAccessToken(accessToken);

              // Call getTask right after obtaining the access token
              await getTask(accessToken);
            } catch (error) {
              console.error("Error fetching token or tasks:", error);
            } finally {
              if (!isMounted) {
                return;
              }
            }
          };
          // Call getTask right after obtaining the access token
          await getTask(accessToken);
        } catch (error) {
          console.error("Error fetching token or tasks:", error);
        } finally {
          if (!isMounted) {
            return;
          }
        }
      };

      fetchTokenAndTasks();
      fetchTokenAndTasks();

      return () => {
        isMounted = false;
      };
    }, [getAccessTokenSilently]);
    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  //load the old tasks on the page (needs mapping for priorities)
  const getTask = async (accessToken) => {
    try {
      const response = await axios.get("http://localhost:5001/api/task/", {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      setTasks(response.data);
      console.log(response);
    } catch (error) {
      console.error("Cannot grab tasks", error);
    }
  };
  //load the old tasks on the page (needs mapping for priorities)
  const getTask = async (accessToken) => {
    try {
      const response = await axios.get("http://localhost:5001/api/task/", {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      setTasks(response.data);
      console.log(response);
    } catch (error) {
      console.error("Cannot grab tasks", error);
    }
  };

  const exportTasksAsCSV = () => {
    if (tasks.length === 0) {
      console.log("No tasks to export.");
      return;
    }
    const exportTasksAsCSV = () => {
      if (tasks.length === 0) {
        console.log("No tasks to export.");
        return;
      }

      const csvData = tasks.map((task) => ({
        Title: task.title,
        Description: task.description,
        Priority: task.priority,
        "Due Date": task.dateDue ? task.dateDue.toLocaleString() : "Not set",
        "Created On": task.dateCreated,
      }));
      const csvData = tasks.map((task) => ({
        Title: task.title,
        Description: task.description,
        Priority: task.priority,
        "Due Date": task.dateDue ? task.dateDue.toLocaleString() : "Not set",
        "Created On": task.dateCreated,
      }));

      const fileName = "tasks_export"; // Set the desired file name here
      const fileName = "tasks_export"; // Set the desired file name here

      const csvHeaders = Object.keys(csvData[0]);
      const csvRows = [
        csvHeaders.join(","), // Headers row
        ...csvData.map((row) =>
          csvHeaders.map((fieldName) => row[fieldName]).join(",")
        ), // Data rows
      ];
      const csvHeaders = Object.keys(csvData[0]);
      const csvRows = [
        csvHeaders.join(","), // Headers row
        ...csvData.map((row) =>
          csvHeaders.map((fieldName) => row[fieldName]).join(",")
        ), // Data rows
      ];

      const csvContent = csvRows.join("\n");
      const csvBlob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const csvURL = URL.createObjectURL(csvBlob);
      const tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    };
    const csvContent = csvRows.join("\n");
    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const csvURL = URL.createObjectURL(csvBlob);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };

  const addTask = async () => {
    try {
      // Mapping priority with status
      let priorityValue;
      switch (newTask.priority) {
        case "Low":
          priorityValue = 1;
          break;
        case "Medium":
          priorityValue = 2;
          break;
        case "High":
          priorityValue = 3;
          break;
        default:
          priorityValue = 1; // Set a default value if needed
      }
      const addTask = async () => {
        try {
          // Mapping priority with status
          let priorityValue;
          switch (newTask.priority) {
            case "Low":
              priorityValue = 1;
              break;
            case "Medium":
              priorityValue = 2;
              break;
            case "High":
              priorityValue = 3;
              break;
            default:
              priorityValue = 1; // Set a default value if needed
          }

          // Update the newTask object passed with correct integer representation (status)
          const updatedNewTask = {
            ...newTask,
            status: priorityValue,
            dateCreated: new Date().toLocaleString(),
          };
          // Update the newTask object passed with correct integer representation (status)
          const updatedNewTask = {
            ...newTask,
            status: priorityValue,
            dateCreated: new Date().toLocaleString(),
          };

          const response = await axios.post(
            "http://localhost:5001/api/task/",
            updatedNewTask,
            {
              headers: { authorization: `Bearer ${accessToken}` },
            }
          );
          console.log(response);
          const response = await axios.post(
            "http://localhost:5001/api/task/",
            updatedNewTask,
            {
              headers: { authorization: `Bearer ${accessToken}` },
            }
          );
          console.log(response);

          const updatedTasks = [
            ...tasks,
            updatedNewTask, // Use updatedNewTask instead of newTask
          ];
          const updatedTasks = [
            ...tasks,
            updatedNewTask, // Use updatedNewTask instead of newTask
          ];

          setTasks(updatedTasks);
          setTasks(updatedTasks);

          setNewTask({
            title: "",
            description: "",
            priority: "Low",
            dateDue: null,
            dateCreated: "",
          });
        } catch (error) {
          console.error("cannot add task", error);
        }
      };

      //delete tasks (work on retrieving particular task id and then deleting it)
      const deleteTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
      };
      setNewTask({
        title: "",
        description: "",
        priority: "Low",
        dateDue: null,
        dateCreated: "",
      });
    } catch (error) {
      console.error("cannot add task", error);
    }
  };

  //delete tasks (work on retrieving particular task id and then deleting it)
  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 bg-gray-100 p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Todo List</h1>
        return (
        <>
          <Header />
          <div className="container mx-auto mt-8 bg-gray-100 p-8 rounded shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Todo List</h1>

            <div className="mb-6 flex flex-col">
              <div className="flex items-center">
                <select
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="text"
                  placeholder="Title"
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <DatePicker
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  selected={newTask.dateDue}
                  onChange={(date) => setNewTask({ ...newTask, dateDue: date })}
                  placeholderText="Select due date"
                  calendarClassName="fixed z-50"
                />
              </div>
              <button
                className="bg-blue-500 text-white p-3 rounded mt-3"
                onClick={addTask}
              >
                Create Task
              </button>
              <button
                className="bg-blue-500 text-white p-3 rounded mt-3"
                onClick={exportTasksAsCSV}
              >
                Export Tasks
              </button>
            </div>
            <div className="mb-6 flex flex-col">
              <div className="flex items-center">
                <select
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="text"
                  placeholder="Title"
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <DatePicker
                  className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
                  selected={newTask.dateDue}
                  onChange={(date) => setNewTask({ ...newTask, dateDue: date })}
                  placeholderText="Select due date"
                  calendarClassName="fixed z-50"
                />
              </div>
              <button
                className="bg-blue-500 text-white p-3 rounded mt-3"
                onClick={addTask}
              >
                Create Task
              </button>
              <button
                className="bg-blue-500 text-white p-3 rounded mt-3"
                onClick={exportTasksAsCSV}
              >
                Export Tasks
              </button>
            </div>

            <ul>
              {tasks.map((task, index) => (
                <li key={index} className="mb-6">
                  <div
                    className={`flex justify-between items-center bg-white p-6 rounded shadow-md ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {task.title}
                      </h2>
                      <p className="text-gray-600">{task.description}</p>
                      <p className="text-sm text-gray-500">{`Priority: ${task.priority}`}</p>
                      <p className="text-sm text-gray-500">{`Due date: ${
                        task.dateDue ? task.dateDue.toLocaleString() : "Not set"
                      }`}</p>
                      <p className="text-sm text-gray-500">{`Created on: ${task.dateCreated}`}</p>
                    </div>
                    <button
                      className="bg-red-500 text-white p-3 rounded"
                      onClick={() => deleteTask(index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
        );
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="mb-6">
              <div
                className={`flex justify-between items-center bg-white p-6 rounded shadow-md ${getPriorityColor(
                  task.priority
                )}`}
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {task.title}
                  </h2>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">{`Priority: ${task.priority}`}</p>
                  <p className="text-sm text-gray-500">{`Due date: ${
                    task.dateDue ? task.dateDue.toLocaleString() : "Not set"
                  }`}</p>
                  <p className="text-sm text-gray-500">{`Created on: ${task.dateCreated}`}</p>
                </div>
                <button
                  className="bg-red-500 text-white p-3 rounded"
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "low":
      return "bg-blue-200";
    case "medium":
      return "bg-yellow-200";
    case "high":
      return "bg-red-200";
    default:
      return "";
  }
};

export default Todo;
