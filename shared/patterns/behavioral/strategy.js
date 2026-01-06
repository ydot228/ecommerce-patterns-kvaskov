/**
 * Strategy (поведенческий паттерн)
 *
 * Идея: алгоритм расчёта доставки можно менять без изменения кода контроллера.
 */

class PickupStrategy {
  calc(subtotal) {
    return 0;
  }
}

class CourierStrategy {
  calc(subtotal) {
    // простая модель: чем дороже корзина - тем дешевле доставка
    return subtotal >= 3000 ? 199 : 399;
  }
}

class ExpressStrategy {
  calc(subtotal) {
    return 799;
  }
}

class ShippingStrategyPicker {
  constructor() {
    this.map = {
      pickup: new PickupStrategy(),
      courier: new CourierStrategy(),
      express: new ExpressStrategy()
    };
  }

  pick(method) {
    return this.map[method] || this.map.courier;
  }
}

module.exports = {
  PickupStrategy,
  CourierStrategy,
  ExpressStrategy,
  ShippingStrategyPicker
};
