const express = require('express');
const notes = express.Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');
const path = require('path');

const dbFilePath = path.join(__dirname, '..', 'db', 'db.json');

notes.get('/notes', (req, res) => {
  readFromFile(dbFilePath).then((data) => {
    const notesData = JSON.parse(data).map((note) => {
      return { title: note.title, text: note.text };
    });
    res.json(notesData);
  });
});

notes.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile(dbFilePath)
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No notes with that ID');
    });
});

notes.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile(dbFilePath)
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

notes.post('/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.status(400).send('Error in adding note');
  }
});

module.exports = notes;
