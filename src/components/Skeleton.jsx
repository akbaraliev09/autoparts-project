// ззаглушка на время загрузки данных
export default function Skeleton({ count = 4 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }, (_, i) => (
        <div className="p skel" key={i}>
          <div className="pimg" />
          <div className="line" />
          <div className="line short" />
        </div>
      ))}
    </div>
  )
}
