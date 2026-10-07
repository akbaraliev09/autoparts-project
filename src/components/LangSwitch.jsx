import { useStore } from '../store.jsx'

export default function LangSwitch() {
  const { lang, setLang } = useStore()
  return (
    <select className="lang" value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Язык">
      <option value="ru">RU</option>
      <option value="kg">KG</option>
      <option value="en">EN</option>
    </select>
  )
}
