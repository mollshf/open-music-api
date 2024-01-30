const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthorizationError = require('../../exception/AuthorizationError');

class PlaylistsServices {
  constructor(songsService, collaborationsServices) {
    this.songsService = songsService;
    this.collaborationsServices = collaborationsServices;
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
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
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
          json_agg(json_build_object('id', songs.id, 'title', songs.title, 'performer', songs.performer)) AS songs 
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

  async deletePlaylists(id) {
    const query = {
      text: `
      DELETE
        FROM playlists
        WHERE id = $1
        RETURNING id
        CASCADE
      `,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlists gagal dihapus, Id tidak ditemukan');
    }
  }

  async deleteSongFromPlaylists(songId) {
    const query = {
      text: `
        DELETE
        FROM
          playlists_songs
        WHERE
          song_id = $1
        RETURNING
          id
      `,
      values: [songId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus, Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
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

  async verifyPlaylistAccess(playlistId, owner) {
    try {
      await this.verifyPlaylistOwner(playlistId, owner);
    } catch (error) {
      // kalau errornya adalah Not Found, maka dia langsung throw error
      if (error instanceof NotFoundError) {
        throw error;
      }

      // kalau errornya selain Not Found, maka errornya akan disimpan dulu, dan jalankan kode dalam try ini
      try {
        // kalau kode ini berhasil, maka user bisa mengakses playlist dengan collab
        await this.collaborationsServices.verifyCollaborator(playlistId, owner);
        // kalau tidak berhasil maka pesan error dari method verifyMethod tidak dijalankan
        // melainkan pesan verifyPlaylistOwner di teruskan ke catch tanpa parameter
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsServices;
