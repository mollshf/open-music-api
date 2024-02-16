const config = {
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
    jwt: {
      accessToken: process.env.ACCESS_TOKEN_KEY,
      accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    },
  },
  rabbitMQ: {
    server: process.env.RABBITMQ_SERVER,
  },
};

module.exports = config;
