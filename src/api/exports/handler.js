class ExportsHandler {
  constructor(service, playlistsServices, validator) {
    this.service = service;
    this.playlistsServices = playlistsServices;
    this.validator = validator;
  }

  async postExportPlaylistsHandler(request, h) {
    this.validator.validateExportsPlaylistsPayload(request.payload);

    const { id } = request.auth.credentials;
    const { playlistId } = request.params;

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this.playlistsServices.verifyPlaylistAccess(playlistId, id);

    await this.service.sendMessage('export:playlistTrack', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
