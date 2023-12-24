// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const { debugConsole } = require('../../../utils/debug/chalkConsole');

class AlbumServices {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year }) {
    debugConsole({ name, year }, 'album service');
    const id = `album ${nanoid(6)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Album gagal ditambahkan');
    }

    return result.rows;
  }

  async getAlbums() {
    const result = await this.pool.query('SELECT * FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const album = (await this.pool.filter((data) => data.id === id).length) > 0;
    if (!album) {
      throw Error('Album tidak ditemukan');
    }
  }

  async editAlbumById(id) {
    const index = await this.pool.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new Error('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumServices;
