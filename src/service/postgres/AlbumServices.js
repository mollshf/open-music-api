// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const { debugConsole } = require('../../../utils/debug/chalkConsole');

class AlbumServices {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album ${nanoid(6)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO($1)',
      values: [],
    };

    const isSuccess = await this.pool();

    if (!isSuccess) {
      throw Error('Album gagal ditambahkan');
    }
    debugConsole(id, 'add album debug console');
    return id;
  }

  async getAlbums() {
    return this.pool;
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
