/**
 * Singleton (порождающий паттерн)
 *
 * Идея: конфигурация приложения - единственный объект на всё приложение.
 * В учебных работах это простой и понятный пример.
 */

class Config {
  constructor() {
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.useMongo = (process.env.USE_MONGO || '').toLowerCase() === 'true';
    this.mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce_demo';
    this.port = Number(process.env.PORT || 3000);
  }
}

let instance = null;

function getConfig() {
  if (!instance) {
    instance = new Config();
  }
  return instance;
}

module.exports = {
  getConfig
};
