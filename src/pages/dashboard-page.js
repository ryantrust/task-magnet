import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleProfileClick = () => {
    // Redirect to the profile page
    window.location.href = "/profile";
  };

  return (
    <div>
      {/* Header Bar */}
      <div className="p-8 flex justify-between items-center bg-blue-300">
        <div className="flex items-center">
          {/* Profile Icon */}
          <div
            className="w-8 h-8 bg-gray-500 rounded-full cursor-pointer"
            onClick={handleProfileClick}
          >
            {/*add an icon here */}
          </div>
          <span className="ml-2">Username</span>
        </div>
        {/* Logout Button */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Section */}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        {/* Dashboard Selections */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-screen-xl mx-auto">
          {/* Todo List */}
          <div className="flex items-center justify-center h-64 p-8 bg-blue-500 rounded cursor-pointer">
            <h1>Todo List</h1>
            {/* Add content for Todo List */}
          </div>
          {/* Calendar View */}
          <div className="flex items-center justify-center h-64 p-8 bg-green-500 rounded cursor-pointer">
            <h1>Calendar View</h1>
            {/* Add content for Calendar View */}
          </div>
          {/* Pomodoro Timer */}
          <div className="flex items-center justify-center h-64 p-8 bg-yellow-500 rounded cursor-pointer">
            <h1>Pomodoro Timer</h1>
            {/* Add content for Pomodoro Timer */}
          </div>
          {/* Option 4 */}
          <div className="flex items-center justify-center h-64 p-8 bg-purple-500 rounded cursor-pointer">
            <h1>Option 4</h1>
            {/* Add content for Option 4 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
