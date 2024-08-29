const express = require("express");
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./service/db");
const router = require("./routers/index");
const initializeSocket = require('./sockets/socket'); 

const app = express();
const server = http.createServer(app); 

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render("index");  
});

app.use("/api", router);

initializeSocket(server);

module.exports = { app, server };
