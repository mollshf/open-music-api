const InvariantError = require('../../exception/InvariantError');
const {
  PostAuthenticationsPayloadSchema,
  PutAuthenticationsPayloadSchema,
  DeleteAuthenticationsPayloadSchema,
} = require('./schema');

const AuthenticationsValidator = {
  validatePostAuthenticationsPayload: (payload) => {
    const validationResult = PostAuthenticationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationsPayload: (payload) => {
    const validationResult = PutAuthenticationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationsPayload: (payload) => {
    const validationResult = DeleteAuthenticationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
