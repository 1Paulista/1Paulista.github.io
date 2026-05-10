import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Support.css';

function Support() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Заповніть всі поля');
      return;
    }
    try {
      await addDoc(collection(db, 'support'), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });
      setSent(true);
    } catch (err) {
      setError('Помилка при надсиланні повідомлення');
    }
  };

  return (
    <div>
      <h1 className="page-title">Підтримка</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
        Маєш питання або проблему? Напиши нам — відповімо протягом 24 годин.
      </p>

      <div className="support-wrap">
        {sent ? (
          <div className="support-success">
            <span style={{ fontSize: 40 }}>✅</span>
            <h3>Повідомлення надіслано!</h3>
            <p>Ми зв'яжемось з тобою найближчим часом.</p>
          </div>
        ) : (
          <form className="support-form" onSubmit={handleSubmit}>
            {error && <p className="review-error">{error}</p>}
            <input
              className="login-input"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <textarea
              className="review-textarea"
              placeholder="Опишіть вашу проблему або питання..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
            />
            <button className="login-btn" type="submit">Надіслати</button>
          </form>
        )}

        <div className="support-info">
          <div className="support-info-card">
            <span>📧</span>
            <div>
              <p className="support-info-title">Email</p>
              <p className="support-info-text">info@courses.ua</p>
            </div>
          </div>
          <div className="support-info-card">
            <span>📞</span>
            <div>
              <p className="support-info-title">Телефон</p>
              <p className="support-info-text">+380 99 123 45 67</p>
            </div>
          </div>
          <div className="support-info-card">
            <span>🕐</span>
            <div>
              <p className="support-info-title">Години роботи</p>
              <p className="support-info-text">Пн-Пт: 9:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;