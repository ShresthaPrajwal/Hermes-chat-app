const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./service/db");
const router = require("./routers/index");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "started" });
});
app.use("/api", router);
module.exports = app;
