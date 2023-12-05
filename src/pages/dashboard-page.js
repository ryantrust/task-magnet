import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CgProfile } from "react-icons/cg";
import todoImage from "../assets/todoimg.png"; // Placeholder image
import calendarImage from "../assets/calendarimage.png"; // Placeholder image
import pomodoroImage from "../assets/timerimage.png"; // Placeholder image

const Dashboard = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleProfileClick = () => {
    // Redirect to the profile page
    window.location.href = "/profile";
  };

  const redirectToTodoPage = () => {
    // Redirect to the Todo List page
    window.location.href = "/list";
  };

  const redirectToCalendarPage = () => {
    // Redirect to the Calendar View page
    window.location.href = "/calendar";
  };

  const redirectToPomodoroPage = () => {
    // Redirect to the Pomodoro Timer page
    window.location.href = "/timer";
  };

  const redirectToOption4Page = () => {
    // Redirect to the Option 4 page
    window.location.href = "/";
  };

  return (
    <div>
      {/* Header Bar */}
      <div className="p-8 flex justify-between items-center bg-gray-900 text-white shadow-md">
        <div className="flex items-center">
          <div
            className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center"
            onClick={handleProfileClick}
          >
            {<CgProfile />}
          </div>
          <span className="ml-2 cursor-pointer" onClick={handleProfileClick}>
            Profile
          </span>
        </div>
        <p className="text-xl font-bold">ClassMagnet</p>
        {/* Logout Button */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Section */}
      <div className="flex justify-center items-center pt-20">
        {/* Dashboard Selections */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-screen-xl mx-auto">
          {/* Todo List */}
          <div
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md"
            onClick={redirectToTodoPage}
          >
            <img
              src={todoImage}
              alt="Todo"
              className="mb-4 rounded-md object-cover w-32 h-32"
            />
            <h1 className="text-4xl">Todo List</h1>
          </div>
          {/* Calendar View */}
          <div
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md"
            onClick={redirectToCalendarPage}
          >
            <img
              src={calendarImage}
              alt="Calendar"
              className="mb-4 rounded-md object-cover w-32 h-32"
            />
            <h1 className="text-4xl">Calendar View</h1>
          </div>
          {/* Pomodoro Timer */}
          <div
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md"
            onClick={redirectToPomodoroPage}
          >
            <img
              src={pomodoroImage}
              alt="Pomodoro"
              className="mb-4 rounded-md object-cover w-32 h-32"
            />
            <h1 className="text-4xl">Pomodoro Timer</h1>
          </div>
          {/* Option 4 */}
          <div
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md"
            onClick={redirectToOption4Page}
          >
            <img
              // src={option4Image}
              alt="Option 4"
              className="mb-4 rounded-md object-cover w-32 h-32"
            />
            <h1 className="text-4xl">Option 4</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
