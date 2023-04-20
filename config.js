const { PORT = 3001, BASE_PATH, DataBase = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = {
  PORT, BASE_PATH, DataBase,
};
