import React, {useEffect, useState} from "react";
import {addDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek,} from "date-fns";
import {enUS} from "date-fns/locale";
import Header from "../components/header";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import DatePicker from "react-datepicker";

const adjustedDate = (time) => {
  let d = new Date(time);
  let offset = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(d.getTime() + offset);
}

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateDue, setDateDue] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    let isMounted = true;

    const fetchTokenAndTasks = async () => {
      try {
        const accessToken = await getAccessTokenSilently({authorizationParams: {audience: process.env.REACT_APP_AUTH0_AUDIENCE}});
        setAccessToken(accessToken);

        // Call getTasks right after obtaining the access token
        await getTasks(accessToken);
      } catch (error) {
        console.error('Error fetching token or tasks:', error);
      } finally {
        if (!isMounted) {

        }
      }
    };

    fetchTokenAndTasks();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  const getTasks = async (accessToken) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/api/task/`, {
        headers: {authorization: `Bearer ${accessToken}`},
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Cannot grab tasks', error);
    }
  };

  const addTask = async () => {
    if (!title || !dateDue) throw new Error();
    const newTask = { dateDue, title, description, status: 2, userId: user.sub };
    const response = await axios.post(
      `${process.env.REACT_APP_API_SERVER_URL}/api/task/`,
      newTask,
      {
        headers: { authorization: `Bearer ${accessToken}` },
      }
    );
    setTasks([...tasks, response.data]);
    setTitle("");
    setDescription("");
    return response.data;
  };

  const deleteTask = async (id) => {
    let index = tasks.findIndex(task => task._id === id);
    let newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    const response = await axios.delete(
      `${process.env.REACT_APP_API_SERVER_URL}/api/task/${id}`,
      {
        headers: { authorization: `Bearer ${accessToken}` },
      }
    );
    if (response.status !== 200) throw new Error();
  };

  const generateDays = () => {
    const startDate = startOfWeek(startOfMonth(new Date()), {
      weekStartsOn: 0,
    });
    const endDate = endOfWeek(endOfMonth(new Date()), { weekStartsOn: 0 });
    const days = [];

    for (
      let i = 0;
      i <= Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      ++i
    ) {
      const currentDate = addDays(startDate, i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      days.push(formattedDate);
    }

    return days;
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (formattedDate) => {
    setSelectedDay(formattedDate);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 text-center">
        <div className="mb-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            {format(new Date(), "MMMM yyyy", { locale: enUS })}
          </h2>
        </div>
        <div className="flex items-center justify-center mb-4">
          <input
            type="text"
            className="border p-2 mr-2 focus:outline-none focus:border-blue-500"
            placeholder="Task name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
              type="text"
              placeholder="Description"
              className="border p-2 mr-2 focus:outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
          <DatePicker
            className="border p-2 mr-2 focus:outline-none focus:border-blue-500"
            selected={dateDue}
            onChange={setDateDue}
            placeholderText="Select due date"
            calendarClassName="fixed z-50"
            showTimeInput
          />
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>

        <table className="table-fixed border-collapse mx-auto w-full">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day} className="border p-2 bg-gray-200 text-gray-700">
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
                  const dayTasks = tasks.filter(
                    (t) => new Date(t.dateDue).toDateString() === new Date(adjustedDate(formattedDate)).toDateString()
                  );

                  return (
                    <td
                      key={formattedDate}
                      className={`border p-4 relative cursor-pointer ${
                        colIndex === 0 || colIndex === 6
                          ? "text-red-500"
                          : ""
                      }`}
                      onClick={() => handleDayClick(formattedDate)}
                    >
                      <div className="text-lg font-semibold mb-2">
                        {format(adjustedDate(formattedDate), "d")}
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

        {selectedDay && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4">
                Tasks for {format(adjustedDate(selectedDay), "MMMM d, yyyy")}
              </h3>
              {tasks
                .filter((t) => new Date(t.dateDue).toDateString() === new Date(adjustedDate(selectedDay)).toDateString())
                .map((task) => (
                  <div key={task._id} className="mb-2">
                    {task.title}
                    <button
                      className="ml-2 text-red-500"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              {tasks.filter((t) => new Date(t.dateDue).toDateString() === new Date(adjustedDate(selectedDay)).toDateString()).length === 0 && (
                <p>No tasks to display</p>
              )}
              <button
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

function App() {
  return (
    <div className="App min-h-screen bg-gray-100">
      <Calendar />
    </div>
  );
}

export default App;
