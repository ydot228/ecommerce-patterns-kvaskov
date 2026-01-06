const express = require('express');
const morgan = require('morgan');

const {
  InventorySubject,
  EmailObserver,
  AnalyticsObserver,
  wireObservers
} = require('../../shared/patterns/behavioral/observer');

const app = express();
const PORT = Number(process.env.CATALOG_PORT || 4001);

app.use(morgan('dev'));
app.use(express.json());

// In-memory каталог (для учебной демо)
const PRODUCTS = [
  { id: 'p1', title: 'USB-C кабель', price: 499, stock: 15 },
  { id: 'p2', title: 'Наушники', price: 2490, stock: 7 }
];

// Observer: когда меняется остаток, уведомляем подписчиков
const inventory = new InventorySubject();
wireObservers(inventory, [new EmailObserver(), new AnalyticsObserver()]);

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/products', (req, res) => {
  res.json({ data: PRODUCTS });
});

app.get('/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
  res.json({ data: product });
});

// Для демонстрации паттерна Observer
app.patch('/products/:id/stock', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });

  const newQty = Number(req.body.stock);
  if (!Number.isFinite(newQty) || newQty < 0) {
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'stock должен быть >= 0' } });
  }

  product.stock = newQty;
  inventory.updateStock({ productId: product.id, newQty });

  res.json({ data: product });
});

app.listen(PORT, () => {
  console.log(`[catalog-service] listening on http://localhost:${PORT}`);
});
