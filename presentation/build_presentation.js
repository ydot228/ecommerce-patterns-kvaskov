const pptxgen = require('pptxgenjs');
const {
  imageSizingContain,
  calcTextBoxHeight,
  safeOuterShadow,
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds
} = require('/home/oai/share/slides/pptxgenjs_helpers');

const path = require('node:path');

const ASSETS = {
  mvc: path.resolve(__dirname, '..', 'docs', 'diagrams', 'mvc_diagram.png'),
  micro: path.resolve(__dirname, '..', 'docs', 'diagrams', 'microservices_diagram.png'),
  map: path.resolve(__dirname, '..', 'docs', 'diagrams', 'pattern_map.png')
};

// ---------- basic theme ----------
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Квасков Фёдор Алексеевич';

const COLORS = {
  bg: 'FFFFFF',
  text: '111827',
  muted: '374151',
  accent: '1F4E79',
  light: 'F3F4F6'
};

function addTitle(slide, title, subtitle) {
  slide.background = { color: COLORS.bg };
  slide.addText(title, {
    x: 0.6, y: 1.2, w: 12.1, h: 0.8,
    fontFace: 'Calibri', fontSize: 36, bold: true, color: COLORS.accent
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 2.1, w: 12.1, h: 0.6,
      fontFace: 'Calibri', fontSize: 18, color: COLORS.muted
    });
  }
}

function addHeader(slide, title) {
  slide.background = { color: COLORS.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.7,
    fill: { color: COLORS.accent }
  });
  slide.addText(title, {
    x: 0.6, y: 0.12, w: 12.2, h: 0.45,
    fontFace: 'Calibri', fontSize: 20, bold: true, color: 'FFFFFF'
  });
}

function bulletBox(slide, x, y, w, title, bullets) {
  const titleH = 0.4;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.4,
    fill: { color: COLORS.light },
    line: { color: 'D1D5DB' },
    radius: 6,
    shadow: safeOuterShadow()
  });
  slide.addText(title, {
    x: x + 0.25, y: y + 0.07, w: w - 0.5, h: 0.3,
    fontFace: 'Calibri', fontSize: 16, bold: true, color: COLORS.text
  });

  const bodyY = y + titleH + 0.1;
  const fontSize = 14;
  const bodyH = calcTextBoxHeight(fontSize, bullets.length + 1, 1.2, 0.2);
  slide.addText(bullets.map(t => ({ text: t, options: { bullet: { indent: 18 }, hanging: 6 } })), {
    x: x + 0.25, y: bodyY, w: w - 0.5, h: Math.min(bodyH, 3.7),
    fontFace: 'Calibri', fontSize, color: COLORS.text,
    paraSpaceAfter: 6
  });
}

// ---------------- Slide 1: Title ----------------
{
  const s = pptx.addSlide();
  addTitle(
    s,
    'Архитектурные шаблоны и паттерны проектирования',
    'Учебный проект: информационная система онлайн-магазина'
  );
  s.addText('Выполнил: Квасков Фёдор Алексеевич\nГруппа: 2023-ФГиИБ-ИБ-2б\nПроверил: Лазуренко Н.С.\nМосква, 2026', {
    x: 0.6, y: 3.3, w: 12.1, h: 1.3,
    fontFace: 'Calibri', fontSize: 16, color: COLORS.text
  });
  s.addNotes(`[Sources]\n- Диаграммы и материалы: авторская работа (на основе кода из репозитория).\n[/Sources]`);
}

// ---------------- Slide 2: Goal & tasks ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Цель и задачи практической работы');

  bulletBox(s, 0.7, 1.2, 6.0, 'Цель', [
    'Закрепить архитектуру MVC в веб-приложении',
    'Показать модульность через микросервисы и API Gateway',
    'Применить паттерны: структурные, поведенческие, порождающие, параллельные'
  ]);

  bulletBox(s, 7.0, 1.2, 5.6, 'Что сделано в проекте', [
    'MVC-приложение: CRUD для User (Express + EJS)',
    'API Gateway + 2 микросервиса (catalog, orders)',
    'Adapter/Facade, Observer/Strategy, Factory/Singleton, Producer-Consumer'
  ]);

  s.addNotes(`[Sources]\n- Диаграммы и материалы: авторская работа (на основе кода из репозитория).\n[/Sources]`);
}

// ---------------- Slide 3: System overview ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Общая архитектура (в разрезе модулей)');

  // Чуть уменьшаем высоту изображения, чтобы подпись не перекрывалась.
  s.addImage({ path: ASSETS.map, ...imageSizingContain(ASSETS.map, 0.7, 1.15, 12.0, 4.95) });
  s.addText('Карта модулей и связей + привязка паттернов к реальным участкам кода.', {
    x: 0.7, y: 6.15, w: 12.0, h: 0.4,
    fontFace: 'Calibri', fontSize: 14, color: COLORS.muted
  });
  s.addNotes(`[Sources]\n- Диаграмма: авторская (сформирована по структуре репозитория).\n[/Sources]`);
}

// ---------------- Slide 4: MVC ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'MVC: Model — View — Controller');

  s.addImage({ path: ASSETS.mvc, ...imageSizingContain(ASSETS.mvc, 0.7, 1.2, 12.0, 4.0) });

  bulletBox(s, 0.7, 5.35, 12.0, 'Как это проявляется в коде (apps/web-mvc)', [
    'Model: src/models/User.js + репозиторий (in-memory или Mongo)',
    'View: src/views/*.ejs (список, форма, главная)',
    'Controller: src/controllers/UsersController.js (CRUD)',
    'Routes: src/routes/usersRoutes.js (маршрутизация)'
  ]);

  s.addNotes(`[Sources]\n- Диаграмма MVC: авторская.\n[/Sources]`);
}

// ---------------- Slide 5: Microservices + gateway ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Микросервисы и API Gateway');

  s.addImage({ path: ASSETS.micro, ...imageSizingContain(ASSETS.micro, 0.7, 1.15, 12.0, 4.2) });
  bulletBox(s, 0.7, 5.55, 12.0, 'Ключевая идея', [
    'Gateway скрывает адреса сервисов и даёт единый API',
    'Catalog отвечает за товары/остатки, Orders — за создание заказов',
    'Очередь уведомлений отделяет "долгие" операции от основного запроса'
  ]);
  s.addNotes(`[Sources]\n- Диаграмма: авторская.\n[/Sources]`);
}

// ---------------- Slide 6: Structural patterns ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Структурные паттерны: Adapter и Facade');

  bulletBox(s, 0.7, 1.2, 6.2, 'Adapter', [
    'Сводит внешний интерфейс оплаты к единому PaymentPort',
    'Позволяет поменять провайдера без переписывания бизнес-логики',
    'Файл: shared/patterns/structural/adapter.js'
  ]);

  bulletBox(s, 7.05, 1.2, 5.55, 'Facade', [
    'placeOrder(...) — один метод вместо цепочки вызовов',
    'Внутри: каталог → доставка (Strategy) → оплата (Adapter) → уведомления',
    'Файл: shared/patterns/structural/facade.js'
  ]);

  s.addNotes(`[Sources]\n- Примеры паттернов: авторский код в репозитории.\n[/Sources]`);
}

// ---------------- Slide 7: Behavioral patterns ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Поведенческие паттерны: Observer и Strategy');

  bulletBox(s, 0.7, 1.2, 6.2, 'Observer', [
    'Событие stockChanged при изменении остатков',
    'Подписчики: уведомления, аналитика (демо)',
    'Использование: services/catalog-service',
    'Файл: shared/patterns/behavioral/observer.js'
  ]);

  bulletBox(s, 7.05, 1.2, 5.55, 'Strategy', [
    'Разные алгоритмы доставки: pickup/courier/express',
    'Выбор стратегии без if-else в контроллере',
    'Файл: shared/patterns/behavioral/strategy.js'
  ]);

  s.addNotes(`[Sources]\n- Примеры паттернов: авторский код в репозитории.\n[/Sources]`);
}

// ---------------- Slide 8: Creational patterns ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Порождающие паттерны: Factory и Singleton');

  bulletBox(s, 0.7, 1.2, 6.2, 'Factory', [
    'Создаёт подходящую реализацию репозитория',
    'Контроллеры не зависят от хранения (память/БД)',
    'Файл: shared/patterns/creational/factory.js'
  ]);

  bulletBox(s, 7.05, 1.2, 5.55, 'Singleton', [
    'Единая конфигурация приложения (PORT, USE_MONGO)',
    'getConfig() возвращает один экземпляр',
    'Файл: shared/patterns/creational/singleton.js'
  ]);

  s.addNotes(`[Sources]\n- Примеры паттернов: авторский код в репозитории.\n[/Sources]`);
}

// ---------------- Slide 9: Concurrency ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Параллельные паттерны: Producer–Consumer');

  bulletBox(s, 0.7, 1.2, 12.0, 'Producer–Consumer (очередь уведомлений)', [
    'Producer: placeOrder(...) добавляет задачу в очередь',
    'Consumer: обрабатывает задачу асинхронно (например, email/лог)',
    'Главная выгода: запрос создания заказа отвечает быстрее',
    'Файл: shared/patterns/concurrency/producerConsumer.js'
  ]);

  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 4.4, w: 12.0, h: 2.1,
    fill: { color: COLORS.light },
    line: { color: 'D1D5DB' },
    shadow: safeOuterShadow()
  });
  s.addText('Пример сценария:\n1) POST /orders\n2) расчёт суммы + оплата\n3) enqueue уведомления\n4) ответ клиенту (201)\n5) фоновая отправка уведомлений', {
    x: 1.0, y: 4.55, w: 11.4, h: 1.85,
    fontFace: 'Calibri', fontSize: 16, color: COLORS.text
  });

  s.addNotes(`[Sources]\n- Описание очереди: авторский код и объяснение паттерна в проекте.\n[/Sources]`);
}

// ---------------- Slide 10: Summary ----------------
{
  const s = pptx.addSlide();
  addHeader(s, 'Итоги и как запускать');

  bulletBox(s, 0.7, 1.2, 12.0, 'Итог', [
    'Реализован MVC (CRUD User) и микросервисная схема (gateway + services)',
    'Паттерны применены не "в теории", а в реальных модулях кода',
    'Проект готов для размещения на GitHub (структура + README + инструкции)'
  ]);

  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 4.15, w: 12.0, h: 2.35,
    fill: { color: 'FFFFFF' },
    line: { color: 'D1D5DB' },
    shadow: safeOuterShadow()
  });
  s.addText('Запуск (корень репозитория):\n- npm install\n- npm run dev:web\n- npm run dev:catalog\n- npm run dev:orders\n- npm run dev:gateway', {
    x: 1.0, y: 4.3, w: 11.4, h: 2.1,
    fontFace: 'Calibri', fontSize: 18, color: COLORS.text
  });

  s.addNotes(`[Sources]\n- Инструкции запуска: README репозитория (авторский).\n[/Sources]`);
}

// ---------- basic validation ----------
for (const slide of pptx._slides) {
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

pptx.writeFile({ fileName: path.resolve(__dirname, 'Презентация_Паттерны_Квасков_Фёдор_Алексеевич_2026.pptx') });
