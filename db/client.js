
const { Pool } = require('pg');
const { config } = require("dotenv");
config()

//const connectionString = process.env.DATABASE_URL 
const {
  USER,
  HOST,
  DATABASE,
  PORT,
} = process.env

const client = new Pool({
  user: USER,
  host: HOST,
  database: DATABASE,
  port: PORT,
});




//const client = new Pool({
  //connectionString})

module.exports = client;
