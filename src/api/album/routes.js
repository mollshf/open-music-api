const routes = require("./routes");

module.exports = {
  notes: {
    name: "notes",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
      const notesHandler = new NotesHandler(service, validator);
      server.route(routes(notesHandler));
    },
  },
};
