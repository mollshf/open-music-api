const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.addPlaylistHandler(request, h),
    options: {
      auth: 'openmusic_api',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getAllPlaylistsHandler(request, h),
    options: {
      auth: 'openmusic_api',
    },
  },
];

module.exports = routes;
