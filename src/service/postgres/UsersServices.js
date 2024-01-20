const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const AuthenticationError = require('../../exception/AuthenticationsError');

class UsersServices {
  constructor() {
    this.pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id`,
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: `SELECT * FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await this.pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan username, Username sudah digunakan');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: `SELECT id, password FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial Salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial Salah');
    }

    return id;
  }
}

module.exports = UsersServices;
