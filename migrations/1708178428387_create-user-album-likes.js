exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
    },
    album_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('album_likes', 'fk_album_likes.users_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
    },
  });

  pgm.addConstraint('album_likes', 'fk_album_likes.album_id_album.id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('album_likes', 'fk_album_likes.users_id_users.id');
  pgm.dropConstraint('album_likes', 'fk_album_likes.album_id_album.id');
  pgm.dropTable('album_likes');
};
