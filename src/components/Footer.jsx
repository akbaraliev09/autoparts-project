import { useStore } from '../store.jsx'

export default function Footer() {
  const { t } = useStore()
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <div className="footer-logo" aria-label="AutoParts KG">
              <img src="/images/categories/icon.png" alt="" className="logo-img footer-logo-img" />
              <span>AutoParts KG</span>
            </div>
            <p>
              {t('Только автозапчасти и товары для автомобилей.')}
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">{t('Контакты')}</h4>
            <ul className="footer-list">
              <li>
                <a href="tel:+996555123456" aria-label={t('Позвонить по телефону')}>
                  <i className="fa-solid fa-phone" aria-hidden="true"></i>
                  +996 (555) 123-456
                </a>
              </li>
              <li>
                <a href="mailto:info@autoparts.kg" aria-label={t('Написать письмо')}>
                  <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                  info@autoparts.kg
                </a>
              </li>
              <li>
                <span>
                  <i className="fa-regular fa-clock" aria-hidden="true"></i>
                  {t('Пн–Сб: 09:00–19:00')}
                </span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">{t('Адрес')}</h4>
            <p className="footer-address">
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              {t('Бишкек, ул. Лермонтова 24, ТЦ «АвтоМир», 2 этаж')}
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">{t('Соцсети')}</h4>
            <div className="social-links" aria-label={t('Социальные сети')}>
              <a href="https://wa.me/996555123456" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              </a>
              <a href="https://t.me/autoparts_kg" target="_blank" rel="noreferrer" aria-label="Telegram">
                <i className="fa-brands fa-telegram" aria-hidden="true"></i>
              </a>
              <a href="https://instagram.com/autoparts.kg" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="wrap footer-bottom-inner">
          <span>© {year} {t('Все права защищены')}</span>
        </div>
      </div>
    </footer>
  )
}
