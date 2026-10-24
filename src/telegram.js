// Отправка уведомлений в Telegram.
// Токен бота здесь НЕ хранится: сайт вызывает нашу серверную функцию /api/telegram (файл api/telegram.js),
// а токен лежит только в настройках Vercel (Environment Variables) и никому не виден.

function send(type, data) {
  return fetch('/api/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, data }),
  }).catch(() => {
    /* если Telegram недоступен — заказ всё равно оформлен, ошибку не показываем покупателю */
  })
}

// Новый заказ
export const sendOrderTelegram = (order) => send('order', order)

// Новая заявка на запчасть
export const sendRequestTelegram = (req) => send('request', req)