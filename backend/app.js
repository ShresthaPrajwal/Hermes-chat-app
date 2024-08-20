const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./service/db");
const router = require("./routers/index");
const { handleSocketConnection } = require("./controllers/socketController");
const app = express();
const server = http.createServer(app);

const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "started" });
});
app.use("/api", router);

handleSocketConnection(io);
module.exports = app;
