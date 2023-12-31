// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const NotFoundError = require('../../exception/NotFoundError');
const InvariantError = require('../../exception/InvariantError');

class AlbumServices {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(10)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this.pool.query('SELECT * FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT
    albums.id AS id,
    albums.name AS name,
    albums.year AS year,
    CASE
      WHEN COUNT(songs.id) > 0 THEN
        jsonb_agg(
          jsonb_build_object(
            'id', songs.id,
            'title', songs.title,
            'performer', songs.performer
          )
        )
      ELSE
        '[]'::jsonb
    END AS songs
    FROM albums
    LEFT JOIN songs ON albums.id = songs.album_id
    WHERE albums.id = $1
    GROUP BY albums.id, albums.name, albums.year`,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE albums SET name = $1, year = $2,  updated_at = $3 WHERE id = $4 RETURNING id`,
      values: [name, year, updatedAt, id],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM albums WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Gagal menghapus Album. Id tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = AlbumServices;
