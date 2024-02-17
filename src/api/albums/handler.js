class AlbumHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postAlbumHandler(request, h) {
    this.validator.validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;

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
  }

  async getAlbumsHandler() {
    const albums = await this.service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this.service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl: album.coverurl,
          songs: album.songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this.validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;

    await this.service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil ditambahkan',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this.service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postLikeAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.getAlbumById(id);
    await this.service.verifyUserLikeTheAlbum(credentialId, id);
    await this.service.addLikeToAlbumById(credentialId, id);

    const response = h.response({
      status: 'success',
      message: 'Anda menyukai album ini',
    });
    response.code(201);
    return response;
  }

  async getLikeAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this.service.getAlbumById(id);
    const { likes, status } = await this.service.getAlbumLikeCountById(id);
    const response = h.response({
      status: 'success',
      data: {
        likes: +likes,
      },
    });
    response.header('X-Data-Source', status);
    return response;
  }

  async deleteLikeAlbumByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.getAlbumById(id);
    await this.service.deleteLikeAlbumById(credentialId, id);

    return {
      status: 'success',
      message: 'Anda tidak lagi menyukai album ini',
    };
  }
}

module.exports = AlbumHandler;
