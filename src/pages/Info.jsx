import { useState } from 'react'
import { useStore } from '../store.jsx'
import { ABOUT } from '../aboutText.js'

export default function Info({ kind }) {
  const { user, t, lang } = useStore()
  const [sent, setSent] = useState(false)

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
      <form id="request" className="box" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
        <h2 className="h2s">{t('Заказать запчасть')}</h2>
        <p className="muted">{t('Не нашли нужную деталь? Опишите её, мы найдём и свяжемся с вами.')}</p>
        <label>{t('Имя')}<input required defaultValue={user?.name} /></label>
        <label>{t('Телефон')}<input required type="tel" placeholder="+996" /></label>
        <label>{t('Автомобиль')}<input required placeholder={t('Марка, модель, год, двигатель')} /></label>
        <label>{t('Какая деталь нужна')}<input required placeholder={t('Название или артикул')} /></label>
        {sent ? <p className="ok">{t('Заявка отправлена. Мы свяжемся с вами в ближайшее время.')}</p> : <button className="btn full">{t('Отправить заявку')}</button>}
      </form>
    </div>
  )
}
