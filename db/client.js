
const { Pool } = require('pg');
const { config } = require("dotenv");
config()

// const connectionString =
//   process.env.DATABASE_URL || "postgres://localhost:5432/fitness-dev";
const {
  USER,
  HOST,
  DATABASE,
  PASSWORD,
  PORT,
} = process.env

const client = new Pool({
  // connectionString,
  // ssl:
  //   process.env.NODE_ENV === "production"
  //     ? { rejectUnauthorized: false }
  //     : undefined,
  user: USER,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: PORT,
});


module.exports = client;
