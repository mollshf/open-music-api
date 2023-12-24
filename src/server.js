require('dotenv').config();

const Hapi = require('@hapi/hapi');

const albums = require('./api/albums/index');
// const songs = require('./api/songs/index');
const AlbumServices = require('./service/postgres/AlbumServices');
const { debugConsole } = require('../utils/debug/chalkConsole');

debugConsole(process.env.HOST);

const init = async () => {
  const albumsService = new AlbumServices();
  // const songsService = new SongsService();
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
      },
    },
    // {
    //   plugin: songs,
    //   options: {
    //     service: albumsService,
    //   },
    // },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
