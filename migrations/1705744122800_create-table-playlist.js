exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // menambahkan foreign key playlist.owner => user.id
  pgm.addConstraint('playlists', 'fk_playlists_owner_id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
