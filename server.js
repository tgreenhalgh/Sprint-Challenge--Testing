const express = require('express');
const server = express();
const PORT = 3005;
const { gameConstraints } = require('./middleware');
const errors = require('./middleware/errors');
server.use(express.json());

// in memory "fake" database
let games = [];
// always increments when add a game
let id = 0;

// base endpoint to ensure server is working
server.get('/', (req, res) => {
  res.status(200).json({ server: 'running' });
});

/*
 GET endpoints
*/
server.get('/games', (req, res) => {
  res.status(200).json({ games });
});

server.get('/games/:id', (req, res) => {
  const { id } = req.params;
  const game = games.filter(g => g.id == id);

  if (game.length === 1) {
    res.status(200).json({ game });
  } else {
    res.status(404).json({ error: `Game id:${id} not in the database` });
  }
});

/*
 POST endpoints
*/
server.post('/games', gameConstraints, (req, res) => {
  const { title, genre, releaseYear } = req;
  // increment ID count
  id++;
  const newGame = {
    id,
    title,
    genre,
    releaseYear,
  };
  let dupGame = false;

  for (let i = 0; i < games.length; i++) {
    if (games[i].title === newGame.title) {
      dupGame = true;
    }
  }
  if (!dupGame) {
    games.push(newGame);
    res.status(200).json({ games });
  } else {
    res
      .status(405)
      .json({ error: `That game title is already in the database` });
  }
});

/*
 DELETE endpoints
*/
server.delete('/games/:id', (req, res) => {
  const { id } = req.params;
  const game = games.filter(g => g.id == id);

  if (game.length === 1) {
    games = games.filter(g => g.id != id);
    res.status(200).json({ games });
  } else {
    res.status(404).json({ error: `Game id:${id} not in the database` });
  }
});

/*
 Error handling
*/
server.use(errors);

// not found - 404
server.use((req, res) => {
  res.status(404).send(`<h1>404: resource "${req.url}" not found</h1>`);
});

if (true) {
  module.exports = server;
} else {
  server.listen(
    PORT,
    console.log(`\n=== Web API Listening on http://localhost:${PORT} ===\n`),
  );
}
