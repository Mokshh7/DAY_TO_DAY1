import { useState } from "react";
import "./Card.css";

function Card({ workoutDay, addWorkout }) {
  const [exercise, setExercise] = useState("");

  const [numberOfSets, setNumberOfSets] = useState("");

  const [sets, setSets] = useState([]);

  function create_sets(){
    const newSets = []
     for (let i = 0; i < Number(numberOfSets); i++) {
      newSets.push({
     reps : "",
     weight : ""
      });
    }
    setSets(newSets)
  }
 function update_reps(index,value){
    const updated_sets = [...sets]
    updated_sets[index].reps = value
    setSets(updated_sets)
 }
 
 function update_weight(index,value){
    const updated_sets = [...sets]
    updated_sets[index].weight = value
    setSets(updated_sets)
 }

  async function saveWorkout() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (!exercise || sets.length === 0) {
      return;
    }

    const workout = {
      exercise: exercise,
      sets: sets,
      time: `${hours}:${minutes}:${seconds}`
    };

    try {
      await addWorkout(workoutDay.date, workout);
      setExercise("");
      setNumberOfSets("");
      setSets([]);
    } catch (error) {
      window.alert(`${error.message} Your workout has not been saved.`);
    }
  }

  return (
    <div className="workout-card">
      <h2>Workout</h2>

      <p>Date: {workoutDay.date}</p>

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
          value={numberOfSets}
          onChange={(e) => setNumberOfSets(e.target.value)}
        />
        <button onClick={create_sets}> CREATE SETS </button>
      
        {sets.map((set,index) => (
          <div className="setbox" key={index}>
            <label >
              SET : {index + 1} 
            </label>

            <input
              type="number"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => {
                update_reps(index,e.target.value)
              }}
            />
            <input
              type="number"
              placeholder="weight"
              value={set.weight}
              onChange={(e) => {
                update_weight(index,e.target.value)
              }}
              />
          </div>
        ))}





        <button onClick={saveWorkout}>
          Add Exercise
        </button>

      </div>

      <div className="saved-workouts">

        {workoutDay.workouts.map((workout, index) => (
          <div className="exercise" key={index}>

            <p>
              TIME : {workout.time}
            </p>

            <h3>{workout.exercise}</h3>

            <p>
             { workout.sets.map((val,index) => (
                <div key={index} className="sets">
                  SET-{index + 1} : {val.reps} REPS  {val.weight} KG

                </div>
              ))}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Card;
