import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { PRODUCTS } from './data.js'
import { getProducts } from './api.js'
import { DICT } from './i18n.js'
import './i18n-pages.js'

const Ctx = createContext()
export const useStore = () => useContext(Ctx)

function useLS(key, init) {
  const [v, setV] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? init } catch { return init }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, setV]
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useLS('apkg_cart', [])      // [{id, qty}]
  const [favs, setFavs] = useLS('apkg_favs', [])      // [id]
  const [users, setUsers] = useLS('apkg_users', [])   // [{name,email,password}]
  const [user, setUser] = useLS('apkg_user', null)
  const [orders, setOrders] = useLS('apkg_orders', [])
  const [car, setCar] = useLS('apkg_car', { make: '', model: '' })
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useLS('apkg_theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [reviews, setReviews] = useLS('apkg_reviews', [])
  const [reservations, setReservations] = useLS('apkg_resv', [])
  const [lang, setLang] = useLS('apkg_lang', 'ru')
  const t = (s) => (lang === 'ru' ? s : (DICT[lang]?.[s] ?? s))

  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const refreshProducts = useCallback(async () => {
    try {
      setProducts(await getProducts())
    } catch {
      setProducts(PRODUCTS.map((p) => ({ ...p, id: String(p.id) })))
    }
  }, [])
  useEffect(() => { refreshProducts().finally(() => setProductsLoading(false)) }, [refreshProducts])

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const notify = useCallback((t) => {
    setToast(t)
    setTimeout(() => setToast(''), 2200)
  }, [])

  const addToCart = (id) => {
    setCart((c) => c.some((i) => i.id === id) ? c.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i) : [...c, { id, qty: 1 }])
    notify('Товар добавлен в корзину')
  }
  const setQty = (id, qty) => setCart((c) => qty < 1 ? c.filter((i) => i.id !== id) : c.map((i) => i.id === id ? { ...i, qty } : i))
  const toggleFav = (id) => setFavs((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id])

  const register = (name, email, password) => {
    if (users.some((u) => u.email === email)) return 'Этот email уже зарегистрирован'
    const u = { name, email, password }
    setUsers([...users, u]); setUser({ name, email }); return null
  }
  const login = (email, password) => {
    const u = users.find((x) => x.email === email && x.password === password)
    if (!u) return 'Неверный email или пароль'
    setUser({ name: u.name, email }); return null
  }
  const logout = () => setUser(null)

  const placeOrder = (info) => {
    const items = cart.map((i) => ({ ...products.find((p) => String(p.id) === String(i.id)), qty: i.qty }))
    const total = items.reduce((s, i) => s + i.price * i.qty, 0)
    const order = { id: 'KG-' + Date.now().toString().slice(-6), email: user.email, date: new Date().toLocaleString('ru-RU'), items, total, status: 'Принят', ...info }
    setOrders([order, ...orders]); setCart([]); notify('Заказ оформлен')
    return order
  }

  // true/false — подходит/не подходит; null — авто не выбрано
  const fits = (p) => {
    if (!car.make) return null
    if (p.fits.includes('*')) return true
    return p.fits.some((f) => car.model ? f === `${car.make} ${car.model}` : f.startsWith(car.make + ' '))
  }

  const addReview = (productId, rating, text) => {
    setReviews((r) => [{ id: Date.now(), productId, rating, text, author: user.name, date: new Date().toLocaleDateString('ru-RU') }, ...r])
    notify('Отзыв добавлен')
  }

  const reserve = (productId) => {
    if (reservations.some((x) => x.email === user.email && x.productId === productId)) return notify('Эта запчасть уже забронирована')
    setReservations((r) => [{ id: 'BR-' + Date.now().toString().slice(-6), email: user.email, productId, date: new Date().toLocaleString('ru-RU') }, ...r])
    notify('Запчасть забронирована')
  }

  const cancelReservation = (id) => setReservations((r) => r.filter((x) => x.id !== id))

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  return (
    <Ctx.Provider value={{ cart, favs, user, orders, car, setCar, toast, cartCount, addToCart, setQty, toggleFav, register, login, logout, placeOrder, fits, theme, toggleTheme, reviews, addReview, reservations, reserve, cancelReservation, lang, setLang, t, products, productsLoading, refreshProducts, notify }}>
      {children}
      <div className={'toast' + (toast ? ' show' : '')} role="status">{t(toast)}</div>
    </Ctx.Provider>
  )
}
