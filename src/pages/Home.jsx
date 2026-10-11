import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CATEGORIES, CARS } from '../data.js'
import CategoryCard from '../components/CategoryCard.jsx'
import Skeleton from '../components/Skeleton.jsx'
import { useStore } from '../store.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const nav = useNavigate()
  const { car, setCar, t, products, productsLoading } = useStore()
  const [q, setQ] = useState('')
  const [year, setYear] = useState('')
  const [engine, setEngine] = useState('')
  return (
    <>
      <div className="hero"><div className="wrap hgrid">
        <div>
          <h1>{t('Найди нужную запчасть для своего автомобиля')}</h1>
          <p className="sub">{t('Оригинальные и качественные автозапчасти с доставкой')}</p>
          <form className="bigsearch" onSubmit={(e) => { e.preventDefault(); nav('/catalog?q=' + encodeURIComponent(q)) }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Введите название детали или артикул')} aria-label="Название или артикул" />
            <button className="btn">{t('Найти')}</button>
          </form>
          <form className="vehicle" onSubmit={(e) => { e.preventDefault(); nav('/catalog') }}>
            <b>{t('Подбор по автомобилю')}</b>
            <div className="vgrid">
              <select value={car.make} onChange={(e) => setCar({ make: e.target.value, model: '' })} aria-label="Марка">
                <option value="">{t('Марка')}</option>{Object.keys(CARS).map((m) => <option key={m}>{m}</option>)}
              </select>
              <select value={car.model} onChange={(e) => setCar({ ...car, model: e.target.value })} disabled={!car.make} aria-label="Модель">
                <option value="">{t('Модель')}</option>{(CARS[car.make] || []).map((m) => <option key={m}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(e.target.value)} aria-label="Год">
                <option value="">{t('Год')}</option>{[2024, 2020, 2015, 2010, 2005].map((y) => <option key={y}>{y}</option>)}
              </select>
              <select value={engine} onChange={(e) => setEngine(e.target.value)} aria-label="Двигатель">
                <option value="">{t('Двигатель')}</option><option>2.0 бензин</option><option>2.5 бензин</option><option>3.5 бензин</option><option>2.0 дизель</option>
              </select>
              <button className="btn">{t('Найти запчасти')}</button>
            </div>
          </form>
        </div>
        <svg className="disc" viewBox="0 0 400 400" role="img" aria-label="Тормозной диск">
          <circle cx="200" cy="200" r="180" fill="#2c2e33" /><circle cx="200" cy="200" r="150" fill="#3a3d44" />
          <circle cx="200" cy="200" r="60" fill="#17181b" /><circle cx="200" cy="200" r="22" fill="#d92b2b" />
          <path d="M60 290A180 180 0 0 0 340 290" fill="none" stroke="#d92b2b" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div></div>

      <section id="categories"><div className="wrap">
        <h2>{t('Категории')}</h2>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.name} c={c} />
          ))}
        </div>
      </div></section>

      <section><div className="wrap">
        <h2>{t('Популярные запчасти')}</h2>
        {productsLoading ? <Skeleton count={4} /> : <div className="grid">{products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      </div></section>
    </>
  )
}
