import './ScheduleList.css';

function ScheduleList({ items }) {
  return (
    <div className="schedule-list">
      {items.map(item => (
        <div className={`schedule-item ${item.cancelled ? 'cancelled' : ''}`} key={item.id}>
          <div className="schedule-course">
            {item.course}
            {item.cancelled && <span className="cancelled-badge">Скасовано</span>}
          </div>
          <div className="schedule-info">
            <span>📅 {item.days}</span>
            <span>🕐 {item.time}</span>
            <span>📍 {item.room}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScheduleList;