# E-commerce (MVC + microservices) + паттерны проектирования

Репозиторий подготовлен для практической работы: **архитектура MVC**, **микросервисы**, а также примеры **структурных / поведенческих / производящих / параллельных** паттернов.

## Что внутри

- `apps/web-mvc` — учебное **MVC-приложение на Express** с шаблонами **EJS** и CRUD для сущности `User`.
- `apps/api-gateway` — простой **API-шлюз** (проксирует запросы в микросервисы).
- `services/catalog-service` — микросервис каталога товаров.
- `services/order-service` — микросервис заказов.
- `shared/patterns` — примеры паттернов:
  - **Adapter**, **Facade**
  - **Observer**, **Strategy**
  - **Factory**, **Singleton**
  - **Producer-Consumer** (очередь задач)

## Быстрый старт (Node.js 18+)

### 1) Установка зависимостей
В корне репозитория:

```bash
npm install
```

### 2) Запуск MVC-приложения

```bash
npm run dev:web
```

Открой:
- `http://localhost:3000` — главная страница
- `http://localhost:3000/users` — список пользователей

### 3) Запуск микросервисов + API Gateway

В отдельных терминалах:

```bash
npm run dev:catalog
npm run dev:orders
npm run dev:gateway
```

Проверка:

```bash
curl http://localhost:8080/api/catalog/products
curl -X POST http://localhost:8080/api/orders -H 'Content-Type: application/json' -d '{"userId":"u1","items":[{"productId":"p1","qty":2}]}'
```

## Примечание про БД
Для простоты MVC-приложение может работать **в двух режимах**:
- **in-memory** (по умолчанию — чтобы всё запускалось без MongoDB);
- **MongoDB** — если выставить `USE_MONGO=true` и задать `MONGO_URL`.

## Куда смотреть в коде (паттерны)

- `shared/patterns/structural/adapter.js`
- `shared/patterns/structural/facade.js`
- `shared/patterns/behavioral/observer.js`
- `shared/patterns/behavioral/strategy.js`
- `shared/patterns/creational/factory.js`
- `shared/patterns/creational/singleton.js`
- `shared/patterns/concurrency/producerConsumer.js`
