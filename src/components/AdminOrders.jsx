import { useStore } from '../store.jsx'
import { money } from '../data.js'

const STATUSES = ['Принят', 'В пути', 'Доставлен', 'Отменён']

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore()
  if (orders.length === 0) return <p className="muted">Заказов пока нет.</p>
  return (
    <div>
      {orders.map((o) => (
        <div className="box" key={o.id}>
          <div className="oh">
            <b>{o.id}</b>
            <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="muted">{o.date} · {o.name}, {o.phone} · {o.email}</div>
          <div className="muted">{o.city}, {o.address} · {o.delivery} · {o.paid ? 'Оплачено картой (демо)' : o.pay}</div>
          <ul>{o.items.map((i) => <li key={i.id}>{i.name} × {i.qty}</li>)}</ul>
          <div className="total">Итого: <span className="price">{money(o.total)}</span></div>
        </div>
      ))}
    </div>
  )
}