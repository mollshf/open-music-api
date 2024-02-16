const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Texport',
  version: '1.0.0',
  register: async (server, { service, playlistsServices, validator }) => {
    const exportsHandler = new ExportsHandler(service, playlistsServices, validator);
    server.route(routes(exportsHandler));
  },
};
