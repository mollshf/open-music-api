const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.addUserHandler(request, h),
  },
];

module.exports = routes;
