class PlaylistHandler {
  constructor(service, activityService, validator) {
    this.service = service;
    this.activityService = activityService;
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

    await this.activityService.addActivities('add', { playlistId, songId, userId: owner });

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

    await this.activityService.addActivities('delete', { playlistId, songId, userId: owner });

    return {
      status: 'success',
      message: 'song berhasil dihapus',
    };
  }

  async getPlaylistsActivitiestHandler(request) {
    this.validator.validatePostPlaylistOfSongPayload(request.payload);

    const { playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this.service.verifyPlaylistAccess(playlistId, owner);

    const activities = await this.activityService.getActivities(playlistId);
    console.log('SUP[ER DATA AOKWAO', activities);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistHandler;
