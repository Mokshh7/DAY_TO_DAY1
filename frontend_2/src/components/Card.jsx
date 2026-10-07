import { useState } from "react";
import "./Card.css";

function Card({ workoutDay, addWorkout }) {
  const [exercise, setExercise] = useState("");
  const [numberOfSets, setNumberOfSets] = useState("");
  const [sets, setSets] = useState([]);

  // Create empty sets
  function createSets() {
    const number = Number(numberOfSets);

    if (!number || number < 1) {
      return;
    }

    const newSets = [];

    for (let i = 0; i < number; i++) {
      newSets.push({
        reps: "",
        weight: "",
      });
    }

    setSets(newSets);
  }

  // Update reps
  function updateReps(index, value) {
    const updatedSets = [...sets];

    updatedSets[index].reps = value;

    setSets(updatedSets);
  }

  // Update weight
  function updateWeight(index, value) {
    const updatedSets = [...sets];

    updatedSets[index].weight = value;

    setSets(updatedSets);
  }

  // Save workout
  async function saveWorkout() {
    if (!exercise.trim()) {
      window.alert("Please enter an exercise name.");
      return;
    }

    if (sets.length === 0) {
      window.alert("Please create at least one set.");
      return;
    }

    // Make sure every set has reps and weight
    const invalidSet = sets.some(
      (set) =>
        set.reps === "" ||
        set.weight === ""
    );

    if (invalidSet) {
      window.alert("Please enter reps and weight for every set.");
      return;
    }

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const workout = {
      exercise: exercise.trim(),
      time: `${hours}:${minutes}:${seconds}`,
      sets: sets.map((set) => ({
        reps: Number(set.reps),
        weight: Number(set.weight),
      })),
    };

    try {
      await addWorkout(workoutDay.date, workout);

      // Reset form
      setExercise("");
      setNumberOfSets("");
      setSets([]);
    } catch (error) {
      window.alert(
        `${error.message} Your workout has not been saved.`
      );
    }
  }

  return (
    <div className="workout-card">

      <h2>Workout</h2>

      <p>
        Date: {workoutDay.date}
      </p>

      {/* Add workout form */}
      <div className="input-box">

        <input
          type="text"
          placeholder="Exercise name"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />

        <input
          type="number"
          placeholder="Sets"
          min="1"
          value={numberOfSets}
          onChange={(e) => setNumberOfSets(e.target.value)}
        />

        <button onClick={createSets}>
          CREATE SETS
        </button>

        {/* Dynamically created sets */}
        {sets.map((set, index) => (
          <div
            className="setbox"
            key={index}
          >
            <label>
              SET : {index + 1}
            </label>

            <input
              type="number"
              placeholder="Reps"
              min="0"
              value={set.reps}
              onChange={(e) =>
                updateReps(index, e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Weight"
              min="0"
              step="0.01"
              value={set.weight}
              onChange={(e) =>
                updateWeight(index, e.target.value)
              }
            />
          </div>
        ))}

        <button onClick={saveWorkout}>
          Add Exercise
        </button>

      </div>

      {/* Saved workouts */}
      <div className="saved-workouts">

        {workoutDay.workouts.map((workout, index) => (
          <div
            className="exercise"
            key={index}
          >

            <p>
              TIME : {workout.time}
            </p>

            <h3>
              {workout.exercise}
            </h3>

            <div>
              {workout.sets.map((set, index) => (
                <div
                  key={index}
                  className="sets"
                >
                  SET-{index + 1} : {set.reps} REPS{" "}
                  {set.weight} KG
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Card;