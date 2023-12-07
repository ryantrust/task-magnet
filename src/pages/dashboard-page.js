import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import todoImage from "../assets/todoimg.png"; // Placeholder image
import calendarImage from "../assets/calendarimage.png"; // Placeholder image
import pomodoroImage from "../assets/timerimage.png"; // Placeholder image
import graphImage from "../assets/graphicon.png";
import Header from "../components/header"; // Placeholder image

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
    // Redirect to the graph page
    window.location.href = "/graph";
  };

  return (
    <div>
      <Header />

      {/* Dashboard Section */}
      <div className="flex justify-center items-center pt-20">
        {/* Dashboard Selections */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-screen-xl mx-auto">
          {/* Todo List */}
          <div
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md transform transition-transform hover:scale-105"
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
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md transform transition-transform hover:scale-105"
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
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md transform transition-transform hover:scale-105"
            onClick={redirectToPomodoroPage}
          >
            <img
              src={pomodoroImage}
              alt="Pomodoro"
              className="mb-4 rounded-md object-cover w-32 h-32"
            />
            <h1 className="text-4xl">Pomodoro Timer</h1>
          </div>
          {/* Graphs */}
          <div
            className="flex flex-col items-center justify-center h-64 p-8 rounded cursor-pointer shadow-md transform transition-transform hover:scale-105"
            onClick={redirectToOption4Page}
          >
            <img
              src={graphImage}
              alt="Option 4"
              className="mb-4 rounded-md object-cover w-32 h-32"
            />
            <h1 className="text-4xl">Task Graphs</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
