export default function Header() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <a className="brand" href="./" aria-label="Тихий клуб — главная">ТИХИЙ КЛУБ</a>
        <span className="brand-caption">БАРБЕРШОП</span>
        <nav className="site-navigation" aria-label="Основная навигация">
          <a className="navigation-link" href="#">Услуги</a>
          <a className="navigation-link" href="#">Мастера</a>
          <a className="navigation-link" href="#">Отзывы</a>
        </nav>
        <a className="salon-phone" href="tel:+74951234567">+7 (495) 123-45-67</a>
      </div>
    </header>
  );
}
