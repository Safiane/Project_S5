// controllers/albumsapi.route.js
const express = require('express');
const router = express.Router();

const albumRepo = require('../utils/albums.repository');

// GET list of albums
router.get('/list', albumListAction);

// GET one album
router.get('/show/:albumId', albumShowAction);

// DELETE album
router.get('/del/:albumId', albumDelAction);

// CREATE/UPDATE album
router.post('/update/:albumId', albumUpdateAction);

// http://localhost:PORT/albumsapi/list
async function albumListAction(req, res) {
  const albums = await albumRepo.getAllAlbums();
  res.send(JSON.stringify(albums));
}

async function albumShowAction(req, res) {
  const oneAlbum = await albumRepo.getOneAlbum(req.params.albumId);
  res.send(JSON.stringify(oneAlbum));
}

async function albumDelAction(req, res) {
  const numRows = await albumRepo.delOneAlbum(req.params.albumId);
  const result = { rowsDeleted: numRows };
  res.send(JSON.stringify(result));
}

async function albumUpdateAction(req, res) {
  const json = JSON.stringify(req.body);
  console.log(json);

  // TODO: validation
  let albumId = req.params.albumId;

  if (albumId === '0') {
    // create
    albumId = await albumRepo.addOneAlbum(
      req.body.Album_Title,
      req.body.Album_Release_Date,
      req.body.Album_Type,
      req.body.Record_Company,
      req.body.Collaborations,
      req.body.ID_Artist
    );
  } else {
    // update
    await albumRepo.editOneAlbum(
      albumId,
      req.body.Album_Title,
      req.body.Album_Release_Date,
      req.body.Album_Type,
      req.body.Record_Company,
      req.body.Collaborations,
      req.body.ID_Artist
    );
  }

  const result = { albumId: Number(albumId) };
  res.send(JSON.stringify(result));
}

module.exports = router;
