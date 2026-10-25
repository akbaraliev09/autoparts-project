import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '../store.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import LangSwitch from './LangSwitch.jsx'
import { HeartIcon, CartIcon, UserIcon } from './Icons.jsx'

// хедер сайта

export default function Header() {
  const { cartCount, favs, user, t } = useStore()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()

  const handleContactsClick = (e) => {
    e.preventDefault()
    const footer = document.getElementById('site-footer')

    if (window.location.pathname === '/') {
      footer?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    nav('/')
    setTimeout(() => {
      document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="wrap hbar">
        <Link to="/" className="logo" aria-label="AutoParts KG">
          <img src="/images/categories/icon.png" alt="" className="logo-img" />
          <b>AutoParts KG</b>
        </Link>
        <nav>
          <NavLink to="/" end>{t('Главная')}</NavLink>
          <NavLink to="/catalog">{t('Каталог')}</NavLink>
          <NavLink to="/categories">{t('Категории')}</NavLink>
          <NavLink to="/about">{t('О нас')}</NavLink>
          <a href="#site-footer" onClick={handleContactsClick}>{t('Контакты')}</a>
        </nav>
        <div className="icons">
          <Link className="ib" to="/catalog?favs=1" aria-label="Избранное"><HeartIcon />{favs.length > 0 && <span className="badge">{favs.length}</span>}</Link>
          <Link className="ib" to="/cart" aria-label="Корзина"><CartIcon />{cartCount > 0 && <span className="badge">{cartCount}</span>}</Link>
         <Link className="ib" to={user ? '/account' : '/auth'} aria-label="Профиль"><UserIcon /> <span className="uname">{user ? user.name : t('Войти')}</span></Link>
          <LangSwitch />
          <ThemeToggle />
          <Link className="btn order" to="/contacts#request">{t('Заказать запчасть')}</Link>
          <button className="ib burger" onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {open && (
        <div className="mnav" onClick={() => setOpen(false)}>
          <Link to="/">{t('Главная')}</Link>
          <Link to="/catalog">{t('Каталог')}</Link>
          <Link to="/categories">{t('Категории')}</Link>
          <Link to="/about">{t('О нас')}</Link>
          <a href="#site-footer" onClick={handleContactsClick}>{t('Контакты')}</a>
          <Link to="/contacts#request">{t('Заказать запчасть')}</Link>
        </div>
      )}
    </header>
  )
}