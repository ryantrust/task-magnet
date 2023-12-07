import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/header";
import axios from "axios";
import { getProtectedResource } from "../services/message.service";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchItem, setSearchItem] = useState('');

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)

    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredTasks(filteredTasks);
  }

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: 1,
    dateDue: new Date(),
    dateCreated: "",
  });

  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  // const [userMetadata, setUserMetadata] = useState(null);
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const [accessToken, setAccessToken] = useState("");

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

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  //load the old tasks on the page (needs mapping for priorities)
  const getTask = async (accessToken) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/task/`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });

      // Mapping status to priority
      const mappedTasks = response.data.map(task => {
        let statusVar;
        switch (task.status) {
          case 1:
            statusVar = "Low";
            break;
          case 2:
            statusVar = "Medium";
            break;
          case 3:
            statusVar = "High";
            break;
          default:
            statusVar = "Low"; // Default priority if status is not 1, 2, or 3
        }

        // Creating a new object with the priority attribute
        return {
          ...task,
          statusString: statusVar
        };
      });

      // Setting the tasks with updated priorities
      setTasks(mappedTasks);
      setFilteredTasks(mappedTasks);
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

    const csvData = tasks.map((task) => ({
      Title: task.title,
      Description: task.description,
      Status: task.status,
      "Due Date": task.dateDue ? task.dateDue.toLocaleString() : "Not set",
      "Created On": task.dateCreated,
    }));

    const fileName = "tasks_export"; // Set the desired file name here

    const csvHeaders = Object.keys(csvData[0]);
    const csvRows = [
      csvHeaders.join(","), // Headers row
      ...csvData.map((row) =>
        csvHeaders.map((fieldName) => row[fieldName]).join(",")
      ), // Data rows
    ];

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
      // Update the newTask object passed with correct integer representation (status)
      const updatedNewTask = {
        ...newTask,
        dateCreated: new Date().toLocaleString(),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER_URL}/api/task/`,
        updatedNewTask,
        {
          headers: { authorization: `Bearer ${accessToken}` },
        }
      );

      const returnedTask = response.data;

      // Mapping status to priority for the returned task
      const priorityForReturnedTask = getPriorityFromStatus(returnedTask.status);

      // Update the returned task object with the mapped priority
      const updatedReturnedTask = {
        ...returnedTask
      };

      const updatedTasks = [...tasks, updatedReturnedTask];

      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setNewTask({
        title: "",
        description: "",
        status: 1,
        dateDue: new Date(),
        dateCreated: "",
      });
    } catch (error) {
      console.error("cannot add task", error);
    }
  };

  // Function to get priority based on status
  const getPriorityFromStatus = (status) => {
    switch (status) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "Low"; // Default priority if status is not 1, 2, or 3
    }
  };

  // Function to get priority based on status
  const getStatusFromPriority = (priority) => {
    switch (priority) {
      case "Low":
        return 1;
      case "Medium":
        return 2;
      case "High":
        return 3;
      default:
        return 1; // Default priority if status is not 1, 2, or 3
    }
  };

  //delete tasks 
  const deleteTask = async (index) => {
    try {
      const deleted_task = tasks[index]._id;
      const response = await axios.delete(
        `${process.env.REACT_APP_API_SERVER_URL}/api/task/${deleted_task}`,
        {
          headers: { authorization: `Bearer ${accessToken}` },
        }
      );

      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    }
    catch (error) {
      console.error("Cannot grab tasks", error);
    }

  };


  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 bg-gray-100 p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Todo List</h1>
        <input
          type="text"
          value={searchItem}
          onChange={handleInputChange}
          placeholder='Type to search'
        />
        <div className="mb-6 flex flex-col">
          <div className="flex items-center">
            <select
              className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
              value={getPriorityFromStatus(newTask.status)}
              onChange={(e) =>
                setNewTask({ ...newTask, status: getStatusFromPriority(e.target.value) })
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
          {filteredTasks.map((task, index) => (
            <li key={index} className="mb-6">
              <div
                className={`flex justify-between items-center bg-white p-6 rounded shadow-md ${getPriorityColor(
                  task.status
                )}`}
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {task.title}
                  </h2>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">{`Priority: ${getPriorityFromStatus(task.status)}`}</p>
                  <p className="text-sm text-gray-500">{`Due date: ${task.dateDue ? task.dateDue.toLocaleString() : "Not set"
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
    case 1:
      return "bg-blue-200";
    case 2:
      return "bg-yellow-200";
    case 3:
      return "bg-red-200";
    default:
      return "";
  }
};

export default Todo;
