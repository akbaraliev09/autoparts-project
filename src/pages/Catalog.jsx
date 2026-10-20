import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CATEGORIES } from '../data.js'
import { useStore } from '../store.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Skeleton from '../components/Skeleton.jsx'
import Pagination from '../components/Pagination.jsx'

const PAGE_SIZE = 8

export default function Catalog() {
  const [sp, setSp] = useSearchParams()
  const { fits, favs, car, t, products, productsLoading } = useStore()
  const [sort, setSort] = useState('pop')
  const [onlyFit, setOnlyFit] = useState(false)
  const [page, setPage] = useState(1)
  const loading = productsLoading
  const q = (sp.get('q') || '').toLowerCase().trim()
  const cat = sp.get('cat') || ''
  const onlyFavs = sp.get('favs') === '1'

  let list = products.filter((p) =>
    (!cat || p.category === cat) &&
    (!q || [p.name, p.article, p.brand].join(' ').toLowerCase().includes(q)) &&
    (!onlyFavs || favs.includes(p.id)) &&
    (!onlyFit || fits(p) !== false))
  if (sort === 'cheap') list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'exp') list = [...list].sort((a, b) => b.price - a.price)
  if (sort === 'rate') list = [...list].sort((a, b) => b.rating - a.rating)
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const shown = list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)

  const setCat = (v) => { const n = new URLSearchParams(sp); v ? n.set('cat', v) : n.delete('cat'); setSp(n) }
    const setQuery = (v) => {
    const n = new URLSearchParams(sp)
    v ? n.set('q', v) : n.delete('q')
    setSp(n)
    setPage(1)
  }

  return (
    <div className="wrap page">
      <h1 className="h1s">{onlyFavs ? t('Избранное') : q ? `Результаты: «${sp.get('q')}»` : t('Каталог')}</h1>
      <div className="filters">
                <input
          className="catsearch"
          type="search"
          value={sp.get('q') || ''}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Введите название детали или артикул')}
          aria-label="Поиск"
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Категория">
          <option value="">{t('Все категории')}</option>{CATEGORIES.map((c) => <option key={c.name} value={c.name}>{t(c.name)}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Сортировка">
          <option value="pop">{t('По умолчанию')}</option><option value="cheap">{t('Сначала дешёвые')}</option><option value="exp">{t('Сначала дорогие')}</option><option value="rate">{t('По рейтингу')}</option>
        </select>
        {car.make && <label className="chk"><input type="checkbox" checked={onlyFit} onChange={(e) => setOnlyFit(e.target.checked)} /> Только для {car.make} {car.model}</label>}
      </div>
      {loading ? <Skeleton count={8 } /> : <div className="grid">
        {shown.length ? shown.map((p) => <ProductCard key={p.id} p={p} />) : <div className="empty">{t('Ничего не найдено. Проверьте артикул или смените фильтры.')}</div>}
      </div>}
      {!loading && <Pagination page={cur} pages={pages} onChange={setPage} />}
    </div>
  )
}
