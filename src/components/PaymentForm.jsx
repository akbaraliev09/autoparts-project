import { useState } from 'react'
import { useStore } from '../store.jsx'
import { money } from '../data.js'

// Демо-оплата: деньги не списываются, номер карты нигде не сохраняется
export default function PaymentForm({ total, onSuccess, onCancel }) {
  const { t } = useStore()
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  const validExpiry = () => {
    const [mm, yy] = expiry.split('/').map(Number)
    if (!mm || !yy || mm < 1 || mm > 12) return false
    const now = new Date()
    const year = now.getFullYear() % 100
    return yy > year || (yy === year && mm >= now.getMonth() + 1)
  }

  const pay = (e) => {
    e.preventDefault()
    const digits = card.replace(/\s/g, '')
    if (digits.length !== 16 || !validExpiry() || cvc.length !== 3) {
      setError('Проверьте данные карты')
      return
    }
    setError('')
    setBusy(true)
    setTimeout(() => {
      if (digits === '4000000000000002') {
        setBusy(false)
        setError('Карта отклонена')
      } else {
        onSuccess({ last4: digits.slice(-4) })
      }
    }, 1200)
  }

  return (
    <div className="modal" onClick={onCancel}>
      <form className="box pay" onClick={(e) => e.stopPropagation()} onSubmit={pay}>
        <h2 className="h2s">{t('Демо-оплата')}</h2>
        <p className="muted">{t('Тестовый режим: деньги не списываются. Не вводите данные настоящей карты.')}</p>
        <p className="muted">{t('Тестовая карта: 4242 4242 4242 4242, любой будущий срок и CVC.')}</p>
        <label>
          {t('Номер карты')}
          <input autoComplete="off" inputMode="numeric" placeholder="4242 4242 4242 4242" value={card} onChange={(e) => setCard(formatCard(e.target.value))} />
        </label>
        <div className="aform">
          <label>
            {t('Срок (ММ/ГГ)')}
            <input autoComplete="off" placeholder="12/30" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} />
          </label>
          <label>
            CVC
            <input autoComplete="off" inputMode="numeric" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))} />
          </label>
        </div>
        {error && <p className="bad">{t(error)}</p>}
        <button className="btn full" disabled={busy}>
          {busy ? t('Обработка...') : `${t('Оплатить')} ${money(total)}`}
        </button>
        <button type="button" className="btn ghost full" onClick={onCancel} disabled={busy} style={{ marginTop: 8 }}>
          {t('Отмена')}
        </button>
      </form>
    </div>
  )
}