const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// ====== CONNEXION MYSQL ======
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // <-- adapte à ta config
  password: 'Safianou!2906',      // <-- adapte à ta config
  database: 'music_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// ===========================
// ARTISTS CRUD
// ===========================

// GET all artists
app.get('/api/artists', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Artist')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching artists' })
  }
})

// POST create artist
app.post('/api/artists', async (req, res) => {
  const { Name, Style, Country, Gender, Start_Date } = req.body
  if (!Name) {
    return res.status(400).json({ message: 'Name is required' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Artist (Name, Style, Country, Gender, Start_Date)
       VALUES (?, ?, ?, ?, ?)`,
      [Name, Style || null, Country || null, Gender || null, Start_Date || null]
    )

    res.status(201).json({
      ID_Artist: result.insertId,
      Name,
      Style: Style || null,
      Country: Country || null,
      Gender: Gender || null,
      Start_Date: Start_Date || null
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error creating artist' })
  }
})

// PUT update artist
app.put('/api/artists/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { Name, Style, Country, Gender, Start_Date } = req.body

  try {
    const [result] = await pool.query(
      `UPDATE Artist
       SET Name = ?, Style = ?, Country = ?, Gender = ?, Start_Date = ?
       WHERE ID_Artist = ?`,
      [Name, Style || null, Country || null, Gender || null, Start_Date || null, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artist not found' })
    }

    res.json({
      ID_Artist: id,
      Name,
      Style: Style || null,
      Country: Country || null,
      Gender: Gender || null,
      Start_Date: Start_Date || null
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating artist' })
  }
})

// DELETE artist
app.delete('/api/artists/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const [result] = await pool.query(
      'DELETE FROM Artist WHERE ID_Artist = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artist not found' })
    }

    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting artist' })
  }
})

// ===========================
// ALBUMS CRUD
// ===========================

// GET all albums
app.get('/api/albums', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Album')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching albums' })
  }
})

// POST create album
app.post('/api/albums', async (req, res) => {
  const { Album_Title, Album_Release_Date, Album_Type, Record_Company, Collaborations, ID_Artist } = req.body
  if (!Album_Title || !ID_Artist) {
    return res.status(400).json({ message: 'Album_Title and ID_Artist are required' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Album
       (Album_Title, Album_Release_Date, Album_Type, Record_Company, Collaborations, ID_Artist)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Album_Title,
        Album_Release_Date || null,
        Album_Type || null,
        Record_Company || null,
        Collaborations || null,
        ID_Artist
      ]
    )

    res.status(201).json({
      ID_Album: result.insertId,
      Album_Title,
      Album_Release_Date: Album_Release_Date || null,
      Album_Type: Album_Type || null,
      Record_Company: Record_Company || null,
      Collaborations: Collaborations || null,
      ID_Artist
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error creating album' })
  }
})

// PUT update album
app.put('/api/albums/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { Album_Title, Album_Release_Date, Album_Type, Record_Company, Collaborations, ID_Artist } = req.body

  try {
    const [result] = await pool.query(
      `UPDATE Album
       SET Album_Title = ?, Album_Release_Date = ?, Album_Type = ?,
           Record_Company = ?, Collaborations = ?, ID_Artist = ?
       WHERE ID_Album = ?`,
      [
        Album_Title,
        Album_Release_Date || null,
        Album_Type || null,
        Record_Company || null,
        Collaborations || null,
        ID_Artist,
        id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Album not found' })
    }

    res.json({
      ID_Album: id,
      Album_Title,
      Album_Release_Date: Album_Release_Date || null,
      Album_Type: Album_Type || null,
      Record_Company: Record_Company || null,
      Collaborations: Collaborations || null,
      ID_Artist
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating album' })
  }
})

// DELETE album
app.delete('/api/albums/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const [result] = await pool.query(
      'DELETE FROM Album WHERE ID_Album = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Album not found' })
    }

    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting album' })
  }
})

// ===========================
// SONGS CRUD
// ===========================

// GET all songs
app.get('/api/songs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Song')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching songs' })
  }
})

// POST create song
app.post('/api/songs', async (req, res) => {
  const { Song_Title, Song_Release_Date, Duration, Language, Nb_Listening, ID_Album } = req.body
  if (!Song_Title || !ID_Album) {
    return res.status(400).json({ message: 'Song_Title and ID_Album are required' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Song
       (Song_Title, Song_Release_Date, Duration, Language, Nb_Listening, ID_Album)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Song_Title,
        Song_Release_Date || null,
        Duration || null,
        Language || null,
        Nb_Listening || 0,
        ID_Album
      ]
    )

    res.status(201).json({
      ID_Song: result.insertId,
      Song_Title,
      Song_Release_Date: Song_Release_Date || null,
      Duration: Duration || null,
      Language: Language || null,
      Nb_Listening: Nb_Listening || 0,
      ID_Album
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error creating song' })
  }
})

// PUT update song
app.put('/api/songs/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { Song_Title, Song_Release_Date, Duration, Language, Nb_Listening, ID_Album } = req.body

  try {
    const [result] = await pool.query(
      `UPDATE Song
       SET Song_Title = ?, Song_Release_Date = ?, Duration = ?, Language = ?,
           Nb_Listening = ?, ID_Album = ?
       WHERE ID_Song = ?`,
      [
        Song_Title,
        Song_Release_Date || null,
        Duration || null,
        Language || null,
        Nb_Listening || 0,
        ID_Album,
        id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Song not found' })
    }

    res.json({
      ID_Song: id,
      Song_Title,
      Song_Release_Date: Song_Release_Date || null,
      Duration: Duration || null,
      Language: Language || null,
      Nb_Listening: Nb_Listening || 0,
      ID_Album
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating song' })
  }
})

// DELETE song
app.delete('/api/songs/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const [result] = await pool.query(
      'DELETE FROM Song WHERE ID_Song = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Song not found' })
    }

    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting song' })
  }
})

// ===========================
// START SERVER
// ===========================
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
