import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'

export default function Auth() {
  const { login, register, t } = useStore()
  const nav = useNavigate()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (f.password.length < 6) return setErr('Пароль должен быть не короче 6 символов')
    const r = mode === 'login' ? login(f.email, f.password) : register(f.name, f.email, f.password)
    r ? setErr(r) : nav('/account')
  }
  return (
    <div className="wrap page">
      <form className="box auth" onSubmit={submit}>
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => { setMode('login'); setErr('') }}>{t('Вход')}</button>
          <button type="button" className={mode === 'reg' ? 'on' : ''} onClick={() => { setMode('reg'); setErr('') }}>{t('Регистрация')}</button>
        </div>
        {mode === 'reg' && <label>{t('Имя')}<input required value={f.name} onChange={set('name')} /></label>}
        <label>Email<input required type="email" value={f.email} onChange={set('email')} /></label>
        <label>{t('Пароль')}<input required type="password" value={f.password} onChange={set('password')} /></label>
        {err && <p className="bad">{t(err)}</p>}
        <button className="btn full">{mode === 'login' ? t('Войти') : t('Создать аккаунт')}</button>
      </form>
    </div>
  )
}
