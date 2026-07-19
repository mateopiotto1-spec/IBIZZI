/* ============================================================
   IBIZZI · create-preference (Netlify Function)
   Crea una preferencia de pago en Mercado Pago (Checkout Pro) y
   devuelve el link al que hay que redirigir al cliente.
   El access token NUNCA se expone al frontend: vive solo acá,
   leído de la variable de entorno MP_ACCESS_TOKEN.
   ============================================================ */

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'MP_ACCESS_TOKEN no configurado en el servidor' }) };
  }

  let orderData;
  try {
    orderData = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { customer, total, orderNumber } = orderData || {};
  if (!total || !orderNumber) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos del pedido (total u orderNumber)' }) };
  }

  const base = process.env.URL || `https://${event.headers.host}`;

  const preference = {
    items: [{
      title: `Pedido IBIZZI ${orderNumber}`,
      quantity: 1,
      unit_price: Number(total),
      currency_id: 'UYU'
    }],
    payer: {
      name: customer?.name || '',
      email: customer?.email || ''
    },
    back_urls: {
      success: `${base}/checkout.html?status=success&order=${orderNumber}`,
      failure: `${base}/checkout.html?status=failure&order=${orderNumber}`,
      pending: `${base}/checkout.html?status=pending&order=${orderNumber}`
    },
    auto_return: 'approved',
    external_reference: orderNumber
  };

  try {
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Mercado Pago rechazó la preferencia', detail: data }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initPoint: data.sandbox_init_point || data.init_point })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
