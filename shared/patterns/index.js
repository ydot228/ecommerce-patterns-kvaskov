module.exports = {
  adapter: require('./structural/adapter'),
  facade: require('./structural/facade'),
  observer: require('./behavioral/observer'),
  strategy: require('./behavioral/strategy'),
  factory: require('./creational/factory'),
  singleton: require('./creational/singleton'),
  producerConsumer: require('./concurrency/producerConsumer')
};
