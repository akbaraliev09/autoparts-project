import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { money } from '../data.js'

export default function Account() {
  const { user, orders, requests, logout, isAdmin, cancelOrder, t } = useStore()
  const nav = useNavigate()
  const mine = orders.filter((o) => o.email === user.email)
  const mineRequests = requests.filter((r) => (r.email || '').toLowerCase() === (user.email || '').toLowerCase())
  const hasAny = mine.length || mineRequests.length

  return (
    <div className="wrap page">
      <div className="accHead">
        <div><h1 className="h1s">{user.name}</h1><div className="muted">{user.email}</div></div>
        <div className="row2">
            {isAdmin && <Link className="btn ghost" to="/admin">Админ-панель</Link>}
          <button className="btn ghost" onClick={() => { logout(); nav('/') }}>{t('Выйти')}</button>
        </div>
      </div>
      <h2 className="h2s">{t('История заказов')}</h2>
      {!hasAny && <div className="empty">{t('Заказов пока нет.')} <Link to="/catalog">{t('Выбрать запчасти')}</Link></div>}

      {mine.map((o) => (
        <div className="box order" key={o.id}>
          <div className="oh">
            <b>{t('Заказ')} {o.id}</b>
            <span className="tag">{t(o.status)}</span>
          </div>
          <div className="muted">{o.date} · {o.delivery} · {o.city}, {o.address}</div>
          {o.paid && <div className="ok">{t('Оплачено картой (демо)')} •••• {o.payment?.last4}</div>}
          <ul>{o.items.map((i) => <li key={i.id}>{i.name} × {i.qty} — {money(i.price * i.qty)}</li>)}</ul>
          <div className="total">{t('Итого:')} <span className="price">{money(o.total)}</span></div>
          {['Принят', 'В пути'].includes(o.status) && (
            <button className="btn ghost" type="button" onClick={() => cancelOrder(o.id)}>
              {t('Отменить заказ')}
            </button>
          )}
        </div>
      ))}

      {mineRequests.map((r) => (
        <div className="box order" key={r.id}>
          <div className="oh">
            <b>{t('Заявка')} {r.id}</b>
            <span className="tag">{t(r.status || 'Новая')}</span>
          </div>
          <div className="muted">{r.date}</div>
          <ul>
            <li><b>{t('Автомобиль')}:</b> {r.car}</li>
            <li><b>{t('Деталь')}:</b> {r.part}</li>
            <li><b>{t('Телефон')}:</b> {r.phone}</li>
          </ul>
        </div>
      ))}
    </div>
  )
}
