const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = Number(process.env.GATEWAY_PORT || 8080);

const CATALOG_URL = process.env.CATALOG_URL || 'http://localhost:4001';
const ORDER_URL = process.env.ORDER_URL || 'http://localhost:4002';

app.use(morgan('dev'));
app.use(express.json());

async function proxy(req, res, targetBase) {
  const targetUrl = targetBase + req.originalUrl.replace(/^\/api\/(catalog|orders)/, '');

  const init = {
    method: req.method,
    headers: {
      'content-type': req.get('content-type') || 'application/json'
    }
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = JSON.stringify(req.body || {});
  }

  try {
    const resp = await fetch(targetUrl, init);
    const text = await resp.text();

    res.status(resp.status);
    // пробуем вернуть JSON, если получилось
    try {
      res.json(JSON.parse(text));
    } catch {
      res.send(text);
    }
  } catch (e) {
    res.status(502).json({ error: { code: 'BAD_GATEWAY', message: String(e.message || e) } });
  }
}

// health
app.get('/health', (req, res) => {
  res.json({ ok: true, services: { catalog: CATALOG_URL, orders: ORDER_URL } });
});

// routes
app.all('/api/catalog/*', (req, res) => proxy(req, res, CATALOG_URL));
app.all('/api/orders*', (req, res) => proxy(req, res, ORDER_URL));

app.listen(PORT, () => {
  console.log(`[api-gateway] listening on http://localhost:${PORT}`);
});
