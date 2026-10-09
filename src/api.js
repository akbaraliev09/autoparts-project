import { PRODUCTS } from './data.js'

// Адрес мокАпи
export const API_URL = 'https://6a8a91c655d899aede9b609b.mockapi.io/api'

const norm = (p) => ({ ...p, id: String(p.id) })

async function request(path, options) {
  if (!API_URL) throw new Error('не указан адрес API (src/api.js)')
  const res = await fetch(API_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}

export async function getProducts() {
  if (!API_URL) return PRODUCTS.map(norm)
  const list = await request('/products')
  return list.map(norm)
}

export const createProduct = (data) => request('/products', { method: 'POST', body: JSON.stringify(data) })
export const updateProduct = (id, data) => request('/products/' + id, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProduct = (id) => request('/products/' + id, { method: 'DELETE' })

// Загружает демо-товары из data.js в API
export async function seedProducts() {
  for (const { id, ...product } of PRODUCTS) {
    await createProduct(product)
  }
}
