import { useStore } from '../store.jsx'

const STATUSES = ['Новая', 'В работе', 'Выполнена', 'Отклонена']

export default function AdminRequests() {
  const { requests, updateRequestStatus, t } = useStore()
  if (requests.length === 0) return <p className="muted">{t('Заявок пока нет.')}</p>
  return (
    <div>
      {requests.map((r) => (
        <div className="box" key={r.id}>
          <div className="oh">
            <b>{r.id}</b>
            <select value={r.status} onChange={(e) => updateRequestStatus(r.id, e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{t(s)}</option>)}
            </select>
          </div>
          <div className="muted">{r.date} · {r.name}, {r.phone}{r.email ? ' · ' + r.email : ''}</div>
          <p><b>{t('Автомобиль')}:</b> {r.car}</p>
          <p><b>{t('Нужная деталь')}:</b> {r.part}</p>
        </div>
      ))}
    </div>
  )
}