import AdminRequests from '../components/AdminRequests.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import AdminOrders from '../components/AdminOrders.jsx'
import AdminUsers from '../components/AdminUsers.jsx'
import AdminStats from '../components/AdminStats.jsx'
import AdminAdmins from '../components/AdminAdmins.jsx'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { API_URL, createProduct, updateProduct, deleteProduct, seedProducts } from '../api.js'
import { CATEGORIES, money } from '../data.js'

const EMPTY = { name: '', article: '', brand: '', category: 'Двигатель', price: '', stock: 10, seller: 'AutoParts KG', image: '', description: '', specsText: '' }

// Разделы дашборда. key попадает в адрес (/admin?tab=products), поэтому после обновления страницы раздел не сбрасывается
const TABS = [
  { key: 'stats', label: 'Статистика', icon: '📊' },
  { key: 'orders', label: 'Заказы', icon: '🧾' },
  { key: 'requests', label: 'Заявки', icon: '✉️' },
  { key: 'products', label: 'Товары', icon: '📦' },
  { key: 'users', label: 'Пользователи', icon: '👥' },
  { key: 'admins', label: 'Администраторы', icon: '🛡️' },
]

// Превращает строки "Тип: Синтетика" в объект
const parseSpecs = (text) =>
  Object.fromEntries(
    text
      .split('\n')
      .map((line) => line.split(':'))
      .filter((parts) => parts.length >= 2 && parts[0].trim())
      .map((parts) => [parts[0].trim(), parts.slice(1).join(':').trim()])
  )

// Обратное преобразование: объект -> строки для редактирования
const specsToText = (specs) => Object.entries(specs || {}).map(([k, v]) => `${k}: ${v}`).join('\n')

export default function Admin() {
  const { products, refreshProducts, notify } = useStore()
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // Текущий раздел берём из адреса; если там что-то странное — открываем «Статистику»
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'stats'
  const openTab = (key) => setParams({ tab: key })

  const run = async (action, okText) => {
    try {
      await action()
      await refreshProducts()
      notify(okText)
    } catch (e) {
      notify('Ошибка API: ' + e.message)
    }
  }

  const closeForm = () => {
    setEditId(null)
    setForm(EMPTY)
    setShowForm(false)
  }

  const submit = (e) => {
    e.preventDefault()
    const base = editId ? products.find((p) => p.id === editId) : { rating: 5, fits: ['*'] }
    const { specsText, ...fields } = form
    const { id, ...data } = { ...base, ...fields, specs: parseSpecs(specsText), price: Number(form.price), stock: Number(form.stock) }
    run(() => (editId ? updateProduct(editId, data) : createProduct(data)), editId ? 'Товар обновлён' : 'Товар добавлен')
    closeForm()
  }

  const edit = (p) => {
    setEditId(p.id)
    setShowForm(true)
    setForm({ name: p.name, article: p.article, brand: p.brand, category: p.category, price: p.price, stock: p.stock, seller: p.seller, image: p.image || '', description: p.description || '', specsText: specsToText(p.specs) })
    window.scrollTo(0, 0)
  }

  const q = query.trim().toLowerCase()
  const shown = q ? products.filter((p) => (p.name + ' ' + p.brand + ' ' + p.article).toLowerCase().includes(q)) : products

  return (
    <div className="wrap page">
      <h1 className="h1s">Админ-панель</h1>

      <div className="dash">
        <div className="dnav" role="navigation" aria-label="Разделы админ-панели">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={'dtab' + (tab === t.key ? ' on' : '')}
              aria-current={tab === t.key ? 'page' : undefined}
              onClick={() => openTab(t.key)}
            >
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="dmain">
          {tab === 'stats' && (
            <>
              <h2 className="h2s">Статистика</h2>
              <AdminStats />
            </>
          )}

          {tab === 'orders' && (
            <>
              <h2 className="h2s">Заказы</h2>
              <AdminOrders />
            </>
          )}

          {tab === 'requests' && (
            <>
              <h2 className="h2s">Заявки на запчасти</h2>
              <AdminRequests />
            </>
          )}

          {tab === 'users' && (
            <>
              <h2 className="h2s">Пользователи</h2>
              <AdminUsers />
            </>
          )}

          {tab === 'admins' && (
            <>
              <h2 className="h2s">Администраторы</h2>
              <AdminAdmins />
            </>
          )}

          {tab === 'products' && (
            <>
              {!API_URL && <p className="bad">Адрес API не указан: откройте src/api.js и вставьте ссылку на MockAPI в API_URL. Пока сайт работает на локальных данных, изменения не сохраняются.</p>}

              <div className="dhead">
                <h2 className="h2s">Товары ({products.length})</h2>
                {!showForm && (
                  <button className="btn" onClick={() => setShowForm(true)}>+ Добавить товар</button>
                )}
              </div>

              {showForm && (
                <form className="box" onSubmit={submit}>
                  <h2 className="h2s">{editId ? 'Изменить товар' : 'Добавить товар'}</h2>
                  <div className="aform">
                    <label>Название<input required value={form.name} onChange={set('name')} /></label>
                    <label>Артикул<input required value={form.article} onChange={set('article')} /></label>
                    <label>Бренд<input required value={form.brand} onChange={set('brand')} /></label>
                    <label>Категория
                      <select value={form.category} onChange={set('category')}>
                        {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
                      </select>
                    </label>
                    <label>Цена, сом<input required type="number" min="0" value={form.price} onChange={set('price')} /></label>
                    <label>В наличии, шт.<input required type="number" min="0" value={form.stock} onChange={set('stock')} /></label>
                    <label className="wide">Фото (путь или ссылка)<input placeholder="/images/products/brake-pads.jpg" value={form.image} onChange={set('image')} /></label>
                    <div className="wide">
                      <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
                    </div>
                    <label className="wide">Описание<input value={form.description} onChange={set('description')} /></label>
                    <label className="wide">Характеристики (каждая с новой строки, в виде Название: значение)
                      <textarea rows="5" placeholder={'Тип: Синтетика\nОбъём: 4 л\nГарантия: 12 месяцев'} value={form.specsText} onChange={set('specsText')} />
                    </label>
                  </div>
                  <div className="row2">
                    <button className="btn">{editId ? 'Сохранить' : 'Добавить'}</button>
                    <button type="button" className="btn ghost" onClick={closeForm}>Отмена</button>
                  </div>
                </form>
              )}

              {API_URL && products.length === 0 && (
                <button className="btn" onClick={() => run(seedProducts, 'Демо-товары загружены')}>Загрузить демо-товары в API</button>
              )}

              {products.length > 0 && (
                <input
                  className="dsearch"
                  type="search"
                  placeholder="Поиск по названию, бренду, артикулу"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Поиск товара"
                />
              )}

              {shown.map((p) => (
                <div className="arow" key={p.id}>
                  <div><b>{p.name}</b><div className="art">{p.brand} · {p.article}</div></div>
                  <span className="price">{money(p.price)}</span>
                  <button className="btn ghost" onClick={() => edit(p)}>Изменить</button>
                  <button className="btn ghost" onClick={() => window.confirm('Удалить товар?') && run(() => deleteProduct(p.id), 'Товар удалён')}>Удалить</button>
                </div>
              ))}
              {q && shown.length === 0 && <p className="mutep">Ничего не найдено.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}