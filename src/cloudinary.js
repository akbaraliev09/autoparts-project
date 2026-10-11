const CLOUD_NAME = 'asw4bl3q'
const UPLOAD_PRESET = 'autoparts_unsigned'

// Загружает фото в Cloudinary и возвращает ссылку на него
export async function uploadImage(file) {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: data,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Не удалось загрузить фото')
  }
  const json = await res.json()
  // f_auto,q_auto,w_800 сжимает картинку и уменшает её до 800 пикселей
  return json.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_800/')
}