// controllers/songsapi.route.js
const express = require('express');
const router = express.Router();

const songRepo = require('../utils/songs.repository');

// GET list of songs
router.get('/list', songListAction);

// GET one song
router.get('/show/:songId', songShowAction);

// DELETE song
router.get('/del/:songId', songDelAction);

// CREATE/UPDATE song
router.post('/update/:songId', songUpdateAction);

// http://localhost:PORT/songsapi/list
async function songListAction(req, res) {
  const songs = await songRepo.getAllSongs();
  res.send(JSON.stringify(songs));
}

async function songShowAction(req, res) {
  const oneSong = await songRepo.getOneSong(req.params.songId);
  res.send(JSON.stringify(oneSong));
}

async function songDelAction(req, res) {
  const numRows = await songRepo.delOneSong(req.params.songId);
  const result = { rowsDeleted: numRows };
  res.send(JSON.stringify(result));
}

async function songUpdateAction(req, res) {
  const json = JSON.stringify(req.body);
  console.log(json);

  // TODO: validation
  let songId = req.params.songId;

  if (songId === '0') {
    // create
    songId = await songRepo.addOneSong(
      req.body.Song_Title,
      req.body.Song_Release_Date,
      req.body.Duration,
      req.body.Language,
      req.body.Nb_Listening,
      req.body.ID_Album
    );
  } else {
    // update
    await songRepo.editOneSong(
      songId,
      req.body.Song_Title,
      req.body.Song_Release_Date,
      req.body.Duration,
      req.body.Language,
      req.body.Nb_Listening,
      req.body.ID_Album
    );
  }

  const result = { songId: Number(songId) };
  res.send(JSON.stringify(result));
}

module.exports = router;
