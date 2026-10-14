import { sendOrderEmail } from './email.js'
import { collection, doc, getDoc, setDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase.js'
import { loginWithGoogle, registerWithEmail, loginWithEmail } from './firebase.js'
import { ADMIN_EMAILS } from './config.js'
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
  const [users, setUsers] = useState([])  // [{name,email,password}]
  const [user, setUser] = useLS('apkg_user', null)
  const [orders, setOrders] = useState([])
  const [car, setCar] = useLS('apkg_car', { make: '', model: '' })
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useLS('apkg_theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [reviews, setReviews] = useState([])
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

    const saveProfile = async (name, email) => {
    try {
      const mail = email.toLowerCase()
      const ref = doc(db, 'users', mail)
      const snap = await getDoc(ref)
      if (snap.exists()) await updateDoc(ref, { lastLogin: Date.now() })
      else await setDoc(ref, { name, email: mail, createdAt: Date.now(), lastLogin: Date.now() })
    } catch (e) {
      console.error('profile', e)
    }
  }

  const register = async (name, email, password) => {
    try {
      const u = await registerWithEmail(name, email, password)
      const mail = (u.email || email).toLowerCase()
      await saveProfile(name, mail)
      setUser({ name, email: mail })
      return null
    } catch (e) {
      console.error(e.code)
      if (e.code === 'auth/email-already-in-use') return 'Этот email уже зарегистрирован'
      if (e.code === 'auth/weak-password') return 'Пароль должен быть не короче 6 символов'
      if (e.code === 'auth/invalid-email') return 'Неверный адрес почты'
      return 'Не удалось зарегистрироваться'
    }
  }

  const login = async (email, password) => {
    try {
      const cred = await loginWithEmail(email, password)
      const mail = (cred.user.email || email).toLowerCase()
      const name = cred.user.displayName || mail
      await saveProfile(name, mail)
      setUser({ name, email: mail })
      return null
    } catch (e) {
      console.error(e.code)
      return 'Неверный email или пароль'
    }
  }
     const logout = () => setUser(null)
  const loginGoogle = async () => {
  try {
    const result = await loginWithGoogle()
    const u = result.user
    const email = u.email || u.uid
    const name = u.displayName || email
    await saveProfile(name, email)
    setUser({ name, email })
    return null
  } catch (e) {
    console.error(e.code, e.message)
    return 'Не удалось войти через Google'
  }
}

  const placeOrder = (info) => {
  const items = cart
    .map((i) => ({ ...products.find((p) => String(p.id) === String(i.id)), qty: i.qty }))
    .filter((i) => i.name)
    .map((i) => ({ id: String(i.id), name: i.name, brand: i.brand || '', category: i.category || '', price: i.price, qty: i.qty }))
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const order = {
    id: 'KG-' + Date.now().toString().slice(-6),
    email: user.email,
    date: new Date().toLocaleString('ru-RU'),
    createdAt: Date.now(),
    items,
    total,
    status: 'Принят',
    ...info,
  }
  setDoc(doc(db, 'orders', order.id), JSON.parse(JSON.stringify(order)))
    .then(() => {
      setCart([])
      notify('Заказ оформлен')
      sendOrderEmail(order).catch((e) => console.error('email', e))
    })
    .catch(() => notify('Не удалось сохранить заказ'))
  return order
}

  // true/false — подходит илине подходит; null — авто не выбрано
  const fits = (p) => {
    if (!car.make) return null
    if (p.fits.includes('*')) return true
    return p.fits.some((f) => car.model ? f === `${car.make} ${car.model}` : f.startsWith(car.make + ' '))
  }

     const addReview = (productId, rating, text) => {
     const id = 'R' + Date.now()
     setDoc(doc(db, 'reviews', id), {
       id,
       productId: String(productId),
       rating,
       text,
       author: user.name,
       createdAt: Date.now(),
       date: new Date().toLocaleDateString('ru-RU'),
     })
       .then(() => notify('Отзыв добавлен'))
       .catch(() => notify('Не удалось сохранить отзыв'))
   }

  const reserve = (productId) => {
    if (reservations.some((x) => x.email === user.email && x.productId === productId)) return notify('Эта запчасть уже забронирована')
    setReservations((r) => [{ id: 'BR-' + Date.now().toString().slice(-6), email: user.email, productId, date: new Date().toLocaleString('ru-RU') }, ...r])
    notify('Запчасть забронирована')
  }

  const cancelReservation = (id) => setReservations((r) => r.filter((x) => x.id !== id))

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
    // Заказы и отзывы лежат в Firestore (общая база для всех устройств)
  useEffect(() => {
    if (!user) {
      setOrders([])
      return
    }
    const isAdminUser = ADMIN_EMAILS.includes((user.email || '').toLowerCase())
    const q = isAdminUser
      ? collection(db, 'orders')
      : query(collection(db, 'orders'), where('email', '==', user.email))
    return onSnapshot(
      q,
      (snap) => setOrders(snap.docs.map((d) => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error('orders', err)
    )
  }, [user?.email])

  useEffect(() => {
    return onSnapshot(
      collection(db, 'reviews'),
      (snap) => setReviews(snap.docs.map((d) => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error('reviews', err)
    )
  }, [])

  useEffect(() => {
  const isAdminUser = !!user && ADMIN_EMAILS.includes((user.email || '').toLowerCase())
  if (!isAdminUser) {
    setUsers([])
    return
  }
  return onSnapshot(
    collection(db, 'users'),
    (snap) => setUsers(snap.docs.map((d) => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
    (err) => console.error('users', err)
  )
}, [user?.email])
   const isAdmin = !!user && ADMIN_EMAILS.includes((user.email || '').toLowerCase())
   const updateOrderStatus = (id, status) =>
  updateDoc(doc(db, 'orders', id), { status }).catch(() => notify('Не удалось изменить статус'))
  return (
    <Ctx.Provider value={{ loginGoogle, isAdmin, updateOrderStatus, users, cart, favs, user, orders, car, setCar, toast, cartCount, addToCart, setQty, toggleFav, register, login, logout, placeOrder, fits, theme, toggleTheme, reviews, addReview, reservations, reserve, cancelReservation, lang, setLang, t, products, productsLoading, refreshProducts, notify }}>
      {children}
      <div className={'toast' + (toast ? ' show' : '')} role="status">{t(toast)}</div>
    </Ctx.Provider>
  )
}
