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
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.addSongInUserPlaylistHandler(request, h),
    options: {
      auth: 'openmusic_api',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getSongsInPlaylistHandler(request, h),
    options: {
      auth: 'openmusic_api',
    },
  },
];

module.exports = routes;
