require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const inert = require('@hapi/inert');
// const path = require('path');

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

// users
const users = require('./api/users');
const UsersServices = require('./service/postgres/UsersServices');
const UsersValidator = require('./validator/users');

// playlists
const playlists = require('./api/playlists');
const PlaylistsServices = require('./service/postgres/PlaylistsServices');
const PlaylistValidator = require('./validator/playlist');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsServices = require('./service/postgres/CollaborationsServices');
const collaborationsValidator = require('./validator/collaborations');

// export
const Texports = require('./api/exports');
const ProduceService = require('./service/rabbitmq/ProducerService');
const ExportsPlaylistsPayloadValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
// const StorageService = require('./service/storage/StorageService');
const StorageService = require('./service/S3/StorageService');
const UploadsValidator = require('./validator/uploads');

// error handling
const ClientError = require('./exception/ClientError');

// tools
const TokenManager = require('./tokenize/TokenManager');
const config = require('../utils/config');
const ActivitiesServices = require('./service/postgres/ActivitiesService');

const init = async () => {
  const albumsService = new AlbumServices();
  const songsServices = new SongsServices();
  const usersService = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const collaborationsServices = new CollaborationsServices();
  const playlistsServices = new PlaylistsServices(songsServices, collaborationsServices);
  const activityService = new ActivitiesServices();
  // const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const storageService = new StorageService();

  const server = Hapi.server({
    port: config.server.port,
    host: config.server.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: inert,
    },
  ]);

  server.auth.strategy('openmusic_api', 'jwt', {
    keys: config.server.jwt.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.server.jwt.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: playlists,
      options: {
        service: playlistsServices,
        activityService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsServices,
        playlistsServices,
        usersService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: Texports,
      options: {
        service: ProduceService,
        playlistsServices,
        validator: ExportsPlaylistsPayloadValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        albumsService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    // console.log(response);

    if (response instanceof ClientError) {
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
