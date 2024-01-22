class PlaylistHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async addPlaylistHandler(request, h) {
    this.validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    console.log(request.auth);
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
}

module.exports = PlaylistHandler;
