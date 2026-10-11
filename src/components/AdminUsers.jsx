import { useStore } from '../store.jsx'
import { ADMIN_EMAILS } from '../config.js'

export default function AdminUsers() {
  const { users, orders } = useStore()
  if (users.length === 0) return <p className="muted">Пользователей пока нет.</p>
  return (
    <div>
      {users.map((u) => (
        <div className="arow" key={u.email}>
          <div><b>{u.name}</b><div className="art">{u.email}</div></div>
          <span className="tag">{ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'admin' : 'user'}</span>
          <span className="muted">заказов: {orders.filter((o) => o.email === u.email).length}</span>
        </div>
      ))}
    </div>
  )
}