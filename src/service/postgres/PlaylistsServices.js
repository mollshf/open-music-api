const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class PlaylistsServices {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO playlists VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllPlaylists(owner) {
    const query = {
      text: `SELECT * FROM playlists WHERE owner = $1`,
      values: [owner],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistsServices;
