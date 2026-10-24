import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'
import { ADMIN_EMAILS } from './config.js'

const CACHE_KEY = 'ap-extra-admins'

// Читает из браузера последний известный список, чтобы при обновлении страницы
// админ не «вылетал» из панели, пока список загружается из Firestore
function readCache() {
  try {
    const list = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

// Хук: возвращает ВСЕ почты админов (главные из config.js + добавленные на сайте).
// Админы, добавленные на сайте, лежат в Firestore, в коллекции "admins" (id документа = почта).
export function useAdminEmails() {
  const [extra, setExtra] = useState(readCache)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'admins'),
      (snap) => {
        const list = snap.docs.map((d) => d.id.toLowerCase())
        setExtra(list)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list))
        } catch {
          /* хранилище недоступно — не страшно */
        }
      },
      () => setExtra([]) // нет доступа к коллекции — остаются только главные админы
    )
    return unsubscribe
  }, [])

  return useMemo(() => [...new Set([...ADMIN_EMAILS.map((e) => e.toLowerCase()), ...extra])], [extra])
}