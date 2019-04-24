module.exports = {
  knex: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: { filename: './data/trivializer.sqlite3' },
    pool: {
      afterCreate: (conn, done) => {
        // I believe this is necessary for cascading
        conn.run('PRAGMA foreign_keys = ON', done);
      }
    }
  }
};
