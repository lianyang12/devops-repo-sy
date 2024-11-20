var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 4000;
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '2mb'}));

app.use(express.static("./instrumented"));

const { addGame } = require('./util/sheng-yang-backend')
app.post('/add-game', addGame);

const { getGames } = require('./util/zhixiang-backend')
app.get('/get-games', getGames);

const { editGame, deleteGame } = require('./util/zhixiang-backend')
app.put('/edit-game/:id', editGame);
app.delete('/delete-game/:id', deleteGame);

const { viewGames } = require('./util/justin-backend')
app.get('/view-game', viewGames);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/instrumented/" + startPage);
});

server = app.listen(PORT, function () {
  const address = server.address();
  const baseUrl = `http://${
    address.address == "::" ? "localhost" : address.address
  }:${address.port}`;
  console.log(`Project hosted at: ${baseUrl}`);
});

module.exports = { app, server };
