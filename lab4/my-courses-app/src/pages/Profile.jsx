import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        if (user?.uid) {
          const progressDoc = await getDoc(doc(db, 'progress', user.uid));
          if (progressDoc.exists()) {
            setProgress(progressDoc.data());
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getProgressData = (courseId, totalTopics) => {
    const done = (progress[courseId] || []).length;
    const percent = totalTopics > 0 ? Math.round((done / totalTopics) * 100) : 0;
    return { done, percent, isCompleted: percent === 100 };
  };

  const enrolledCourses = courses.filter(c => 
    (progress.enrolledCourses || []).includes(c.id)
  );

  const completedCourses = enrolledCourses.filter(c => 
    getProgressData(c.id, c.topics?.length || 10).isCompleted
  );

  if (loading) return <div className="loading">Завантаження...</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="profile-name">Павло Бритвак</div>
          <div className="profile-email">{user?.email}</div>
        </div>
      </div>

      <h2 className="section-title">Прогрес навчання</h2>

      {enrolledCourses.length === 0 ? (
        <p>Ти ще не записався на жоден курс</p>
      ) : (
        <div className="courses-list">
          {enrolledCourses.map(course => {
            const totalTopics = course.topics?.length || 10;
            const { percent, isCompleted } = getProgressData(course.id, totalTopics);

            return (
              <div key={course.id} className="course-progress-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className={`status ${isCompleted ? 'completed' : 'in-progress'}`}>
                    {isCompleted ? '✅ Завершено' : 'В процесі'}
                  </span>
                </div>

                {/* Прогрес-бар */}
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="progress-text">{percent}%</span>
                </div>

                <div className="progress-info">
                  {progress[course.id]?.length || 0} з {totalTopics} тем пройдено
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="section-title">Сертифікати</h2>

      {completedCourses.length === 0 ? (
        <p>Завершуй курси щоб отримати сертифікати</p>
      ) : (
        <div className="certificates-list">
          {completedCourses.map(course => (
            <div key={course.id} className="cert-card">
              <div className="cert-icon">🏆</div>
              <div>
                <div className="cert-name">{course.title}</div>
                <div className="cert-date">Курс успішно завершено</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;