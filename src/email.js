import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_p9lf6yd'
const TEMPLATE_ID = 'template_n3smoto'
const PUBLIC_KEY = 'IS3eCM9HEKN4y55CT'
const TEMPLATE_ID_REQUEST = 'template_f4dxjq9'

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

   // Отправляет письмо о новой заявке на запчасть
   export function sendRequestEmail(req) {
     return emailjs.send(
       SERVICE_ID,
       TEMPLATE_ID_REQUEST,
       {
         request_id: req.id,
         date: req.date,
         customer_name: req.name,
         customer_phone: req.phone,
         customer_email: req.email || 'не указана',
         car: req.car,
         part: req.part,
       },
       { publicKey: PUBLIC_KEY }
     )
   }