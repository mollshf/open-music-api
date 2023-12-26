// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

// const { debugConsole } = require('../../../utils/debug/chalkConsole');
const NotFoundError = require('../../exception/NotFoundError');
const InvariantError = require('../../exception/InvariantError');
const { mapViewData } = require('../../../utils/mapDBToModel');

class SongsServices {
  constructor() {
    this.pool = new Pool();
  }

  async addSongs({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(10)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING id`,
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    // if there is no request.query every query or no using query do this
    if (!title && !performer) {
      console.log('ahahah');
      const result = await this.pool.query('SELECT * FROM songs');
      const mapResult = result.rows.map(mapViewData);
      return mapResult;
    }

    // if using query do this
    const query = {
      text: `SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)`,
      values: [`%${title}%`, `%${performer}%`],
    };
    const result = await this.pool.query(query);
    const mapResult = result.rows.map(mapViewData);
    return mapResult;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM songs WHERE id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `UPDATE songs SET title = $1, year = $2,  performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM songs WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new NotFoundError('Gagal menghapus song, Id tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = SongsServices;
