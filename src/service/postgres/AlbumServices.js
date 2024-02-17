// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const NotFoundError = require('../../exception/NotFoundError');
const InvariantError = require('../../exception/InvariantError');

class AlbumServices {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
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
    albums.cover AS coverUrl,
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

    console.log(result.rows[0]);
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

  async editCoverAlbumById(id, cover) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id`,
      values: [cover, updatedAt, id],
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

  async addLikeToAlbumById(userId, albumId) {
    const id = `likeAlb-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this.cacheService.delete(`like-album:${albumId}`);
  }

  async verifyUserLikeTheAlbum(userId, albumId) {
    const query = {
      text: `SELECT * FROM album_likes WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Tindakan tersebut hanya diizinkan sekali per pengguna');
    }
  }

  async getAlbumLikeCountById(albumId) {
    try {
      const result = await this.cacheService.get(`like-album:${albumId}`);
      return { likes: JSON.parse(result), status: 'cache' };
    } catch (error) {
      const query = {
        text: `SELECT COUNT(user_id) FROM album_likes WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this.pool.query(query);

      await this.cacheService.set(`like-album:${albumId}`, JSON.stringify(result.rows[0].count));
      // console.log(typeof result.rows[0].count);
      return { likes: result.rows[0].count, status: 'database' };
    }
  }

  async deleteLikeAlbumById(userId, albumId) {
    const query = {
      text: `DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id`,
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus like album');
    }

    await this.cacheService.delete(`like-album:${albumId}`);
  }
}

module.exports = AlbumServices;
