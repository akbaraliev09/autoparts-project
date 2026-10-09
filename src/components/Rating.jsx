// Звёзды рейтинга. Если передан ончейндж, звёзды кликабельны.
export default function Rating({ value = 0, onChange }) {
  return (
    <span className="stars" aria-label={`Рейтинг ${value}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={'star' + (n <= Math.round(value) ? ' on' : '') + (onChange ? ' click' : '')}
          onClick={() => onChange && onChange(n)}
        >
          ★
        </span>
      ))}
    </span>
  )
}
