import { useStore } from '../store.jsx'

const STATUSES = ['Новая', 'В работе', 'Выполнена', 'Отклонена']

export default function AdminRequests() {
  const { requests, updateRequestStatus } = useStore()
  if (requests.length === 0) return <p className="muted">Заявок пока нет.</p>
  return (
    <div>
      {requests.map((r) => (
        <div className="box" key={r.id}>
          <div className="oh">
            <b>{r.id}</b>
            <select value={r.status} onChange={(e) => updateRequestStatus(r.id, e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="muted">{r.date} · {r.name}, {r.phone}{r.email ? ' · ' + r.email : ''}</div>
          <p><b>Автомобиль:</b> {r.car}</p>
          <p><b>Нужная деталь:</b> {r.part}</p>
        </div>
      ))}
    </div>
  )
}