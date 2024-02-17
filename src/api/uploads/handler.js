class UploadsHandler {
  constructor(service, albumsService, validator) {
    this.service = service;
    this.albumsService = albumsService;
    this.validator = validator;
  }

  async postUploadsHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    console.log(cover, 'INI DATA');

    this.validator.validateUploadsPayload(cover.hapi.headers);

    const filename = await this.service.writeFile(cover, cover.hapi);

    const fileLocation = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    await this.albumsService.editCoverAlbumById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
