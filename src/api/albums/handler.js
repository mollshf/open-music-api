class AlbumHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  postAlbumHandler(request, h) {
    const { name = 'no name', year } = request.payload;

    const albumId = this.service.addAlbum({ name, year });
  }
}

module.exports = AlbumHandler;
