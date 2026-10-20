// Приводит ввод к виду +996 XXX XX XX XX (только кыргызские номера)
export const formatPhone = (value) => {
  let d = value.replace(/\D/g, '')
  if (value.startsWith('+')) {
    d = d.startsWith('996') ? d.slice(3) : ''
  } else if (d.startsWith('996')) {
    d = d.slice(3)
  } else if (d.startsWith('0')) {
    d = d.slice(1)
  }
  d = d.slice(0, 9)
  let out = '+996'
  if (d.length > 0) out += ' ' + d.slice(0, 3)
  if (d.length > 3) out += ' ' + d.slice(3, 5)
  if (d.length > 5) out += ' ' + d.slice(5, 7)
  if (d.length > 7) out += ' ' + d.slice(7, 9)
  return out
}

// Номер верный, если после +996 ровно 9 цифр
export const phoneOk = (value) => value.replace(/\D/g, '').length === 12