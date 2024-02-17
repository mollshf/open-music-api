exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'VARCHAR(2048)',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover');
};
