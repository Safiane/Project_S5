// utils/users.repository.js

const bcrypt = require('bcryptjs');
const pool = require(__dirname + '\\db.include.js');

// TODO (plus tard): Registration (INSERT INTO users ...)
async function registerUser(username, password, role = 'USER') {
  const hash = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO users (user_name, user_email, user_pass, user_role)
    VALUES (?, ?, ?, ?)
  `;
  const email = `${username}@example.com`;
  const [result] = await pool.execute(sql, [username, email, hash, role]);
  return result.insertId;
}
// TODO (plus tard): Edit user, change password, etc.

module.exports = {
  async getOneUser(userName) {
    try {
      const sql = `
        SELECT user_id, user_name, user_email, user_role
        FROM users
        WHERE user_name = ?
      `;
      // Ne jamais renvoyer le hash de mot de passe au frontend
      const [rows] = await pool.execute(sql, [userName]);
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

  async areValidCredentials(username, password) {
    try {
      const sql = `
        SELECT *
        FROM users
        WHERE user_name = ?
      `;
      const [rows] = await pool.execute(sql, [username]);

      console.log('CHECKING USER...');
      console.log(rows);

      if (rows.length === 1 && rows[0].user_name === username) {
        const result = await bcrypt.compare(password, rows[0].user_pass);
        return result;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // Exemple d’INSERT pour une future registration simple
  async registerUser(username, email, password, role) {
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      const sql = `
        INSERT INTO users (user_name, user_email, user_pass, user_role)
        VALUES (?, ?, ?, ?)
      `;
      const [okPacket] = await pool.execute(sql, [
        username,
        email || null,
        hash,
        role || 'USER',
      ]);
      return okPacket.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
