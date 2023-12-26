require('dotenv').config();

const Hapi = require('@hapi/hapi');

const albums = require('./api/albums/index');
const songs = require('./api/songs/index');
const AlbumServices = require('./service/postgres/AlbumServices');
const SongsServices = require('./service/postgres/SongsService');
const AlbumsValidator = require('./validator/albums');
const ClientError = require('./exception/ClientError');
const { debugConsole } = require('../utils/debug/chalkConsole');

debugConsole(process.env.HOST);

const init = async () => {
  const albumsService = new AlbumServices();
  const songsServices = new SongsServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsServices,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      debugConsole(response);
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
