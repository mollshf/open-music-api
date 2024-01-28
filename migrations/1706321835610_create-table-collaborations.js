/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // add constraint UNIQUE at collaboration
  pgm.addConstraint('collaborations', 'unique_playlistsId_and_usersId', {
    unique: ['playlist_id', 'user_id'],
  });

  // add constraint FOREIGN KEY at collaboration
  pgm.addConstraint('collaborations', 'fk_collaborations.playlists_id_playlists.id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
    },
  });

  pgm.addConstraint('collaborations', 'fk_collaborations.users_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'unique_playlistsId_and_usersId');
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlists_id_playlists.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.users_id_users.id');
  pgm.dropTable('collaborations');
};
