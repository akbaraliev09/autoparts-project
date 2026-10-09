import { useStore } from '../store.jsx'

// фуутер

export default function Footer() {
  const { t } = useStore()
  return (
    <footer>
      <div className="wrap">
        AutoParts KG · Бишкек · +996 000 000 000 · info@autoparts.kg
        <br />
        {t('Только автозапчасти и товары для автомобилей.')}
      </div>
    </footer>
  )
}
