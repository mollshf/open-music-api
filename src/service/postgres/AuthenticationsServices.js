const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class AuthenticationsServices {
  constructor() {
    this.pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: `INSERT INTO authentications VALUES($1)`,
      values: [token],
    };

    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: `SELECT token FROM authentications WHERE token = $1`,
      values: [token],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: `DELETE FROM authentications WHERE token = $1`,
      values: [token],
    };

    await this.pool.query(query);
  }
}

module.exports = AuthenticationsServices;
