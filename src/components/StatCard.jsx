// Карточка с одной цифрой для статистики
export default function StatCard({ title, value }) {
  return (
    <div className="stat">
      <div className="muted">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}