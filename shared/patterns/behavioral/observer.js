/**
 * Observer (поведенческий паттерн)
 *
 * В Node.js удобно показывать его через EventEmitter:
 * есть источник событий (Subject) и подписчики (Observers).
 */

const EventEmitter = require('node:events');

class InventorySubject extends EventEmitter {
  updateStock({ productId, newQty }) {
    this.emit('stockChanged', { productId, newQty, at: new Date().toISOString() });
  }
}

class EmailObserver {
  onStockChanged(event) {
    // В реальной системе: отправка e-mail.
    return `Email: товар ${event.productId} теперь в количестве ${event.newQty}`;
  }
}

class AnalyticsObserver {
  onStockChanged(event) {
    // В реальной системе: логирование метрик.
    return `Analytics: stockChanged(${event.productId})`;
  }
}

function wireObservers(subject, observers) {
  subject.on('stockChanged', (event) => {
    for (const obs of observers) {
      // Демонстрация: каждый observer реагирует на событие.
      try {
        obs.onStockChanged(event);
      } catch (_) {
        // Игнорируем ошибки подписчика, чтобы не "уронить" источник.
      }
    }
  });
}

module.exports = {
  InventorySubject,
  EmailObserver,
  AnalyticsObserver,
  wireObservers
};
