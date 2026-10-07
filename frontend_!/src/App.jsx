import { useState } from 'react'
import './App.css'
import Card from "./components/Card";

function App() {
  
  const [workoutDays, setWorkoutDays] = useState([]);
  function addWorkoutDay() {
    const today = new Date().toISOString().split("T")[0];

    const alreadyExists = workoutDays.some(
      (day) => day.date === today
    );

    if (!alreadyExists) {
      setWorkoutDays([
        ...workoutDays,
        {
          date: today,
          workouts: []
        }
      ]);
    }
  }


  
}

export default App
