const express = require('express');
const morgan = require('morgan');

const { OrderFacade } = require('../../shared/patterns/structural/facade');

const app = express();
const PORT = Number(process.env.ORDER_PORT || 4002);
const CATALOG_URL = process.env.CATALOG_URL || 'http://localhost:4001';

app.use(morgan('dev'));
app.use(express.json());

const ORDERS = [];

class HttpCatalogClient {
  async getProductById(id) {
    const resp = await fetch(`${CATALOG_URL}/products/${id}`);
    if (!resp.ok) return null;
    const json = await resp.json();
    return json.data || null;
  }
}

const facade = new OrderFacade({ catalog: new HttpCatalogClient() });

app.get('/health', (req, res) => res.json({ ok: true }));

// Создание заказа (Facade внутри)
app.post('/orders', async (req, res) => {
  try {
    const { userId, items, shippingMethod } = req.body || {};
    const result = await facade.placeOrder({ userId, items, shippingMethod });
    ORDERS.push({ ...result, createdAt: new Date().toISOString() });
    res.status(201).json({ data: result });
  } catch (e) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: String(e.message || e) } });
  }
});

app.get('/orders', (req, res) => {
  res.json({ data: ORDERS });
});

app.listen(PORT, () => {
  console.log(`[order-service] listening on http://localhost:${PORT}`);
});
