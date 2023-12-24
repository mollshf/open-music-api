class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  postSongsHandler(request, h) {
    const { name = 'no name', year } = request.payload;

    const songsId = this.service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      message: {
        songsId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = SongsHandler;
