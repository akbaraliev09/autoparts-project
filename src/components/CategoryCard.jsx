import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'

// карт категоррия

export default function CategoryCard({ c }) {
  const { t } = useStore()
  const [broken, setBroken] = useState(false)
  return (
    <Link className="cat" to={'/catalog?cat=' + encodeURIComponent(c.name)}>
      {c.image && !broken ? (
        <img src={c.image} alt={t(c.name)} onError={() => setBroken(true)} />
      ) : (
        <span>{c.icon}</span>
      )}
      {t(c.name)}
    </Link>
  )
}
