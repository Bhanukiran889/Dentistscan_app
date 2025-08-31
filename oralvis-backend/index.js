const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db")
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("OralVis Healthcare Backend is running...");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
