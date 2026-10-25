// Серверная функция Vercel: принимает заказ или заявку с сайта и отправляет сообщение в Telegram.

const clean = (value, max = 200) =>
  String(value ?? '')
    .slice(0, max)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

function orderText(o) {
  const items = (Array.isArray(o.items) ? o.items.slice(0, 30) : [])
    .map((i) => `• ${clean(i.name, 80)} × ${Number(i.qty) || 1} — ${(Number(i.price) || 0) * (Number(i.qty) || 1)} сом`)
    .join('\n')
  return [
    '🛒 <b>Новый заказ</b>',
    `№ ${clean(o.id, 40)} · ${clean(o.date, 40)}`,
    '',
    `👤 ${clean(o.name)}`,
    `📞 ${clean(o.phone, 40)}`,
    o.email ? `✉️ ${clean(o.email)}` : '',
    `📍 ${clean(o.city, 80)}, ${clean(o.address, 200)}`,
    `🚚 ${clean(o.delivery, 80)}`,
    `💳 ${o.paid ? 'Оплачено картой (демо)' : clean(o.pay, 80)}`,
    '',
    items,
    '',
    `<b>Итого: ${Number(o.total) || 0} сом</b>`,
  ]
    .filter((line, i, arr) => line !== '' || arr[i - 1] !== '')
    .join('\n')
}

function requestText(r) {
  return [
    '🔧 <b>Новая заявка на запчасть</b>',
    `№ ${clean(r.id, 40)} · ${clean(r.date, 40)}`,
    '',
    `👤 ${clean(r.name)}`,
    `📞 ${clean(r.phone, 40)}`,
    r.email ? `✉️ ${clean(r.email)}` : '',
    `🚗 ${clean(r.car)}`,
    `⚙️ ${clean(r.part, 300)}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Only POST' })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'Telegram is not configured' })
  }

  const { type, data } = req.body || {}
  if (!data || typeof data !== 'object' || !['order', 'request'].includes(type)) {
    return res.status(400).json({ ok: false, error: 'Bad request' })
  }

  const text = type === 'order' ? orderText(data) : requestText(data)

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
    if (!tg.ok) return res.status(502).json({ ok: false, error: 'Telegram error' })
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ ok: false, error: 'Telegram unreachable' })
  }
}