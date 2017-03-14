var express = require("express");
var http = require("http");
var jsonParser = require("json-parser");
var path = require("path");

var app = express();
var server = http.Server(app);
var io = require("socket.io")(server);

var socketManager = require("./local_modules/socketManager");
socketManager.SocketManager.init(io);

app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "hbs");

app.use(express.static("static"));
app.use(express.static("bower_components"));
app.use(express.static("shared"));

app.use("/", function (req, res) {
    //res.sendFile(path.join(__dirname, "views/index.hbs"));

    res.render("index");
});

app.use(function(req, res, next) {
    res.status(404);
    res.send("404 error");
});


server.listen(3000, function () {
    console.log("Listening to localhost:3000");
});