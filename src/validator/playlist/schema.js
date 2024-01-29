const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().max(50).required(),
});
const PostPlaylistsOfSongsPayloadSchema = Joi.object({
  songId: Joi.string().max(50).required(),
});

module.exports = { PostPlaylistsPayloadSchema, PostPlaylistsOfSongsPayloadSchema };
