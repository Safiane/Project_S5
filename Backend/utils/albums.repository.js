// utils/albums.repository.js

const pool = require(__dirname + '\\db.include.js');

function normalizeDate(dateValue) {
  if (!dateValue) return null;

  if (typeof dateValue === 'string' && dateValue.includes('T')) {
    return dateValue.split('T')[0];
  }

  return dateValue;
}

module.exports = {
  async getAllAlbums() {
    try {
      const sql = 'SELECT * FROM Album';
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getOneAlbum(albumId) {
    try {
      const sql = 'SELECT * FROM Album WHERE ID_Album = ?';
      const [rows] = await pool.execute(sql, [albumId]);
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

  async addOneAlbum(title, releaseDate, type, recordCompany, collaborations, artistId) {
    try {
      const sql = `
        INSERT INTO Album
        (Album_Title, Album_Release_Date, Album_Type, Record_Company, Collaborations, ID_Artist)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [okPacket] = await pool.execute(sql, [
        title,
        normalizeDate(releaseDate) || null,
        type || null,
        recordCompany || null,
        collaborations || null,
        artistId,
      ]);
      return okPacket.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async editOneAlbum(albumId, title, releaseDate, type, recordCompany, collaborations, artistId) {
    try {
      const sql = `
        UPDATE Album
        SET Album_Title = ?, Album_Release_Date = ?, Album_Type = ?,
            Record_Company = ?, Collaborations = ?, ID_Artist = ?
        WHERE ID_Album = ?
      `;
      const [okPacket] = await pool.execute(sql, [
        title,
        normalizeDate(releaseDate) || null,
        type || null,
        recordCompany || null,
        collaborations || null,
        artistId,
        albumId,
      ]);
      return okPacket.affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async delOneAlbum(albumId) {
    try {
      const sql = 'DELETE FROM Album WHERE ID_Album = ?';
      const [okPacket] = await pool.execute(sql, [albumId]);
      return okPacket.affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
