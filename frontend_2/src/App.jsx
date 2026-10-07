import { useEffect, useState } from "react";
import Card from "./components/Card";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [workoutDays, setWorkoutDays] = useState([]);

  // Load existing workout data from backend
  useEffect(() => {
    fetch(`${API_URL}/api/workout-days`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load workouts from the server.");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Workouts loaded:", data);
        setWorkoutDays(data);
      })
      .catch((error) => {
        console.error("Load error:", error);

        window.alert(
          `${error.message} Make sure the backend and MySQL are running.`
        );
      });
  }, []);

  // Create today's workout day
  async function addWorkoutDay() {
    const now = new Date();

    const today = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Don't create duplicate day
    if (workoutDays.some((day) => day.date === today)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/workout-days`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: today,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create a workout day.");
      }

      const day = await response.json();

      setWorkoutDays((days) =>
        days.some((item) => item.date === day.date)
          ? days
          : [day, ...days]
      );
    } catch (error) {
      console.error("Add workout day error:", error);

      window.alert(
        `${error.message} Make sure the backend and MySQL are running.`
      );
    }
  }

  // Add an exercise/workout to a particular day
  async function addWorkout(date, workout) {
    try {
      const response = await fetch(
        `${API_URL}/api/workout-days/${date}/workouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workout),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));

        throw new Error(
          result.error || "Could not save the workout."
        );
      }

      const savedWorkout = await response.json();

      console.log("Workout saved:", savedWorkout);

      setWorkoutDays((days) =>
        days.map((day) =>
          day.date === date
            ? {
                ...day,
                workouts: [...day.workouts, savedWorkout],
              }
            : day
        )
      );
    } catch (error) {
      console.error("Save workout error:", error);
      throw error;
    }
  }

  return (
    <div className="app">
      <h1>Gym Tracker</h1>

      <button className="add-btn" onClick={addWorkoutDay}>
        START ADDING WORKOUTS
      </button>

      <div className="cards-container">
        {workoutDays.map((day) => (
          <Card
            key={day.date}
            workoutDay={day}
            addWorkout={addWorkout}
          />
        ))}
      </div>
    </div>
  );
}

export default App;