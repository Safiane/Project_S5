const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Backend skeleton is running" })
})

app.get('/api/artists', (req, res) => {
  res.status(501).json({ message: "Not implemented yet" })
})

app.get('/api/albums', (req, res) => {
  res.status(501).json({ message: "Not implemented yet" })
})

app.get('/api/songs', (req, res) => {
  res.status(501).json({ message: "Not implemented yet" })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})