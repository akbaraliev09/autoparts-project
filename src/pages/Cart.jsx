import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { money } from '../data.js'
import { useStore } from '../store.jsx'
import PaymentForm from '../components/PaymentForm.jsx'
import { formatPhone, phoneOk } from '../phone.js'

const ONLINE = 'Онлайн картой (демо)'

export default function Cart() {
  const { cart, setQty, user, placeOrder, t, products } = useStore()
  const nav = useNavigate()
  const [paying, setPaying] = useState(false)
    const [phoneError, setPhoneError] = useState('')
  const [f, setF] = useState({ name: user?.name || '', phone: '', city: 'Бишкек', address: '', delivery: 'Курьер', pay: 'Наличными при получении' })
  const items = cart
    .map((i) => ({ ...products.find((p) => String(p.id) === String(i.id)), id: i.id, qty: i.qty }))
    .filter((i) => i.name)
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
    const setPhone = (e) => {
    setPhoneError('')
    setF({ ...f, phone: formatPhone(e.target.value) })
  }

  if (!items.length) return <div className="wrap page"><h1 className="h1s">{t('Корзина')}</h1><div className="empty">{t('Корзина пуста.')} <Link to="/catalog">{t('Перейти в каталог')}</Link></div></div>

      const submit = (e) => {
    e.preventDefault()
    if (!phoneOk(f.phone)) {
      setPhoneError('Введите номер в формате +996 XXX XX XX XX')
      return
    }
    if (f.pay === ONLINE) return setPaying(true)
    placeOrder(f)
    nav('/account')
  }
  return (
    <div className="wrap page">
      <h1 className="h1s">{t('Корзина')}</h1>
      <div className="cgrid">
        <div>
          {items.map((i) => (
            <div className="crow" key={i.id}>
              <div><Link to={`/product/${i.id}`}><b>{i.name}</b></Link><div className="art">{i.brand} · {i.article}</div></div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Меньше">−</button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Больше">+</button>
              </div>
              <div className="price">{money(i.price * i.qty)}</div>
            </div>
          ))}
        </div>
        <form className="box" onSubmit={submit}>
          <h2 className="h2s">{t('Оформление заказа')}</h2>
          {!user && <p className="muted">{t('Чтобы оформить заказ и видеть его в личном кабинете,')} <Link to="/auth">{t('войдите')}</Link> {t('или зарегистрируйтесь.')}</p>}
          <label>{t('Имя')}<input required value={f.name} onChange={set('name')} /></label>
          <label>{t('Телефон')}<input required type="tel" inputMode="tel" placeholder="+996 700 00 00 00" value={f.phone} onChange={setPhone} /></label>
          {phoneError && <p className="bad">{t(phoneError)}</p>}
          <label>{t('Город')}<input required value={f.city} onChange={set('city')} /></label>
          <label>{t('Адрес')}<input required value={f.address} onChange={set('address')} /></label>
          <label>{t('Доставка')}<select value={f.delivery} onChange={set('delivery')}><option value="Курьер">{t('Курьер')}</option><option value="Самовывоз">{t('Самовывоз')}</option></select></label>
          <label>{t('Оплата')}<select value={f.pay} onChange={set('pay')}><option value="Наличными при получении">{t('Наличными при получении')}</option><option value="Картой при получении">{t('Картой при получении')}</option><option value="Онлайн картой (демо)">{t('Онлайн картой (демо)')}</option></select></label>
          <div className="total">{t('Итого:')} <span className="price">{money(total)}</span></div>
          <button className="btn full" disabled={!user}>{t('Оформить заказ')}</button>
        </form>
        {paying && (
        <PaymentForm
        total={total}
        onCancel={() => setPaying(false)}
        onSuccess={(payment) => { placeOrder({ ...f, paid: true, payment }); nav('/account') }}
     />
   )}
      </div>
    </div>
  )
}
