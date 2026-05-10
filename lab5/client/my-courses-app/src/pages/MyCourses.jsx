import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './MyCourses.css';

function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const progressDoc = await getDoc(doc(db, 'progress', user.uid));
        if (progressDoc.exists()) setProgress(progressDoc.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleTopicToggle = async (courseId, topicIndex) => {
    const courseProgress = progress[courseId] || [];
    const newCourseProgress = courseProgress.includes(topicIndex)
      ? courseProgress.filter(i => i !== topicIndex)
      : [...courseProgress, topicIndex];

    const newProgress = { ...progress, [courseId]: newCourseProgress };
    setProgress(newProgress);
    await setDoc(doc(db, 'progress', user.uid), newProgress);
  };

  const getPercent = (courseId, totalTopics) => {
    const done = (progress[courseId] || []).length;
    return Math.round((done / totalTopics) * 100);
  };

  const enrolledCourses = courses.filter(c =>
    (progress.enrolledCourses || []).includes(c.id)
  );

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Завантаження...</p>;

  return (
    <div>
      <h1 className="page-title">Мої курси</h1>

      {enrolledCourses.length === 0 ? (
        <div className="empty-courses">
          <span style={{ fontSize: 48 }}>📚</span>
          <h3>Ти ще не записався на жоден курс</h3>
          <p>Перейди до розділу Курси і запишись на перший курс!</p>
        </div>
      ) : (
        <div className="my-courses-list">
          {enrolledCourses.map(course => {
            const percent = getPercent(course.id, course.topics?.length || 10);
            const completedTopics = progress[course.id] || [];
            const isExpanded = expanded[course.id];
            const isCompleted = percent === 100;

            return (
              <div className={`my-course-item ${isCompleted ? 'completed' : ''}`} key={course.id}>
                <div className="my-course-header" onClick={() => setExpanded(prev => ({ ...prev, [course.id]: !prev[course.id] }))}>
                  <div className="my-course-info">
                    <img src={course.img} alt={course.title} className="my-course-img" />
                    <div>
                      <h3 className="my-course-title">{course.title}</h3>
                      <p className="my-course-meta">👤 {course.teacher} · ⏱ {course.duration} тижнів</p>
                    </div>
                  </div>
                  <div className="my-course-right">
                    <span className={`my-course-status ${isCompleted ? 'status-done' : 'status-active'}`}>
                      {isCompleted ? '✅ Завершено' : '🔥 Активний'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                <div className="my-course-progress">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{
                      width: percent + '%',
                      backgroundColor: isCompleted ? 'var(--success)' : 'var(--accent)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <span className="my-course-percent">
                    {completedTopics.length} з {course.topics?.length || 10} тем — {percent}%
                  </span>
                </div>

                {isExpanded && (
                  <div className="topics-list">
                    {course.topics?.map((topic, idx) => (
                      <label className="topic-item" key={idx}>
                        <input
                          type="checkbox"
                          className="topic-checkbox"
                          checked={completedTopics.includes(idx)}
                          onChange={() => handleTopicToggle(course.id, idx)}
                        />
                        <span className={completedTopics.includes(idx) ? 'topic-done' : ''}>
                          {topic}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyCourses;