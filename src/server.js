require("dotenv").config();

const Hapi = require("@hapi/hapi");

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
