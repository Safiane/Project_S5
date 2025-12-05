// server.js (pour music_db)

// 1. Charger les variables d'environnement
const dotenv = require('dotenv');
dotenv.config();

// 2. Créer l'app Express
const express = require('express');
const app = express();

// 3. Lancer le serveur
app.listen(process.env.WEB_PORT, '0.0.0.0', () => {
  console.log('Listening on ' + process.env.WEB_PORT);
});

// 4. Middlewares
const bodyParser = require('body-parser');
app.use(
  bodyParser.json(),                // <- sans type, accepte application/json
  bodyParser.urlencoded({ extended: true })
);


const session = require('express-session');
app.use(
  session({
    secret: 'SecretRandomStringForMusicApp',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: false, secure: false },
    resave: false,
  })
);

const cors = require('cors');
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST'],
  })
);

// 5. Auth (plus tard si besoin)
// const auth = require('./utils/users.auth');
// auth.initializeAuthentications(app);
// app.use('/auth', require('./controllers/auth.route'));

// 6. Routes API musique
const artistsRouter = require('./controllers/artistsapi.route');
const albumsRouter = require('./controllers/albumsapi.route');
const songsRouter = require('./controllers/songsapi.route');

app.use('/artistsapi', artistsRouter);
app.use('/albumsapi', albumsRouter);
app.use('/songsapi', songsRouter);


// 7. Route par défaut
app.get('/', (req, res) => {
  const clientIp = req.ip;
  res.send(`Hello, dear ${clientIp}. This is the music API...`);
  res.end();
});
