import { useState } from 'react';
import { schedule as initialSchedule } from '../data/data';
import ScheduleList from '../components/ScheduleList';
import './Schedule.css';

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Schedule() {
  const [items, setItems] = useState(initialSchedule.map(i => ({ ...i, cancelled: false })));

  const handleShuffle = () => {
    const shuffled = shuffleArray(items).map((item, idx) => ({
      ...item,
      cancelled: idx < 2 // рандомно перші 2 після перемішування скасовуються
    }));
    setItems(shuffled);
  };

  const handleReset = () => {
    setItems(initialSchedule.map(i => ({ ...i, cancelled: false })));
  };

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