const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors()) 


const artists = require(path.join(__dirname, '../Frontend/public/data/artists.json'))
const albums = require(path.join(__dirname, '../Frontend/public/data/albums.json'))
const songs = require(path.join(__dirname, '../Frontend/public/data/songs.json'))


app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Backend skeleton is running" })
})

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
