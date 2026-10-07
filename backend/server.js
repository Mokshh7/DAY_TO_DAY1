const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(",").map((value) => value.trim()) || true }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", error.message);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.get("/api/workout-days", async (_req, res, next) => {
  try {
    const [days] = await pool.query("SELECT workout_date FROM workout_days ORDER BY workout_date DESC");
    const [exercises] = await pool.query(
      "SELECT id, workout_date, exercise, workout_time FROM workout_exercises ORDER BY workout_date DESC, id"
    );
    const [sets] = await pool.query(
      "SELECT exercise_id, set_number, reps, weight FROM workout_sets ORDER BY exercise_id, set_number"
    );

    const setsByExercise = new Map();
    for (const set of sets) {
      const items = setsByExercise.get(set.exercise_id) || [];
      items.push({ reps: String(set.reps), weight: String(set.weight) });
      setsByExercise.set(set.exercise_id, items);
    }
    const exercisesByDay = new Map();
    for (const exercise of exercises) {
      const date = formatDate(exercise.workout_date);
      const items = exercisesByDay.get(date) || [];
      items.push({ exercise: exercise.exercise, time: exercise.workout_time, sets: setsByExercise.get(exercise.id) || [] });
      exercisesByDay.set(date, items);
    }

    res.json(days.map(({ workout_date: date }) => {
      const formattedDate = formatDate(date);
      return { date: formattedDate, workouts: exercisesByDay.get(formattedDate) || [] };
    }));
  } catch (error) {
    next(error);
  }
});

app.post("/api/workout-days", async (req, res, next) => {
  const date = req.body?.date;
  if (!isDate(date)) return res.status(400).json({ error: "date must be YYYY-MM-DD" });
  try {
    await pool.query("INSERT IGNORE INTO workout_days (workout_date) VALUES (?)", [date]);
    res.status(201).json({ date, workouts: [] });
  } catch (error) {
    next(error);
  }
});

app.post("/api/workout-days/:date/workouts", async (req, res, next) => {
  const { date } = req.params;
  const { exercise, time, sets } = req.body || {};
  if (!isDate(date)) return res.status(400).json({ error: "date must be YYYY-MM-DD" });
  if (typeof exercise !== "string" || !exercise.trim() || exercise.length > 150) {
    return res.status(400).json({ error: "exercise must be a non-empty string of at most 150 characters" });
  }
  if (!Array.isArray(sets) || sets.length < 1 || sets.length > 100 || sets.some((set) =>
    !set || !Number.isFinite(Number(set.reps)) || Number(set.reps) < 0 ||
    !Number.isFinite(Number(set.weight)) || Number(set.weight) < 0
  )) {
    return res.status(400).json({ error: "sets must contain 1 to 100 sets with non-negative numeric reps and weight" });
  }
  const workoutTime = typeof time === "string" && /^\d{1,2}:\d{2}:\d{2}$/.test(time) ? time : new Date().toTimeString().slice(0, 8);

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await connection.query("INSERT IGNORE INTO workout_days (workout_date) VALUES (?)", [date]);
    const [result] = await connection.query(
      "INSERT INTO workout_exercises (workout_date, exercise, workout_time) VALUES (?, ?, ?)",
      [date, exercise.trim(), workoutTime]
    );
    for (const [index, set] of sets.entries()) {
      await connection.query(
        "INSERT INTO workout_sets (exercise_id, set_number, reps, weight) VALUES (?, ?, ?, ?)",
        [result.insertId, index + 1, Number(set.reps), Number(set.weight)]
      );
    }
    await connection.commit();
    res.status(201).json({ id: result.insertId, exercise: exercise.trim(), time: workoutTime, sets: sets.map((set) => ({ reps: String(set.reps), weight: String(set.weight) })) });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    connection?.release();
  }
});

app.use((error, _req, res, _next) => {
  console.error("Request failed:", error.message);
  res.status(500).json({ error: "Internal server error" });
});

function formatDate(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
}

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workout_days (
      workout_date DATE PRIMARY KEY
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      workout_date DATE NOT NULL,
      exercise VARCHAR(150) NOT NULL,
      workout_time TIME NOT NULL,
      INDEX idx_workout_exercises_date (workout_date),
      CONSTRAINT fk_workout_exercises_day FOREIGN KEY (workout_date)
        REFERENCES workout_days (workout_date) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workout_sets (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      exercise_id BIGINT UNSIGNED NOT NULL,
      set_number SMALLINT UNSIGNED NOT NULL,
      reps DECIMAL(8,2) NOT NULL,
      weight DECIMAL(8,2) NOT NULL,
      UNIQUE KEY uq_workout_set_number (exercise_id, set_number),
      CONSTRAINT fk_workout_sets_exercise FOREIGN KEY (exercise_id)
        REFERENCES workout_exercises (id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  app.listen(port, () => console.log(`Workout API listening on ${port}`));
}

start().catch((error) => {
  console.error("Could not start API. Check MySQL settings and database availability:", error.message);
  process.exit(1);
});
