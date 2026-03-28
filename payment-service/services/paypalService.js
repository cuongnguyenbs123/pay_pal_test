const paypal = require('@paypal/checkout-server-sdk');

function paypalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment =
    process.env.PAYPAL_MODE === 'live'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return new paypal.core.PayPalHttpClient(environment);
}

async function createOrder(amount, currency = 'USD', description = 'Test Payment') {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
        description,
      },
    ],
    application_context: {
      brand_name: 'Payment Test App',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-cancel`,
    },
  });

  const client = paypalClient();
  const response = await client.execute(request);
  return response.result;
}

async function captureOrder(orderId) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const client = paypalClient();
  const response = await client.execute(request);
  return response.result;
}

async function getOrder(orderId) {
  const request = new paypal.orders.OrdersGetRequest(orderId);
  const client = paypalClient();
  const response = await client.execute(request);
  return response.result;
}

module.exports = {
  createOrder,
  captureOrder,
  getOrder,
};
