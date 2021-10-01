const sqlite = {
  client: 'sqlite3',
  connection:{
    filename: './db.ecommerce'
  },
  useNullAsDefault: true,
};

module.exports = sqlite;