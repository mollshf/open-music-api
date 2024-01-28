const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    { collaborationsServices, playlistsServices, usersService, validator }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsServices,
      playlistsServices,
      usersService,
      validator
    );
    server.route(routes(collaborationsHandler));
  },
};
