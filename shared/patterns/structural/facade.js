/**
 * Facade (структурный паттерн)
 *
 * Идея: оформление заказа - это цепочка действий в нескольких подсистемах.
 * Чтобы контроллеры/эндпоинты не превращались в "портянку",
 * мы даём им один простой метод facade.placeOrder(...).
 */

const { PaymentAdapter } = require('./adapter');
const { ShippingStrategyPicker } = require('../behavioral/strategy');
const { NotificationQueue } = require('../concurrency/producerConsumer');

class CatalogClient {
  constructor({ products = [] } = {}) {
    this.products = products;
  }

  async getProductById(id) {
    return this.products.find(p => p.id === id) || null;
  }
}

class OrderFacade {
  constructor({
    catalog = new CatalogClient({
      products: [
        { id: 'p1', title: 'USB-C кабель', price: 499 },
        { id: 'p2', title: 'Наушники', price: 2490 }
      ]
    }),
    payment = new PaymentAdapter(),
    shippingPicker = new ShippingStrategyPicker(),
    notificationQueue = new NotificationQueue()
  } = {}) {
    this.catalog = catalog;
    this.payment = payment;
    this.shippingPicker = shippingPicker;
    this.notificationQueue = notificationQueue;
  }

  /**
   * placeOrder - единая точка для "оформить заказ".
   * В реальном проекте здесь были бы транзакции, идемпотентность, повторные попытки и т.п.
   */
  async placeOrder({ userId, items, shippingMethod = 'courier' }) {
    if (!userId) throw new Error('userId обязателен');
    if (!Array.isArray(items) || items.length === 0) throw new Error('items обязателен');

    // 1) Подтягиваем товары и считаем сумму
    let subtotal = 0;
    for (const item of items) {
      const product = await this.catalog.getProductById(item.productId);
      if (!product) throw new Error(`Товар не найден: ${item.productId}`);
      const qty = Math.max(1, Number(item.qty || 1));
      subtotal += product.price * qty;
    }

    // 2) Стоимость доставки (Strategy)
    const shippingStrategy = this.shippingPicker.pick(shippingMethod);
    const shippingCost = shippingStrategy.calc(subtotal);

    const total = subtotal + shippingCost;
    const orderId = `o_${Date.now()}`;

    // 3) Оплата (Adapter)
    const paymentResult = await this.payment.charge({ amount: total, currency: 'RUB', orderId });

    // 4) Асинхронные уведомления (Producer-Consumer)
    this.notificationQueue.enqueue({
      type: 'ORDER_CREATED',
      payload: { orderId, userId, total, transactionId: paymentResult.transactionId }
    });

    return {
      orderId,
      subtotal,
      shippingCost,
      total,
      transactionId: paymentResult.transactionId
    };
  }
}

module.exports = {
  CatalogClient,
  OrderFacade
};
