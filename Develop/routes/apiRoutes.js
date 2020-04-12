var express = require("express");
var app = express();
var PORT = process.env.port || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

module.exports = function (app) {
  app.get("/assets/css/styles.css", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/css/styles.css"));
  });

  app.get("/assets/js/index.js", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/js/index.js"));
  });

  app.get("/api/notes", function (req, res) {
    readFileAsync("./db/db.json", "utf8").then(function (data) {
      if (data) {
        const noteJSON = JSON.parse(data);
        return res.json(noteJSON);
      } else {
        return res.json("");
      }
    });
  });

  // Create New Notes - takes in JSON input
  app.post("/api/notes", function (req, res) {
    const writeNotes = [];
    let newNote;
    readFileAsync("./db/db.json", "utf8").then(function (data) {
      // Checking if db.json contains any data or empty.
      if (data) {
        const noteJSON = JSON.parse(data);
        //Getting id of the last note in db.json
        let lastId = noteJSON[noteJSON.length - 1].id;
        newNote = req.body;
        newNote.id = ++lastId;
        // For each note in note taker
        noteJSON.forEach(function (note) {
          writeNotes.push(note);
        });
      } else {
        newNote = req.body;
        //Initialising id with 1 when first note is being added into the file.
        newNote.id = 1;
      }

      writeNotes.push(newNote);
      const addNoteJSON = JSON.stringify(writeNotes, null, 2);
      writeFileAsync("./db/db.json", addNoteJSON);
      res.json(newNote);
    });
  });

  app.delete("/api/notes/:id", function (req, res) {
    var selected = req.params.id;
    readFileAsync("./db/db.json", "utf8").then(function (data) {
      // Parse the JSON string to an object
      const notesJSON = JSON.parse(data);
      const notes = [];
      // For each element in notes
      notesJSON.forEach(function (note) {
        if (!(note.id === parseInt(selected))) {
          notes.push(note);
        }
      });
      // Turn the arrays into JSON strings so they can be written to files
      const writeJSON = JSON.stringify(notes, null, 2);
      //Checking db.Json is empty with "[]" or containing any data.
      if (writeJSON.length === 2) {
        writeFileAsync("./db/db.json", "").then(function () {
          return res.json(notes);
        });
      } else {
        writeFileAsync("./db/db.json", writeJSON).then(function () {
          return res.json(notes);
        });
      }
    });
  });
};
