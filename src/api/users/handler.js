class UserHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async addUserHandler(request, h) {
    this.validator.validateUsersPayload(request.payload);
    const userId = await this.service.addUser(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UserHandler;
