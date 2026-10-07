import { useParams, Link, useNavigate } from 'react-router-dom'
import { CATEGORIES, money } from '../data.js'
import ProductImage from '../components/ProductImage.jsx'
import Skeleton from '../components/Skeleton.jsx'
import { useStore } from '../store.jsx'
import { FitBadge } from '../components/ProductCard.jsx'
import Reviews from '../components/Reviews.jsx'

export default function Product() {
  const { id } = useParams()
  const nav = useNavigate()
  const { addToCart, toggleFav, favs, user, reserve, t, products, productsLoading } = useStore()
  const p = products.find((x) => String(x.id) === id)
  if (!p && productsLoading) return <div className="wrap page"><Skeleton count={1} /></div>
  if (!p) return <div className="wrap page"><p>{t('Товар не найден.')} <Link to="/catalog">{t('Вернуться в каталог')}</Link></p></div>
  const icon = CATEGORIES.find((c) => c.name === p.category)?.icon
  return (
    <div className="wrap page">
      <p className="crumbs"><Link to="/catalog">{t('Каталог')}</Link> / <Link to={'/catalog?cat=' + encodeURIComponent(p.category)}>{t(p.category)}</Link></p>
      <div className="pgrid">
        <div className="pimg big"><ProductImage p={p} /></div>
        <div>
          <h1 className="h1s">{p.name}</h1>
          <div className="art">{p.brand} · арт. {p.article}</div>
          <p className="meta">★ {p.rating} · {t('Продавец')}: {p.seller} · {t('В наличии')}: {p.stock} {t('шт.')}</p>
          <p><FitBadge p={p} /></p>
          {p.description && <p className="desc">{p.description}</p>}
          <div className="price lg">{money(p.price)}</div>
          <div className="row2">
            <button className="btn" onClick={() => addToCart(p.id)}>{t('В корзину')}</button>
            <button className="btn ghost" onClick={() => toggleFav(p.id)}>{favs.includes(p.id) ? '♥ ' + t('В избранном') : '♡ ' + t('В избранное')}</button>
            <button className="btn ghost" onClick={() => (user ? reserve(p.id) : nav('/auth'))}>{t('Забронировать')}</button>
          </div>
          <h2 className="h2s">{t('Характеристики')}</h2>
          <table className="specs"><tbody>
            {Object.entries(p.specs).map(([k, v]) => <tr key={k}><td>{t(k.replace('_', ' '))}</td><td>{v}</td></tr>)}
          </tbody></table>
          <h2 className="h2s">{t('Совместимость')}</h2>
          <p className="muted">{p.fits.includes('*') ? t('Универсальная деталь, подходит к большинству автомобилей.') : p.fits.join(', ')}</p>
          <Reviews productId={p.id} />
        </div>
      </div>
    </div>
  )
}
