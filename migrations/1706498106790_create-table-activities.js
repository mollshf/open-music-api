exports.up = (pgm) => {
  pgm.createTable('activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('activities', 'fk_activities.playlists_id_to_playlists.id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('activities');
};
