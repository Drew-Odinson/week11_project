const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, './public')));


app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    let newNote = req.body;

    newNote.id = allNotes.length + 1; 
    allNotes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(allNotes), err => {
      if (err) throw err;
      res.json(allNotes);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    json = json.filter(note => note.id !== noteId);
    fs.writeFile('./db/db.json', JSON.stringify(json), err => {
      if (err) throw err;
      res.json(json);
    });
  });
});

console.log(__dirname); 
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
