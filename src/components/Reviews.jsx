import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import Rating from './Rating.jsx'

export default function Reviews({ productId }) {
  const { reviews, user, addReview, t } = useStore()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const list = reviews.filter((r) => r.productId === productId)
  const avg = list.length ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1) : null

  const submit = (e) => {
    e.preventDefault()
    addReview(productId, rating, text)
    setText('')
  }

  return (
    <div>
      <h2 className="h2s">{t('Отзывы')} {avg && <span className="muted">· {t('оценка покупателей')} {avg}</span>}</h2>
      {user ? (
        <form className="box" onSubmit={submit}>
          <Rating value={rating} onChange={setRating} />
          <label>
            {t('Ваш отзыв')}
            <input required value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <button className="btn">{t('Отправить отзыв')}</button>
        </form>
      ) : (
        <p className="muted"><Link to="/auth">{t('Войдите')}</Link>, {t('чтобы оставить отзыв.')}</p>
      )}
      {list.map((r) => (
        <div className="review" key={r.id}>
          <b>{r.author}</b> <Rating value={r.rating} />
          <div className="muted">{r.date}</div>
          <p>{r.text}</p>
        </div>
      ))}
      {!list.length && <p className="muted">{t('Отзывов пока нет.')}</p>}
    </div>
  )
}
