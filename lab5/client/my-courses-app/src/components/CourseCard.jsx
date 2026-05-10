import { useState } from 'react';
import './CourseCard.css';

function CourseCard({ course }) {
  const [modalOpen, setModalOpen] = useState(false);

  const statusLabel = course.status === 'completed'
    ? '✅ Завершено'
    : course.status === 'active'
    ? '🔥 Активний'
    : null;

  const statusColor = course.status === 'completed'
    ? 'var(--success)'
    : course.status === 'active'
    ? 'var(--accent)'
    : null;

  return (
    <>
      <div className={`course-card ${course.status || ''}`}>
        <div className="course-img-wrap">
          <img src={course.img} alt={course.title} className="course-img" />
          <span className="course-category">{course.category}</span>
          {statusLabel && (
            <span className="course-status-badge" style={{ background: statusColor }}>
              {statusLabel}
            </span>
          )}
        </div>
        <div className="course-body">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-meta">👤 {course.teacher}</p>
          <p className="course-meta">📊 {course.level}</p>
          <div className="course-footer">
            <span className="course-duration">⏱ {course.duration} тижнів</span>
            <button className="course-btn" onClick={() => setModalOpen(true)}>
              Детальніше
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <img src={course.img} alt={course.title} className="modal-img" />
            <div className="modal-body">
              <div className="modal-header">
                <h2 className="modal-title">{course.title}</h2>
                <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
              </div>
              <p className="modal-desc">{course.description}</p>
              <div className="modal-info">
                <div className="modal-info-item"><span>👤</span> {course.teacher}</div>
                <div className="modal-info-item"><span>📊</span> {course.level}</div>
                <div className="modal-info-item"><span>⏱</span> {course.duration} тижнів</div>
                <div className="modal-info-item"><span>🏷</span> {course.category}</div>
              </div>
              {statusLabel && (
                <div className="modal-status" style={{ color: statusColor }}>
                  {statusLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CourseCard;