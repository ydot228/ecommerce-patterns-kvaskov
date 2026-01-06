const mongoose = require('mongoose');
const { InMemoryUserRepository } = require('../../../../shared/patterns/creational/factory');
const { UserModel } = require('../models/User');

const { MongoUserRepository } = require('./mongoUserRepository');

async function initUserRepository({ useMongo, mongoUrl }) {
  if (!useMongo) {
    return new InMemoryUserRepository([
      { id: 'u1', email: 'student@example.com', fullName: 'Студент Тестовый' },
      { id: 'u2', email: 'teacher@example.com', fullName: 'Преподаватель Тестовый' }
    ]);
  }

  await mongoose.connect(mongoUrl);
  return new MongoUserRepository(UserModel);
}

module.exports = {
  initUserRepository
};
