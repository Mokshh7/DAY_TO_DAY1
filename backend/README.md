# Workout tracker API

The API stores workout days, exercises, and their sets in MySQL. On startup it creates the three required tables in the configured database when they do not already exist. Create the database itself first, then copy `.env.example` to `.env` and enter your local MySQL credentials.

Run with `npm start` (or `npm run dev` while developing). The server listens on port 3000 by default.

## Endpoints

- `GET /api/health` checks the API and MySQL connection.
- `GET /api/workout-days` returns `[{ date, workouts: [{ exercise, time, sets: [{ reps, weight }] }] }]`.
- `POST /api/workout-days` with `{ "date": "YYYY-MM-DD" }` creates a day (or returns the existing day).
- `POST /api/workout-days/:date/workouts` with `{ "exercise": "Squat", "time": "09:30:00", "sets": [{ "reps": 8, "weight": 40 }] }` saves a workout and creates the day if needed.

The React frontend in this repository currently has no HTTP calls; it manages workouts in browser memory. The API and CORS support are ready, but persisting/loading through this API requires adding fetch calls in the frontend, which was left unchanged as requested.
