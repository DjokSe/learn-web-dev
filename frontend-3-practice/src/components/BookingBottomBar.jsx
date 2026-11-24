export default function BookingBottomBar({ summary, canContinue, confirmed, onContinue }) {
  return (
    <>
      <div className="booking-summary">
        <p className="summary-label">Ваш визит</p>
        <p className="summary-value" aria-live="polite">{summary}</p>
      </div>
      <div className="booking-actions">
        <a className="action-button action-button--secondary" href="https://www.figma.com/proto/QsYxZm2ePz76Io6f0aDWiN/Untitled?node-id=17-140&amp;page-id=6%3A662">← Услуги</a>
        <button className="action-button action-button--primary" type="button" disabled={!canContinue} onClick={onContinue}>
          Продолжить →
        </button>
      </div>
      {confirmed && <p className="booking-feedback" role="status">Вы выбрали визит: {summary}. Это учебная запись.</p>}
    </>
  );
}
