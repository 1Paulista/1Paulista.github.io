import { useState } from 'react';
import { courses } from '../data/data';
import CourseCard from '../components/CourseCard';
import './Courses.css';

const categories = ['Всі', 'Фронтенд', 'Бекенд', 'Бази даних'];

function Courses() {
  const [sortOrder, setSortOrder] = useState('asc');
  const [category, setCategory] = useState('Всі');

  const filtered = courses
    .filter(c => category === 'Всі' || c.category === category)
    .sort((a, b) => sortOrder === 'asc' ? a.duration - b.duration : b.duration - a.duration);

  return (
    <div>
      <h1 className="page-title">Курси</h1>

      <div className="courses-controls">
        <select
          className="select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          className="sort-btn"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          Сортувати за тривалістю {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="courses-grid">
        {filtered.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default Courses;