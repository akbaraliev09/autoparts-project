import { useEffect, useState } from 'react'
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { ADMIN_EMAILS } from '../config.js'
import { useStore } from '../store.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Управление администраторами прямо на сайте.
// Главные админы (из src/config.js) показаны для информации — их нельзя удалить с сайта.
export default function AdminAdmins() {
  const { notify, t } = useStore()
  const [list, setList] = useState([])
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)

  useEffect(() => {
    return onSnapshot(
      collection(db, 'admins'),
      (snap) => setList(snap.docs.map((d) => ({ email: d.id, ...d.data() }))),
      (e) => setError(t('Не удалось загрузить список: ') + e.message)
    )
  }, [t])

  const main = ADMIN_EMAILS.map((e) => e.toLowerCase())

  const add = async (e) => {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!EMAIL_RE.test(value)) return setError(t('Введите правильную почту, например name@gmail.com'))
    if (main.includes(value) || list.some((a) => a.email === value)) return setError(t('Эта почта уже в списке админов'))
    setError('')
    setBusy(true)
    try {
      await setDoc(doc(db, 'admins', value), { email: value, addedAt: Date.now() })
      setEmail('')
      notify(`${t('Админ добавлен')}: ${value}`)
    } catch (err) {
      setError(t('Ошибка: ') + err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (value) => {
    if (!value) return
    try {
      await deleteDoc(doc(db, 'admins', value))
      notify(t('Права админа убраны'))
    } catch (err) {
      setError(t('Ошибка: ') + err.message)
    } finally {
      setRemoveTarget(null)
    }
  }

  return (
    <div>
      <form className="box" onSubmit={add}>
        <h2 className="h2s">{t('Добавить администратора')}</h2>
        <p className="mutep">
          {t('Введите почту человека. Он должен войти на сайт именно с этой почтой (через Google или обычную регистрацию), тогда ему откроется админ-панель.')}
        </p>
        <div className="row2">
          <input
            className="grow"
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label={t('Почта нового админа')}
          />
          <button className="btn" disabled={busy}>{t('Добавить')}</button>
        </div>
        {error && <p className="bad">{error}</p>}
      </form>

      <h2 className="h2s">{t('Администраторы')} ({main.length + list.length})</h2>
      {main.map((m) => (
        <div className="arow" key={m}>
          <div><b>{m}</b><div className="art">{t('Главный админ (задан в коде)')}</div></div>
        </div>
      ))}
      {list.map((a) => (
        <div className="arow" key={a.email}>
          <div>
            <b>{a.email}</b>
            <div className="art">{t('Добавлен на сайте')}{a.addedAt ? ' · ' + new Date(a.addedAt).toLocaleDateString('ru-RU') : ''}</div>
          </div>
          <button className="btn ghost danger" onClick={() => setRemoveTarget(a.email)}>{t('Убрать')}</button>
        </div>
      ))}
      {list.length === 0 && <p className="mutep">{t('Других админов пока нет.')}</p>}

      {removeTarget && (
        <div className="modal" onClick={() => setRemoveTarget(null)}>
          <div className="box delete-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="delete-head">
              <span className="delete-icon">⚠</span>
              <div>
                <h3>{t('Убрать права админа?')}</h3>
                <p>{t('Пользователь потеряет доступ к админ-панели.')}</p>
              </div>
            </div>

            <div className="delete-product">
              <strong>{removeTarget}</strong>
              <span>{t('Администратор')}</span>
            </div>

            <div className="delete-actions">
              <button className="btn danger-btn" onClick={() => remove(removeTarget)}>{t('Да, убрать')}</button>
              <button className="btn ghost" onClick={() => setRemoveTarget(null)}>{t('Отмена')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}