export default function Pagination({ page, pages, onChange }) {
  if (pages < 2) return null
  return (
    <div className="pager">
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} className={n === page ? 'on' : ''} onClick={() => onChange(n)}>
          {n}
        </button>
      ))}
    </div>
  )
}
