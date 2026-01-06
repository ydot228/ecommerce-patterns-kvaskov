/**
 * Producer-Consumer (параллельный/конкурентный паттерн)
 *
 * В реальных системах для этого используют брокеры (RabbitMQ/Kafka) или очереди (Bull).
 * Здесь - минимальная учебная очередь в памяти.
 */

class NotificationQueue {
  constructor({ concurrency = 1 } = {}) {
    this.concurrency = Math.max(1, concurrency);
    this.queue = [];
    this.active = 0;
  }

  enqueue(job) {
    this.queue.push(job);
    this._drain();
  }

  async _drain() {
    while (this.active < this.concurrency && this.queue.length > 0) {
      const job = this.queue.shift();
      this.active++;
      this._process(job)
        .catch(() => {
          // В учебном примере просто игнорируем ошибки.
        })
        .finally(() => {
          this.active--;
          // продолжаем обработку следующего
          this._drain();
        });
    }
  }

  async _process(job) {
    // Здесь "consumer": имитация отправки уведомления
    await new Promise((r) => setTimeout(r, 50));
    return job;
  }
}

module.exports = {
  NotificationQueue
};
