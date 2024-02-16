const InvariantError = require('../../exception/InvariantError');
const ExportPlaylistsPayloadSchema = require('./schema');

const ExportsPlaylistsPayloadValidator = {
  validateExportsPlaylistsPayload: (payload) => {
    const validationResult = ExportPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsPlaylistsPayloadValidator;
