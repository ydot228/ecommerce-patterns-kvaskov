/**
 * Factory (порождающий паттерн)
 *
 * Идея: создание нужной реализации репозитория скрывается за фабрикой.
 * Контроллеры работают с интерфейсом, не зная, Mongo это или память.
 */

class InMemoryUserRepository {
  constructor(seed = []) {
    this.users = seed;
  }

  async list() {
    return this.users;
  }

  async getById(id) {
    return this.users.find(u => u.id === id) || null;
  }

  async create(data) {
    const user = { ...data, id: `u_${Date.now()}` };
    this.users.push(user);
    return user;
  }

  async update(id, patch) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx < 0) return null;
    this.users[idx] = { ...this.users[idx], ...patch };
    return this.users[idx];
  }

  async remove(id) {
    const before = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length !== before;
  }
}

class RepositoryFactory {
  static createUserRepository({ mode = 'memory' } = {}) {
    if (mode === 'memory') {
      return new InMemoryUserRepository([
        { id: 'u1', email: 'student@example.com', fullName: 'Студент Тестовый' },
        { id: 'u2', email: 'teacher@example.com', fullName: 'Преподаватель Тестовый' }
      ]);
    }

    // Для демонстрации оставляем заглушку; реальную Mongo-реализацию
    // см. apps/web-mvc/src/repositories/mongoUserRepository.js
    throw new Error('Mongo репозиторий создаётся в web-mvc приложении');
  }
}

module.exports = {
  InMemoryUserRepository,
  RepositoryFactory
};
