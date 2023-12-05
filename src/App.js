import "./App.css";

import React from "react";
import { Route, Routes } from "react-router-dom";
import CallbackPage from "./pages/callback-page";
import HomePage from "./pages/home-page";
import NotFoundPage from "./pages/not-found-page";
import ProfilePage from "./pages/profile-page";
import CalendarPage from "./pages/calendar-page";
import ListPage from "./pages/list-page";
import PomodoroTimer from "./pages/pomodoro-timer";
import DashboardPage from "./pages/dashboard-page";
import GraphPage from "./pages/graph-page";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/list" element={<ListPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/timer" element={<PomodoroTimer />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/graph" element={<GraphPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
