import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import { useStore } from '../store.jsx'
import { money } from '../data.js'
import StatCard from './StatCard.jsx'

const COLORS = ['#d92b2b', '#17181b', '#6b7078', '#e8686b', '#9a9fa8', '#b81f1f', '#3a3d44']
const tick = { fill: '#9a9fa8', fontSize: 12 }

export default function AdminStats() {
  const { orders, requests } = useStore()

  if (orders.length === 0 && requests.length === 0) {
    return <p className="muted">Пока нет заказов. Оформите несколько тестовых заказов, и здесь появятся графики.</p>
  }

  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const itemsCount = orders.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0)

  // Заказы и продажи по дням (новые заказы лежат в начале списка, поэтому разворачиваю)
  const byDay = {}
  orders.forEach((o) => {
    const day = o.date.split(',')[0]
    byDay[day] = byDay[day] || { day, orders: 0, sales: 0 }
    byDay[day].orders += 1
    byDay[day].sales += o.total
  })
  const days = Object.values(byDay).reverse()

  // Популярные товары и проджи по категориям
  const byProduct = {}
  const byCategory = {}
  orders.forEach((o) =>
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
    // Заявки на запчасти по дням 
  const reqByDay = {}
  requests.forEach((r) => {
    const day = (r.date || '').split(',')[0]
    reqByDay[day] = reqByDay[day] || { day, requests: 0 }
    reqByDay[day].requests += 1
  })
  const reqDays = Object.values(reqByDay).reverse()

  return (
    <div>
      <div className="stats">
        <StatCard title="Заказов" value={orders.length} />
        <StatCard title="Продажи" value={money(revenue)} />
        <StatCard title="Товаров продано" value={itemsCount} />
        <StatCard title="Средний чек" value={money(orders.length ? Math.round(revenue / orders.length) : 0)} />
        <StatCard title="Заявок на запчасти" value={requests.length} />
      </div>

      <div className="charts">
        <div className="box">
          <h3 className="h2s">Заказы по дням</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
              <XAxis dataKey="day" tick={tick} />
              <YAxis allowDecimals={false} tick={tick} />
              <Tooltip />
              <Bar dataKey="orders" name="Заказы" fill="#d92b2b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="box">
          <h3 className="h2s">Продажи по дням, сом</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
              <XAxis dataKey="day" tick={tick} />
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
          <h3 className="h2s">Заявки на запчасти по дням</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={reqDays}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
              <XAxis dataKey="day" tick={tick} />
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