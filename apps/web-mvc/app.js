const path = require('node:path');

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const { getConfig } = require('../../shared/patterns/creational/singleton');
const { initUserRepository } = require('./src/repositories/userRepository');
const usersRoutes = require('./src/routes/usersRoutes');

async function main() {
  const app = express();
  const cfg = getConfig();

  // view
  app.set('views', path.join(__dirname, 'src', 'views'));
  app.set('view engine', 'ejs');

  // middleware
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // репозиторий (Factory-like выбор реализации)
  const userRepo = await initUserRepository({ useMongo: cfg.useMongo, mongoUrl: cfg.mongoUrl });
  app.locals.userRepo = userRepo;

  // routes
  app.get('/', (req, res) => {
    res.render('index', {
      title: 'E-commerce demo (MVC)'
    });
  });

  app.use(usersRoutes);

  // error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });

  app.listen(cfg.port, () => {
    console.log(`[web-mvc] listening on http://localhost:${cfg.port}`);
    console.log(`USE_MONGO=${cfg.useMongo} MONGO_URL=${cfg.mongoUrl}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
