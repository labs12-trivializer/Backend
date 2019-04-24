const productionDBConnection = process.env.DATABASE_URL || {
  host: 'localhost',
  database: 'trivializer',
  user: 'trivializer@gmail.com',
  password: 'super22unicorndragon@69'
};

module.exports = {
  knex: {
    client: 'pg',
    connection: productionDBConnection
  }
};
