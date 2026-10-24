import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { money } from '../data.js'

export default function Account() {
  const { user, orders, logout, isAdmin, t } = useStore()
  const nav = useNavigate()
  const mine = orders.filter((o) => o.email === user.email)
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
      {mine.length ? mine.map((o) => (
        <div className="box order" key={o.id}>
          <div className="oh"><b>{t('Заказ')} {o.id}</b><span className="tag">{t(o.status)}</span></div>
          <div className="muted">{o.date} · {o.delivery} · {o.city}, {o.address}</div>
          {o.paid && <div className="ok">{t('Оплачено картой (демо)')} •••• {o.payment?.last4}</div>}
          <ul>{o.items.map((i) => <li key={i.id}>{i.name} × {i.qty} — {money(i.price * i.qty)}</li>)}</ul>
          <div className="total">{t('Итого:')} <span className="price">{money(o.total)}</span></div>
        </div>
      )) : <div className="empty">{t('Заказов пока нет.')} <Link to="/catalog">{t('Выбрать запчасти')}</Link></div>}
    </div>
  )
}
