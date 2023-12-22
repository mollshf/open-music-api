const routes = require("./routes");

module.exports = {
  name: "suba",
  version: "1.0.0",
  register: async (server, { service }) => {
    const musicHandler = "adh";
    server.route(routes(musicHandler));
  },
};
