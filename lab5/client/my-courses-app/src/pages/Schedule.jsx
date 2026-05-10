import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ScheduleList from '../components/ScheduleList';
import './Schedule.css';

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Schedule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'schedule'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          cancelled: false
        }));
        setItems(data);
      } catch (err) {
        console.error('Помилка завантаження розкладу:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const handleShuffle = () => {
    const shuffled = shuffleArray(items).map((item, idx) => ({
      ...item,
      cancelled: idx < 2
    }));
    setItems(shuffled);
  };

  const handleReset = () => {
    setItems(items.map(i => ({ ...i, cancelled: false })));
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Завантаження розкладу...</p>;

  return (
    <div>
      <div className="schedule-header">
        <h1 className="page-title">Розклад занять</h1>
        <div className="schedule-btns">
          <button className="sort-btn" onClick={handleShuffle}>🔀 Перемішати</button>
          <button className="sort-btn" onClick={handleReset}>↺ Скинути</button>
        </div>
      </div>
      <ScheduleList items={items} />
    </div>
  );
}

export default Schedule;