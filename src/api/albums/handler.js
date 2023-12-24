class AlbumHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumHandler = this.getAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      const { name = 'no name', year } = request.payload;

      const albumId = await this.service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        message: 'album berhasil dibuat',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  async getAlbumHandler() {
    const albums = await this.service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }
}

module.exports = AlbumHandler;
