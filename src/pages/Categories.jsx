import { CATEGORIES } from '../data.js'
import CategoryCard from '../components/CategoryCard.jsx'
import { useStore } from '../store.jsx'

export default function Categories() {
  const { t } = useStore()
  return (
    <div className="wrap page">
      <h1 className="h1s">{t('Категории')}</h1>
      <div className="cats">
        {CATEGORIES.map((c) => <CategoryCard key={c.name} c={c} />)}
      </div>
    </div>
  )
}