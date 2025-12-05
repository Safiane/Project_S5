// utils/songs.repository.js
const pool = require(__dirname + '\\db.include.js');

function normalizeDate(dateValue) {
  if (!dateValue) return null;
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue.split('T')[0];
  }
  return dateValue;
}

module.exports = {
  async getAllSongs() {
    try {
      const sql = 'SELECT * FROM Song';
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getOneSong(songId) {
    try {
      const sql = 'SELECT * FROM Song WHERE ID_Song = ?';
      const [rows] = await pool.execute(sql, [songId]);
      if (rows.length === 1) {
        return rows[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async addOneSong(title, releaseDate, duration, language, nbListening, albumId) {
    try {
      const sql = `
        INSERT INTO Song
        (Song_Title, Song_Release_Date, Duration, Language, Nb_Listening, ID_Album)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [okPacket] = await pool.execute(sql, [
        title,
        normalizeDate(releaseDate) || null,
        duration || null,
        language || null,
        nbListening || 0,
        albumId,
      ]);
      return okPacket.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async editOneSong(songId, title, releaseDate, duration, language, nbListening, albumId) {
    try {
      const sql = `
        UPDATE Song
        SET Song_Title = ?, Song_Release_Date = ?, Duration = ?, Language = ?,
            Nb_Listening = ?, ID_Album = ?
        WHERE ID_Song = ?
      `;
      const [okPacket] = await pool.execute(sql, [
        title,
        normalizeDate(releaseDate) || null,
        duration || null,
        language || null,
        nbListening || 0,
        albumId,
        songId,
      ]);
      return okPacket.affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async delOneSong(songId) {
    try {
      const sql = 'DELETE FROM Song WHERE ID_Song = ?';
      const [okPacket] = await pool.execute(sql, [songId]);
      return okPacket.affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
