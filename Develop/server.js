// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var notes = [{ title: "Test Title", text: "Test text" }];

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/assets/css/styles.css", function (req, res) {
  res.sendFile(path.join(__dirname, "public/assets/css/styles.css"));
});

app.get("/assets/js/index.js", function (req, res) {
  res.sendFile(path.join(__dirname, "public/assets/js/index.js"));
});

app.get("/api/notes", function (req, res) {
  return res.json(notes);
});

// Create New Notes - takes in JSON input
app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  console.log("Recent one is:", newNote);
  notes.push(newNote);
  console.log("Total is:", notes);
  res.json(newNote);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
