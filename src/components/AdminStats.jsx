import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import { useStore } from '../store.jsx'
import { money } from '../data.js'
import StatCard from './StatCard.jsx'

const COLORS = ['#d92b2b', '#17181b', '#6b7078', '#e8686b', '#9a9fa8', '#b81f1f', '#3a3d44']
const tick = { fill: '#9a9fa8', fontSize: 12 }

const PERIODS = [
  { key: 'day', label: 'День', unit: 'по часам' },
  { key: 'week', label: 'Неделя', unit: 'по дням' },
  { key: 'month', label: 'Месяц', unit: 'по дням' },
  { key: 'year', label: 'Год', unit: 'по месяцам' },
]
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const two = (n) => String(n).padStart(2, '0')

// Время заказа или заявки в миллисекундах.
// У новых записей есть createdAt, у старых разбираем текстовую дату «20.10.2026, 16:03:12».
function getTime(x) {
  if (typeof x.createdAt === 'number') return x.createdAt
  const m = String(x.date || '').match(/(\d{2})\.(\d{2})\.(\d{4})(?:,?\s*(\d{2}):(\d{2}))?/)
  if (!m) return 0
  return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0)).getTime()
}

// Делит выбранный период на отрезки: часы, дни или месяцы
function makeBuckets(period) {
  const now = new Date()
  const y = now.getFullYear()
  const mo = now.getMonth()
  const d = now.getDate()
  const list = []
  if (period === 'day') {
    for (let h = 0; h < 24; h++) {
      list.push({ label: two(h) + ':00', from: new Date(y, mo, d, h).getTime(), to: new Date(y, mo, d, h + 1).getTime() })
    }
  } else if (period === 'week' || period === 'month') {
    const n = period === 'week' ? 7 : 30
    for (let i = n - 1; i >= 0; i--) {
      const from = new Date(y, mo, d - i)
      list.push({ label: two(from.getDate()) + '.' + two(from.getMonth() + 1), from: from.getTime(), to: new Date(y, mo, d - i + 1).getTime() })
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const from = new Date(y, mo - i, 1)
      list.push({ label: MONTHS[from.getMonth()] + ' ' + String(from.getFullYear()).slice(2), from: from.getTime(), to: new Date(y, mo - i + 1, 1).getTime() })
    }
  }
  return list
}

export default function AdminStats() {
  const { orders, requests } = useStore()
  const [period, setPeriod] = useState('week')

  if (orders.length === 0 && requests.length === 0) {
    return <p className="muted">Пока нет заказов. Оформите несколько тестовых заказов, и здесь появятся графики.</p>
  }

  const current = PERIODS.find((p) => p.key === period)
  const buckets = makeBuckets(period)
  const start = buckets[0].from
  const end = buckets[buckets.length - 1].to

  // Оставляем только то, что попало в выбранный период
  const inPeriod = (x) => {
    const t = getTime(x)
    return t >= start && t < end
  }
  const ordersP = orders.filter(inPeriod)
  const requestsP = requests.filter(inPeriod)

  const revenue = ordersP.reduce((s, o) => s + o.total, 0)
  const itemsCount = ordersP.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0)

  // Данные для графиков: по одной записи на каждый час, день или месяц (пустые тоже показываем)
  const series = buckets.map((b) => ({ day: b.label, orders: 0, sales: 0, requests: 0 }))
  const indexOf = (x) => {
    const t = getTime(x)
    return buckets.findIndex((b) => t >= b.from && t < b.to)
  }
  ordersP.forEach((o) => {
    const i = indexOf(o)
    if (i >= 0) {
      series[i].orders += 1
      series[i].sales += o.total
    }
  })
  requestsP.forEach((r) => {
    const i = indexOf(r)
    if (i >= 0) series[i].requests += 1
  })

  // Популярные товары и продажи по категориям за период
  const byProduct = {}
  const byCategory = {}
  ordersP.forEach((o) =>
    o.items.filter((i) => i.name).forEach((i) => {
      byProduct[i.name] = (byProduct[i.name] || 0) + i.qty
      byCategory[i.category] = (byCategory[i.category] || 0) + i.price * i.qty
    })
  )
  const top = Object.entries(byProduct)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
  const cats = Object.entries(byCategory).map(([name, value]) => ({ name, value }))

  // Чтобы подписи на оси не слипались: для часов и месяца показываем каждую третью
  const xInterval = period === 'day' || period === 'month' ? 2 : 0

  return (
    <div>
      <div className="periods">
        {PERIODS.map((p) => (
          <button key={p.key} type="button" className={period === p.key ? 'on' : ''} onClick={() => setPeriod(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="stats">
        <StatCard title="Заказов" value={ordersP.length} />
        <StatCard title="Продажи" value={money(revenue)} />
        <StatCard title="Товаров продано" value={itemsCount} />
        <StatCard title="Средний чек" value={money(ordersP.length ? Math.round(revenue / ordersP.length) : 0)} />
        <StatCard title="Заявок на запчасти" value={requestsP.length} />
      </div>

      {ordersP.length === 0 && requestsP.length === 0 && (
        <p className="muted">За выбранный период ({current.label.toLowerCase()}) заказов и заявок нет. Попробуйте другой период.</p>
      )}

      <div className="charts">
        <div className="box">
          <h3 className="h2s">Заказы {current.unit}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
              <XAxis dataKey="day" tick={tick} interval={xInterval} />
              <YAxis allowDecimals={false} tick={tick} />
              <Tooltip />
              <Bar dataKey="orders" name="Заказы" fill="#d92b2b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="box">
          <h3 className="h2s">Продажи {current.unit}, сом</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
              <XAxis dataKey="day" tick={tick} interval={xInterval} />
              <YAxis tick={tick} />
              <Tooltip formatter={(v) => money(v)} />
              <Line type="monotone" dataKey="sales" name="Продажи" stroke="#d92b2b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="box">
          <h3 className="h2s">Популярные товары</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={top} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
              <XAxis type="number" allowDecimals={false} tick={tick} />
              <YAxis type="category" dataKey="name" width={130} tick={tick} />
              <Tooltip />
              <Bar dataKey="qty" name="Продано, шт." fill="#d92b2b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="box">
          <h3 className="h2s">Продажи по категориям</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={cats} dataKey="value" nameKey="name" outerRadius={85}>
                {cats.map((c, i) => <Cell key={c.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => money(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="box">
          <h3 className="h2s">Заявки на запчасти {current.unit}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
              <XAxis dataKey="day" tick={tick} interval={xInterval} />
              <YAxis allowDecimals={false} tick={tick} />
              <Tooltip />
              <Bar dataKey="requests" name="Заявки" fill="#6b7078" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}