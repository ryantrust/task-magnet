import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { logout } = useAuth0();
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={handleProfileClick}>
          {/* Replace with profile icon */}
          <img
            src="path/to/profile-icon.png"
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="flex-grow p-4 flex">
        {/* Todo List */}
        <div className="flex-1 bg-gray-200 p-4 m-2">
          <h2 className="text-lg font-semibold mb-4">Todo List</h2>
          {/* Add Todo List content here */}
        </div>

        {/* Calendar View */}
        <div className="flex-1 bg-gray-200 p-4 m-2">
          <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
          {/* Add Calendar content here */}
        </div>

        {/* Pomodoro Timer */}
        <div className="flex-1 bg-gray-200 p-4 m-2">
          <h2 className="text-lg font-semibold mb-4">Pomodoro Timer</h2>
          {/* Add Pomodoro Timer content here */}
        </div>

        {/* Option 4 */}
        <div className="flex-1 bg-gray-200 p-4 m-2">
          <h2 className="text-lg font-semibold mb-4">Option 4</h2>
          {/* Add Option 4 content here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
