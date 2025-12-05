// controllers/artistsapi.route.js
const express = require('express');
const router = express.Router();

const artistRepo = require('../utils/artists.repository');

// GET list of artists
router.get('/list', artistListAction);

// GET one artist
router.get('/show/:artistId', artistShowAction);

// DELETE artist
router.get('/del/:artistId', artistDelAction);

// CREATE/UPDATE artist (pattern comme carUpdateAction)
router.post('/update/:artistId', artistUpdateAction);

// http://localhost:9000/artistsapi/list
async function artistListAction(req, res) {
  const artists = await artistRepo.getAllArtists();
  res.send(JSON.stringify(artists));
}

async function artistShowAction(req, res) {
  const oneArtist = await artistRepo.getOneArtist(req.params.artistId);
  res.send(JSON.stringify(oneArtist));
}

async function artistDelAction(req, res) {
  const numRows = await artistRepo.delOneArtist(req.params.artistId);
  const result = { rowsDeleted: numRows };
  res.send(JSON.stringify(result));
}

async function artistUpdateAction(req, res) {
  const json = JSON.stringify(req.body);
  console.log(json);

  // TODO: validation
  let artistId = req.params.artistId;

  if (artistId === '0') {
    // create
    artistId = await artistRepo.addOneArtist(
      req.body.Name,
      req.body.Style,
      req.body.Country,
      req.body.Gender,
      req.body.Start_Date
    );
  } else {
    // update
    await artistRepo.editOneArtist(
      artistId,
      req.body.Name,
      req.body.Style,
      req.body.Country,
      req.body.Gender,
      req.body.Start_Date
    );
  }

  const result = { artistId: Number(artistId) };
  res.send(JSON.stringify(result));
}

module.exports = router;
