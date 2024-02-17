const InvariantError = require('../../exception/InvariantError');
const ImageHeadersSchema = require('./schema');

const UploadsValidator = {
  validateUploadsPayload: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
