/**
 * Adapter (структурный паттерн)
 *
 * Идея: у нас есть "внешний" платёжный провайдер с неудобным интерфейсом,
 * а в системе мы хотим единый контракт PaymentPort.
 */

class ExternalPaymentProvider {
  /**
   * "Чужой" интерфейс: принимает amountInCents и произвольные метаданные.
   */
  async pay(amountInCents, currency, meta) {
    // В реальности здесь был бы HTTP-запрос к провайдеру.
    return {
      status: 'OK',
      transactionId: `tx_${Date.now()}`,
      provider: 'ExternalPay'
    };
  }
}

/**
 * "Наш" целевой интерфейс.
 * PaymentPort.charge({amount, currency, orderId}) -> { transactionId }
 */
class PaymentAdapter {
  constructor(provider = new ExternalPaymentProvider()) {
    this.provider = provider;
  }

  async charge({ amount, currency = 'RUB', orderId }) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('amount должен быть положительным числом');
    }

    const amountInCents = Math.round(amount * 100);
    const result = await this.provider.pay(amountInCents, currency, { orderId });

    if (result.status !== 'OK') {
      throw new Error('Платёж не прошёл');
    }

    return { transactionId: result.transactionId };
  }
}

module.exports = {
  ExternalPaymentProvider,
  PaymentAdapter
};
