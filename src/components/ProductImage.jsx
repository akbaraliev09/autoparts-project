import { useState } from 'react'
import { CATEGORIES } from '../data.js'

// Фото товара. Если фото нет в конт. или оно не загрузилось — показывается значок категории.
export default function ProductImage({ p }) {
  const [broken, setBroken] = useState(false)
  const icon = CATEGORIES.find((c) => c.name === p.category)?.icon
  if (!p.image || broken) return <span className="ph">{icon}</span>
  return <img src={p.image} alt={p.name} loading="lazy" onError={() => setBroken(true)} />
}
