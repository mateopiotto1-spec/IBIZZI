/* ============================================================
   IBIZZI · create-preference (Cloudflare Pages Function)
   Crea una preferencia de pago en Mercado Pago (Checkout Pro) y
   devuelve el link al que hay que redirigir al cliente.
   El access token NUNCA se expone al frontend: vive solo acá,
   leído de la variable de entorno MP_ACCESS_TOKEN (configurada
   en el panel de Cloudflare Pages > Settings > Environment variables).
   ============================================================ */

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  const token = env.MP_ACCESS_TOKEN;
  if (!token) {
    return json({ error: 'MP_ACCESS_TOKEN no configurado en el servidor' }, 500);
  }

  let orderData;
  try {
    orderData = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { customer, total, orderNumber } = orderData || {};
  if (!total || !orderNumber) {
    return json({ error: 'Faltan datos del pedido (total u orderNumber)' }, 400);
  }

  const base = new URL(request.url).origin;

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
      return json({ error: 'Mercado Pago rechazó la preferencia', detail: data }, 502);
    }

    return json({ initPoint: data.sandbox_init_point || data.init_point });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
