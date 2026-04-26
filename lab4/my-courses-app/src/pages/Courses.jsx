import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import './Courses.css';

const categories = ['Всі', 'Фронтенд', 'Бекенд', 'Бази даних'];

function StarRating({ value, onChange }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star ${star <= value ? 'star-active' : ''}`}
          onClick={() => onChange(star)}
        >★</button>
      ))}
    </div>
  );
}

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [category, setCategory] = useState('Всі');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        const reviewsSnap = await getDocs(reviewsQuery);
        setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        if (user) {
          const progressDoc = await getDoc(doc(db, 'progress', user.uid));
          if (progressDoc.exists()) setProgress(progressDoc.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (!user) return;
    const enrolled = progress.enrolledCourses || [];
    if (enrolled.includes(courseId)) return;
    const newProgress = { ...progress, enrolledCourses: [...enrolled, courseId] };
    setProgress(newProgress);
    await setDoc(doc(db, 'progress', user.uid), newProgress);
  };

  const getStatus = (courseId, totalTopics) => {
    const enrolled = progress.enrolledCourses || [];
    if (!enrolled.includes(courseId)) return null;
    const done = (progress[courseId] || []).length;
    if (done === totalTopics) return 'completed';
    return 'active';
  };

  const filtered = courses
    .filter(c => category === 'Всі' || c.category === category)
    .sort((a, b) => sortOrder === 'asc' ? a.duration - b.duration : b.duration - a.duration);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!review.trim() || !selectedCourse || rating === 0) {
      setReviewError('Заповніть всі поля та поставте оцінку');
      return;
    }
    try {
      const newReview = {
        userEmail: user.email,
        course: selectedCourse,
        text: review,
        rating,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      setReviews(prev => [{ id: docRef.id, ...newReview, createdAt: { toDate: () => new Date() } }, ...prev]);
      setReviewSent(true);
      setReview('');
      setSelectedCourse('');
      setRating(0);
    } catch (err) {
      setReviewError('Помилка при збереженні відгуку');
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Завантаження...</p>;

  return (
    <div>
      <h1 className="page-title">Курси</h1>

      <div className="courses-controls">
        <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button className="sort-btn" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          Сортувати за тривалістю {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="courses-grid">
        {filtered.map(course => {
          const status = getStatus(course.id, course.topics?.length || 10);
          return (
            <div key={course.id} className={`course-card ${status || ''}`}>
              <div className="course-img-wrap">
                <img src={course.img} alt={course.title} className="course-img" />
                <span className="course-category">{course.category}</span>
                {status && (
                  <span className="course-status-badge" style={{
                    background: status === 'completed' ? 'var(--success)' : 'var(--accent)'
                  }}>
                    {status === 'completed' ? '✅ Завершено' : '🔥 Активний'}
                  </span>
                )}
              </div>
              <div className="course-body">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-meta">👤 {course.teacher}</p>
                <p className="course-meta">📊 {course.level}</p>
                <div className="course-footer">
                  <span className="course-duration">⏱ {course.duration} тижнів</span>
                  {user ? (
                    <button
                      className="course-btn"
                      onClick={() => handleEnroll(course.id)}
                      disabled={!!status}
                      style={{
                        background: status === 'completed' ? 'var(--success)' : status === 'active' ? 'var(--accent)' : ''
                      }}
                    >
                      {status === 'completed' ? 'Завершено' : status === 'active' ? 'Активний' : 'Записатись'}
                    </button>
                  ) : (
                    <button className="course-btn" onClick={() => window.location.href = '#/login'}>
                      Увійти
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Відгуки */}
      <div className="review-section">
        <h2 className="section-title">Відгуки студентів</h2>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Відгуків ще немає</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(r => (
              <div className="review-card" key={r.id}>
                <div className="review-top">
                  <span className="review-email">{r.userEmail}</span>
                  <span className="review-course">{r.course}</span>
                  <span className="review-stars">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ color: s <= r.rating ? '#f59e0b' : 'var(--border)' }}>★</span>
                    ))}
                  </span>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <>
            <h2 className="section-title" style={{ marginTop: 32 }}>Залишити відгук</h2>
            {reviewSent ? (
              <p className="review-success">✅ Дякуємо! Ваш відгук збережено.</p>
            ) : (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                {reviewError && <p className="review-error">{reviewError}</p>}
                <select className="select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                  <option value="">Оберіть курс</option>
                  {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                </select>
                <StarRating value={rating} onChange={setRating} />
                <textarea
                  className="review-textarea"
                  placeholder="Ваш відгук про курс..."
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  rows={4}
                />
                <button className="login-btn" type="submit">Надіслати відгук</button>
              </form>
            )}
          </>
        ) : (
          <p className="review-locked">🔒 Увійдіть в акаунт щоб залишити відгук</p>
        )}
      </div>
    </div>
  );
}

export default Courses;