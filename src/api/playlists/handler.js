class PlaylistHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this.validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this.service.addPlaylist({ name, owner });
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        // auth: request.auth,
      },
    });
    response.code(201);
    return response;
  }

  async getAllPlaylistsHandler(request) {
    const { id } = request.auth.credentials;

    const playlists = await this.service.getAllPlaylists(id);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getSongsInPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this.service.verifyPlaylistAccess(playlistId, owner);

    const playlist = await this.service.getSongsInPlaylistById(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async postSongInUserPlaylistHandler(request, h) {
    this.validator.validatePostPlaylistOfSongPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;

    // check playlist dan kepemilikan playlis
    await this.service.verifyPlaylistAccess(playlistId, owner);

    // menambahkan song pemilikan playlist
    await this.service.addSongInUserPlaylist({ playlistId, songId });

    const response = h.response({
      status: 'success',
      message: `Song berhasil ditambahkan di playlist`,
    });
    response.code(201);
    return response;
  }

  async deletePlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this.service.verifyPlaylistOwner(playlistId, owner);

    await this.service.deletePlaylists(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this.validator.validatePostPlaylistOfSongPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;

    await this.service.verifyPlaylistAccess(playlistId, owner);

    await this.service.deleteSongFromPlaylists(songId);

    return {
      status: 'success',
      message: 'song berhasil dihapus',
    };
  }
}

module.exports = PlaylistHandler;
