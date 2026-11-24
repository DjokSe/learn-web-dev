export default function Footer() {
  return (
    <footer className="salon-footer" id="contacts">
      <div className="footer-inner">
        <div className="footer-signature">
          <a className="brand brand--footer" href="./">ТИХИЙ КЛУБ</a>
          <span className="signature-divider" aria-hidden="true">/</span>
          <p className="salon-motto">Хорошая стрижка. Свой ритм.</p>
        </div>
        <address className="salon-details">Москва, ул. Садовая, 15 <span className="details-divider">·</span> Ежедневно 10:00–21:00 <span className="details-divider">·</span> <a className="footer-phone" href="tel:+74951234567">+7 (495) 123-45-67</a></address>
        <p className="footer-legal">© 2026 Тихий клуб. <span className="privacy-label">Политика конфиденциальности</span></p>
      </div>
    </footer>
  );
}
