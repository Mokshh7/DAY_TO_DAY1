const mysql = require("mysql2/promise")
require("dotenv").config()

const requiredSettings = ["DB_HOST", "DB_USER", "DB_NAME"]
const missingSettings = requiredSettings.filter((setting) => !process.env[setting])
if (missingSettings.length) {
    throw new Error(`Missing database settings: ${missingSettings.join(", ")}`)
}

const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
    timezone: "Z"
})

module.exports = pool
