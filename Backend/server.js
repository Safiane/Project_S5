const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const dataDir = path.join(__dirname, 'data')

const artists = require(path.join(dataDir, 'artists.json'))
const albums  = require(path.join(dataDir, 'albums.json'))
const songs   = require(path.join(dataDir, 'songs.json'))

app.get('/api/artists', (req, res) => {
  res.json(artists)
})

app.get('/api/albums', (req, res) => {
  res.json(albums)
})

app.get('/api/songs', (req, res) => {
  res.json(songs)
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
