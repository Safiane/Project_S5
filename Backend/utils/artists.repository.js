// utils/artists.repository.js
const pool = require(__dirname + '\\db.include.js');

function normalizeDate(dateValue) {
  if (!dateValue) return null;
  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue.split('T')[0];
  }
  return dateValue;
}

module.exports = {
  async getAllArtists() {
    try {
      const sql = 'SELECT * FROM Artist';
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getOneArtist(artistId) {
    try {
      const sql = 'SELECT * FROM Artist WHERE ID_Artist = ?';
      const [rows] = await pool.execute(sql, [artistId]);
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

  async addOneArtist(name, style, country, gender, startDate) {
    try {
      const sql = `
        INSERT INTO Artist (Name, Style, Country, Gender, Start_Date)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [okPacket] = await pool.execute(sql, [
        name,
        style || null,
        country || null,
        gender || null,
        normalizeDate(startDate) || null,
      ]);
      return okPacket.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async editOneArtist(artistId, name, style, country, gender, startDate) {
    try {
      const sql = `
        UPDATE Artist
        SET Name = ?, Style = ?, Country = ?, Gender = ?, Start_Date = ?
        WHERE ID_Artist = ?
      `;
      const [okPacket] = await pool.execute(sql, [
        name,
        style || null,
        country || null,
        gender || null,
        normalizeDate(startDate) || null,
        artistId,
      ]);
      return okPacket.affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async delOneArtist(artistId) {
    try {
      const sql = 'DELETE FROM Artist WHERE ID_Artist = ?';
      const [okPacket] = await pool.execute(sql, [artistId]);
      return okPacket.affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
