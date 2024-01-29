const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().max(50).required(),
  year: Joi.number().required(),
});

module.exports = { AlbumPayloadSchema };
