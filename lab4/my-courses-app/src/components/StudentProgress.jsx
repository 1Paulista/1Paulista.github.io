import './StudentProgress.css';

function StudentProgress({ items }) {
  return (
    <div className="progress-list">
      {items.map((item, i) => (
        <div className="progress-item" key={i}>
          <div className="progress-header">
            <span className="progress-course">{item.course}</span>
            <span className="progress-status" style={{ color: item.percent === 100 ? 'var(--success)' : 'var(--accent)' }}>
              {item.status}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: item.percent + '%' }} />
          </div>
          <div className="progress-percent">{item.percent}%</div>
        </div>
      ))}
    </div>
  );
}

export default StudentProgress;