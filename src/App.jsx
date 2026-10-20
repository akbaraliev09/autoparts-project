import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Categories from './pages/Categories.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Auth from './pages/Auth.jsx'
import Account from './pages/Account.jsx'
import Info from './pages/Info.jsx'
import Admin from './pages/Admin.jsx'
import { useStore } from './store.jsx'

function Protected({ children }) {
  const { user } = useStore()
  return user ? children : <Navigate to="/auth" replace />
}
   function AdminOnly({ children }) {
     const { user, isAdmin } = useStore()
     if (!user) return <Navigate to="/auth" replace />
     if (!isAdmin) {
       return (
         <div className="wrap page">
           <h1 className="h1s">Доступ запрещён</h1>
           <p className="muted">Эта страница доступна только администратору.</p>
         </div>
       )
     }
     return children
   }

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Protected><Account /></Protected>} />
          <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>} />
          <Route path="/about" element={<Info kind="about" />} />
          <Route path="/contacts" element={<Info kind="contacts" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
