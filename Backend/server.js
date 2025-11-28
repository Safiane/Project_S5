const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// dossier des fichiers JSON
const dataDir = path.join(__dirname, 'data')

const artistsFile = path.join(dataDir, 'artists.json')
const albumsFile = path.join(dataDir, 'albums.json')
const songsFile = path.join(dataDir, 'songs.json')

// petites fonctions utilitaires
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeJson(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), err => {
    if (err) {
      console.error('Error writing', filePath, err)
    }
  })
}

// données en mémoire
let artists = readJson(artistsFile)
let albums = readJson(albumsFile)
let songs = readJson(songsFile)

// ========== ARTISTS ==========

app.get('/api/artists', (req, res) => {
  res.json(artists)
})

app.post('/api/artists', (req, res) => {
  const body = req.body
  if (!body.Name) {
    return res.status(400).json({ message: 'Name is required' })
  }

  const nextId =
    artists.length === 0
      ? 1
      : Math.max(...artists.map(a => a.ID_Artist)) + 1

  const artist = {
    ID_Artist: nextId,
    Name: body.Name,
    Style: body.Style || '',
    Country: body.Country || '',
    Gender: body.Gender || '',
    Start_Date: body.Start_Date || ''
  }

  artists.push(artist)
  writeJson(artistsFile, artists)
  res.status(201).json(artist)
})

app.put('/api/artists/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = artists.findIndex(a => a.ID_Artist === id)
  if (idx === -1) {
    return res.status(404).json({ message: 'Artist not found' })
  }

  const body = req.body
  const updated = {
    ...artists[idx],
    ...body,
    ID_Artist: artists[idx].ID_Artist
  }

  artists[idx] = updated
  writeJson(artistsFile, artists)
  res.json(updated)
})

app.delete('/api/artists/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = artists.findIndex(a => a.ID_Artist === id)
  if (idx === -1) {
    return res.status(404).json({ message: 'Artist not found' })
  }

  artists.splice(idx, 1)
  writeJson(artistsFile, artists)
  res.status(204).end()
})

// ========== SONGS ==========

app.get('/api/songs', (req, res) => {
  res.json(songs)
})

app.post('/api/songs', (req, res) => {
  const body = req.body
  if (!body.Song_Title || !body.ID_Album) {
    return res.status(400).json({ message: 'Song_Title and ID_Album are required' })
  }

  const nextId =
    songs.length === 0
      ? 1
      : Math.max(...songs.map(s => s.ID_Song)) + 1

  const song = {
    ID_Song: nextId,
    Song_Title: body.Song_Title,
    Song_Release_Date: body.Song_Release_Date || '',
    Duration: body.Duration || '',
    Language: body.Language || '',
    Nb_Listening: Number(body.Nb_Listening) || 0,
    ID_Album: Number(body.ID_Album)
  }

  songs.push(song)
  writeJson(songsFile, songs)
  res.status(201).json(song)
})

app.put('/api/songs/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = songs.findIndex(s => s.ID_Song === id)
  if (idx === -1) {
    return res.status(404).json({ message: 'Song not found' })
  }

  const body = req.body
  const updated = {
    ...songs[idx],
    ...body,
    ID_Song: songs[idx].ID_Song,
    Nb_Listening: Number(body.Nb_Listening ?? songs[idx].Nb_Listening),
    ID_Album: Number(body.ID_Album ?? songs[idx].ID_Album)
  }

  songs[idx] = updated
  writeJson(songsFile, songs)
  res.json(updated)
})

app.delete('/api/songs/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = songs.findIndex(s => s.ID_Song === id)
  if (idx === -1) {
    return res.status(404).json({ message: 'Song not found' })
  }

  songs.splice(idx, 1)
  writeJson(songsFile, songs)
  res.status(204).end()
})

// ========== ALBUMS ==========

app.get('/api/albums', (req, res) => {
  res.json(albums)
})

app.post('/api/albums', (req, res) => {
  const body = req.body
  if (!body.Album_Title || !body.ID_Artist) {
    return res.status(400).json({ message: 'Album_Title and ID_Artist are required' })
  }

  const nextId =
    albums.length === 0
      ? 1
      : Math.max(...albums.map(a => a.ID_Album)) + 1

  const album = {
    ID_Album: nextId,
    Album_Title: body.Album_Title,
    Album_Release_Date: body.Album_Release_Date || '',
    Nb_Songs: Number(body.Nb_Songs) || 0,
    ID_Artist: Number(body.ID_Artist)
  }

  albums.push(album)
  writeJson(albumsFile, albums)
  res.status(201).json(album)
})

app.put('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = albums.findIndex(a => a.ID_Album === id)
  if (idx === -1) {
    return res.status(404).json({ message: 'Album not found' })
  }

  const body = req.body
  const updated = {
    ...albums[idx],
    ...body,
    ID_Album: albums[idx].ID_Album,
    Nb_Songs: Number(body.Nb_Songs ?? albums[idx].Nb_Songs),
    ID_Artist: Number(body.ID_Artist ?? albums[idx].ID_Artist)
  }

  albums[idx] = updated
  writeJson(albumsFile, albums)
  res.json(updated)
})

app.delete('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = albums.findIndex(a => a.ID_Album === id)
  if (idx === -1) {
    return res.status(404).json({ message: 'Album not found' })
  }

  albums.splice(idx, 1)
  writeJson(albumsFile, albums)
  res.status(204).end()
})

// ========== START SERVER ==========

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
