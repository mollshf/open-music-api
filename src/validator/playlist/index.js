const InvariantError = require('../../exception/InvariantError');
const { PostPlaylistsPayloadSchema, PostPlaylistsOfSongsPayloadSchema } = require('./schema');

const PlaylistValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostPlaylistOfSongPayload: (payload) => {
    const validationResult = PostPlaylistsOfSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
