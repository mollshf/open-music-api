class PlaylistHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async addPlaylistHandler(request, h) {
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
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this.service.checkPlaylistOwner(playlistId, owner);

    const playlist = await this.service.getSongsInPlaylistById(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async addSongInUserPlaylistHandler(request, h) {
    this.validator.validatePostPlaylistOfSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;

    // check playlist dan kepemilikan playlis
    await this.service.checkPlaylistOwner(playlistId, owner);

    // menambahkan song pemilikan playlist
    await this.service.addSongInUserPlaylist({ playlistId, songId });

    const response = h.response({
      status: 'success',
      message: `Song berhasil ditambahkan di playlist`,
    });
    response.code(201);
    return response;
  }
}

module.exports = PlaylistHandler;
