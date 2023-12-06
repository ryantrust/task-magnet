import React, { useState, useEffect } from "react";
import Header from "../components/header";

const PomodoroTimer = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
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
            endSession();
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

  const startSession = () => {
    const session = { startTime: new Date(), endTime: null, duration: null };
    setCurrentSession(session);
  };

  const endSession = () => {
    if (currentSession) {
      currentSession.endTime = new Date();
      currentSession.duration =
        (currentSession.endTime - currentSession.startTime) / 1000; // in seconds
      setSessions([...sessions, currentSession]);
      setCurrentSession(null);
    }
  };

  const toggleTimer = () => {
    if (!isActive) {
      startSession();
    } else {
      endSession();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    endSession();
  };

  const formatTime = (duration) => {
    if (duration < 60) {
      return duration === 1 ? `${duration} second` : `${duration} seconds`;
    } else {
      const minutes = Math.floor(duration / 60);
      const remainingSeconds = Math.floor(duration % 60);
      const minuteLabel = minutes === 1 ? "minute" : "minutes";
      const secondLabel = remainingSeconds === 1 ? "second" : "seconds";
      return `${minutes} ${minuteLabel} ${remainingSeconds} ${secondLabel}`;
    }
  };

  const totalSeconds = minutes * 60 + seconds;
  const totalTime = 25 * 60; // Assuming 25 minutes for a Pomodoro session
  const progress = (totalTime - totalSeconds) / totalTime;

  return (
    <>
      <div className="w-full top-0">
        <Header />
        <div className="w-full h-10 bg-gray-300">
          <div
            className="h-full bg-green-500"
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-full pt-10 mt-10">
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
        {sessions.length > 0 && (
          <div className="mt-10 text-center">
            <h2 className="text-xl font-bold mb-2">Session History</h2>
            <div className="flex space-x-4">
              {sessions.map((session, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded shadow-md">
                  <p className="font-bold">{`Session ${index + 1}:`}</p>
                  <p>{formatTime(session.duration)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PomodoroTimer;
