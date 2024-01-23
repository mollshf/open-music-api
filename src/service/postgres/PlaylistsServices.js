const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthorizationError = require('../../exception/AuthorizationError');

class PlaylistsServices {
  constructor(songsService) {
    this.songsService = songsService;
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
      text: `SELECT playlists.id, playlists.name, users.username 
             FROM playlists 
             LEFT JOIN users ON users.id = playlists.owner 
             WHERE users.id = $1`,
      values: [owner],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getSongsInPlaylistById(id) {
    const query = {
      text: `
        SELECT
            playlists.id AS id,
            playlists.name AS name,
            users.username AS username,
            JSON_ARRAYAGG(
                JSON_BUILD_OBJECT(
                    'id', songs.id,
                    'title', songs.title,
                    'performer', songs.performer
                )
            ) AS songs
        FROM
            playlists
        JOIN
            playlists_songs ON playlists_songs.playlist_id = playlists.id
        JOIN
            songs ON songs.id = playlists_songs.song_id
        JOIN
            users ON users.id = playlists.owner
        WHERE
            playlists.id = $1
        GROUP BY
            playlists.id, playlists.name, users.username;
    `,
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async addSongInUserPlaylist({ playlistId, songId }) {
    // sebelum menambahkan song ke playlists, lakukan pengecekan apakah data song terdapat pada table songs
    await this.songsService.getSongById(songId);

    // jika data song tersedia pada table 'songs' maka lanjutkan proses penyimpanan songs ke playlists
    const id = `playlist_songs-${nanoid(16)}`; // membuat id unik untuk penyimpanan songs playlist

    const query = {
      text: `INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId],
    }; // melakukan query tambah data songs dan playlist ke junk table playlist_songs

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(`Song gagal ditambahkan di playlist ini`);
    }

    return result.rows[0];
  }

  async deleteSongFromPlaylists() {}

  async checkPlaylistOwner(playlistId, owner) {
    const query = {
      text: `SELECT * FROM playlists where id = $1 `,
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist Tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }
}

module.exports = PlaylistsServices;
