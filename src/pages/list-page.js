import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
    dateDue: null,
    dateCreated: "",
  });

  const addTask = () => {
    setTasks([
      ...tasks,
      { ...newTask, dateCreated: new Date().toLocaleString() },
    ]);
    setNewTask({
      title: "",
      description: "",
      priority: "low",
      dateDue: null,
      dateCreated: "",
    });
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
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
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="text"
            placeholder="Title"
            className="flex-1 p-3 border rounded mr-3 focus:outline-none focus:border-blue-500"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
