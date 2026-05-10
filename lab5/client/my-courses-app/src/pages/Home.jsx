import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '🎯',
    title: 'Практичні завдання',
    short: 'Реальні проєкти в кожному курсі',
    detail: 'Кожен курс містить практичні завдання на основі реальних задач з індустрії. Ти будуєш портфоліо ще під час навчання — не просто теорія, а справжній код який працює.'
  },
  {
    icon: '👨‍🏫',
    title: 'Досвідчені викладачі',
    short: 'Практики з індустрії',
    detail: 'Наші викладачі — діючі розробники з досвідом роботи в реальних компаніях. Вони знають що потрібно ринку і навчають актуальним підходам, а не застарілим концепціям.'
  },
  {
    icon: '📜',
    title: 'Сертифікати',
    short: 'Підтвердження ваших знань',
    detail: 'Після завершення кожного курсу ти отримуєш сертифікат який можна додати до LinkedIn або резюме. Роботодавці знають нашу платформу і довіряють нашим сертифікатам.'
  },
  {
    icon: '💬',
    title: 'Підтримка 24/7',
    short: 'Завжди готові допомогти',
    detail: 'Застряг на завданні о 2 ночі? Не проблема. Наша спільнота та команда підтримки завжди онлайн. Також є чат між студентами де можна отримати допомогу від однокурсників.'
  },
];

function Home() {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">Навчайся.<br />Розвивайся.<br />Досягай.</h1>
        <p className="hero-sub">Сучасна платформа для вивчення програмування та веброзробки. Обери курс і почни вже сьогодні.</p>
        <div className="hero-btns">
          <Link to="/courses" className="btn-primary">Переглянути курси</Link>
          <Link to="/profile" className="btn-outline">Мій кабінет</Link>
        </div>
      </div>

      <div className="features">
        {features.map((f, i) => (
          <div
            className={`feature-card ${activeFeature === i ? 'feature-open' : ''}`}
            key={i}
            onClick={() => setActiveFeature(activeFeature === i ? null : i)}
          >
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.short}</p>
            {activeFeature === i && (
              <p className="feature-detail">{f.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;