const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;


app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/notes.html');
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
