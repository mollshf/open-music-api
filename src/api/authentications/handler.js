class AuthenticationsHandler {
  constructor(AuthenticationsServices, userService, tokenManager, validator) {
    this.authenticationsServices = AuthenticationsServices;
    this.userService = userService;
    this.tokenManager = tokenManager;
    this.validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    this.validator.validatePostAuthenticationsPayload(request.payload);

    const { username, password } = request.payload;

    const id = await this.userService.verifyUserCredential(username, password);
    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });

    await this.authenticationsServices.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    this.validator.validatePutAuthenticationsPayload(request.payload);

    const { refreshToken } = request.payload;

    await this.authenticationsServices.verifyRefreshToken(refreshToken);

    const { id } = this.tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this.tokenManager.generateAccessToken(id);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    this.validator.validateDeleteAuthenticationsPayload(request.payload);

    const { refreshToken } = request.payload;

    await this.authenticationsServices.verifyRefreshToken(refreshToken);
    await this.authenticationsServices.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh Token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
