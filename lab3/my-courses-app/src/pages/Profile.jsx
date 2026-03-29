import { studentProgress } from '../data/data';
import StudentProgress from '../components/StudentProgress';
import './Profile.css';

function Profile() {
  return (
    <div>
      <h1 className="page-title">Мій кабінет</h1>

      <div className="profile-card">
        <div className="profile-avatar">П</div>
        <div>
          <h2 className="profile-name">Павло Бритвак</h2>
          <p className="profile-email">info@courses.ua</p>
        </div>
      </div>

      <h2 className="section-title">Прогрес навчання</h2>
      <StudentProgress items={studentProgress} />

      <h2 className="section-title">Сертифікати</h2>
      <div className="cert-card">
        <span className="cert-icon">🏆</span>
        <div>
          <p className="cert-name">HTML & CSS</p>
          <p className="cert-date">Отримано 2026 року</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;