import { useState } from 'react'
import { uploadImage } from '../cloudinary.js'

export default function ImageUpload({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const pick = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Выберите файл-картинку')
    if (file.size > 5 * 1024 * 1024) return setError('Файл больше 5 МБ')
    setError('')
    setBusy(true)
    try {
      onChange(await uploadImage(file))
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
    e.target.value = ''
  }

  return (
    <div className="upload">
      {value && <img className="upload-preview" src={value} alt="" />}
      <label className="btn ghost upload-btn">
        {busy ? 'Загрузка...' : 'Выбрать фото с компьютера'}
        <input type="file" accept="image/*" hidden onChange={pick} disabled={busy} />
      </label>
      {error && <p className="bad">{error}</p>}
    </div>
  )
}