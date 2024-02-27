const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'views', 'home.html'));
});

app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'views', 'room.html'));
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'dist', 'views', '404.html'));
});

app.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT}.`);
});
