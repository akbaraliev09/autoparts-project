import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { CATEGORIES, money } from '../data.js'
import ProductImage from './ProductImage.jsx'

export function FitBadge({ p }) {
  const { fits, t } = useStore()
  const f = fits(p)
  if (f === null) return <span className="muted">{t('Выберите авто для проверки совместимости')}</span>
  return f ? <span className="ok">✓ {t('Подходит к вашему авто')}</span> : <span className="bad">✕ {t('Не подходит к вашему авто')}</span>
}

export default function ProductCard({ p }) {
  const { favs, toggleFav, addToCart, t } = useStore()
  const icon = CATEGORIES.find((c) => c.name === p.category)?.icon
  return (
    <article className="p">
      <Link to={`/product/${p.id}`} className="pimg"><ProductImage p={p} /></Link>
      <button className={'fav' + (favs.includes(p.id) ? ' on' : '')} onClick={() => toggleFav(p.id)} aria-label="В избранное">♥</button>
      <Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link>
      <div className="art">{p.brand} · арт. {p.article}</div>
      <div className="meta">★ {p.rating} · {p.seller}<br /><FitBadge p={p} /></div>
      <div className="row">
        <span className="price">{money(p.price)}</span>
        <button className="btn" onClick={() => addToCart(p.id)}>{t('В корзину')}</button>
      </div>
    </article>
  )
}
