import React, { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const totalSeconds = minutes * 60 + seconds;
  const totalTime = 25 * 60; // Assuming 25 minutes for a Pomodoro session

  const progress = (totalTime - totalSeconds) / totalTime;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full h-10 bg-gray-300 mb-4 fixed top-0">
        <div
          className="h-full bg-green-500"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <div className="text-9xl font-bold text-gray-800 mb-4">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
