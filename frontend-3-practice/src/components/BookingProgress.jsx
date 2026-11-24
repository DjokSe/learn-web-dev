export default function BookingProgress() {
  return (
    <nav className="booking-progress" aria-label="Этапы записи">
      <ol className="progress-list">
        <li className="progress-step progress-step--complete">✓ Мастер</li>
        <li className="progress-step progress-step--complete">✓ Услуга</li>
        <li className="progress-step progress-step--current" aria-current="step">3 Дата и время</li>
        <li className="progress-step">4 Контакты</li>
        <li className="progress-step">5 Подтверждение</li>
      </ol>
    </nav>
  );
}
