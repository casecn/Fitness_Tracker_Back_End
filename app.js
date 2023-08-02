require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
// Setup your Middleware and API Router here
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// const client = require("./db/client");
// client.connect();

const apiRouter = require("./api");
app.use("/api", apiRouter);
console.log('hello');

// app.get("/api/users", (req, res) => {
//   res.json({"username":"john"});
// });

// app.use( (req, res) => {
//   res.status(404);
//   res.send({ message: "Not Found" });
// });

module.exports = app;
