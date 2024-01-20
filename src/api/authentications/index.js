const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { authenticationsServices, usersService, tokenManager, validator }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsServices,
      usersService,
      tokenManager,
      validator
    );

    server.route(routes(authenticationsHandler));
  },
};
