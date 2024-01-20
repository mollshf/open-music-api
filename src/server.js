require('dotenv').config();

const Hapi = require('@hapi/hapi');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsServices = require('./service/postgres/AuthenticationsServices');
const AuthenticationsValidator = require('./validator/authentications');

// albums
const albums = require('./api/albums/index');
const AlbumServices = require('./service/postgres/AlbumServices');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs/index');
const SongsServices = require('./service/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// songs
const users = require('./api/users');
const UsersServices = require('./service/postgres/UsersServices');
const UsersValidator = require('./validator/users');

// error handling
const ClientError = require('./exception/ClientError');
const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const albumsService = new AlbumServices();
  const songsServices = new SongsServices();
  const usersService = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();

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
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    console.log(response);
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response instanceof Error) {
      const newResponse = h.response({
        status: 'error',
        message: response.message,
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
