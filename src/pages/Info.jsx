import { useState } from 'react'
import { useStore } from '../store.jsx'
import { ABOUT } from '../aboutText.js'

export default function Info({ kind }) {
  const { user, t, lang, submitRequest } = useStore()
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [f, setF] = useState({ name: user?.name || '', phone: '', car: '', part: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const r = await submitRequest({ ...f, email: user?.email || '' })
    setBusy(false)
    if (r) setSent(true)
    else setError('Не удалось отправить заявку')
  }

  if (kind === 'about') return (
    <div className="wrap page narrow">
      <h1 className="h1s">{t('О нас')}</h1>
      {ABOUT[lang].map((text, i) => <p key={i}>{text}</p>)}
    </div>
  )

  return (
    <div className="wrap page narrow">
      <h1 className="h1s">{t('Контакты')}</h1>
      <p>{t('Бишкек')} · +996 000 000 000 · info@autoparts.kg · {t('ежедневно')} 9:00–20:00</p>
      <form id="request" className="box" onSubmit={submit}>
        <h2 className="h2s">{t('Заказать запчасть')}</h2>
        <p className="muted">{t('Не нашли нужную деталь? Опишите её, мы найдём и свяжемся с вами.')}</p>
        <label>{t('Имя')}<input required value={f.name} onChange={set('name')} /></label>
        <label>{t('Телефон')}<input required type="tel" placeholder="+996" value={f.phone} onChange={set('phone')} /></label>
        <label>{t('Автомобиль')}<input required placeholder={t('Марка, модель, год, двигатель')} value={f.car} onChange={set('car')} /></label>
        <label>{t('Какая деталь нужна')}<input required placeholder={t('Название или артикул')} value={f.part} onChange={set('part')} /></label>
        {error && <p className="bad">{t(error)}</p>}
        {sent
          ? <p className="ok">{t('Заявка отправлена. Мы свяжемся с вами в ближайшее время.')}</p>
          : <button className="btn full" disabled={busy}>{t('Отправить заявку')}</button>}
      </form>
    </div>
  )
}