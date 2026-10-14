import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_p9lf6yd'
const TEMPLATE_ID = 'template_n3smoto'
const PUBLIC_KEY = 'IS3eCM9HEKN4y55CT'

// Отправляет письмо о новом заказе владельцу магазина
export function sendOrderEmail(order) {
  const items = order.items.map((i) => `${i.name} × ${i.qty} — ${i.price * i.qty} сом`).join(', ')
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      order_id: order.id,
      date: order.date,
      customer_name: order.name,
      customer_phone: order.phone,
      customer_email: order.email,
      address: `${order.city}, ${order.address}`,
      delivery: order.delivery,
      payment: order.paid ? 'Оплачено картой (демо)' : order.pay,
      items,
      total: `${order.total} сом`,
    },
    { publicKey: PUBLIC_KEY }
  )
}