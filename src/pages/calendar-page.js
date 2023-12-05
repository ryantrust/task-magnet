import React, { useState } from "react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale"; // Add this import

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  const addTask = () => {
    if (task && date) {
      setTasks([...tasks, { date }]);
      setTask("");
      setDate("");
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const generateDays = () => {
    const startDate = startOfWeek(startOfMonth(new Date()), {
      weekStartsOn: 0,
    });
    const endDate = endOfWeek(endOfMonth(new Date()), { weekStartsOn: 0 });
    const days = [];

    for (
      let i = 0;
      i < Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      i++
    ) {
      const currentDate = addDays(startDate, i);
      const formattedDate = format(addDays(currentDate, 1), "yyyy-MM-dd");
      days.push(formattedDate);
    }

    return days;
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="container mx-auto mt-8 text-center">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          {format(new Date(), "MMMM yyyy", { locale: enUS })}
        </h2>
      </div>
      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 mr-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2" onClick={addTask}>
          Add Task
        </button>
      </div>

      <table className="table-fixed border-collapse mx-auto">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day} className="border p-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {daysOfWeek.map((_, colIndex) => {
                const formattedDate =
                  generateDays()[rowIndex * daysOfWeek.length + colIndex];
                const dayTasks = tasks.filter((t) => t.date === formattedDate);

                return (
                  <td
                    key={formattedDate}
                    className={`border p-4 relative ${
                      colIndex === 0
                        ? "text-red-500"
                        : colIndex === 6
                        ? "text-blue-500"
                        : ""
                    }`}
                  >
                    <div className="text-lg font-semibold mb-2">
                      {format(new Date(formattedDate), "d")}
                    </div>
                    {dayTasks.length > 0 && (
                      <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Calendar />
    </div>
  );
}

export default App;
