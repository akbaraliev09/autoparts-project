import { useStore } from '../store.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useStore()
  // луна — тёмная, солнце — светлая
  return (
    <button className="ib" onClick={toggleTheme} aria-label="Сменить тему">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
