require('dotenv').config();
const Hapi = require('@hapi/hapi');

const albums = require('./api/albums/index');
const songs = require('./api/songs/index');
const AlbumServices = require('./service/postgres/AlbumServices');

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
        // validator: NotesValidator,
      },
    },
    {
      plugin: songs,
      options: {
        // service: notesService,
        // validator: NotesValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
