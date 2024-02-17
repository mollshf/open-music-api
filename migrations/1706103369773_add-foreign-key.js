exports.up = (pgm) => {
  // menambahkan constraint foreign key
  pgm.addConstraint('playlists_songs', 'fk_playlists_songs_playlist_id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('playlists_songs', 'fk_playlists_song_id', {
    foreignKeys: {
      columns: 'song_id',
      references: 'songs(id)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('songs', 'fk_songs_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs_playlist_id');
  pgm.dropConstraint('playlists_songs', 'fk_playlists_song_id');
  pgm.dropConstraint('songs', 'fk_songs_id');
};
