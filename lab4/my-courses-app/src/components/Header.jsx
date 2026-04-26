import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <span className="logo">📚 LearnHub</span>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Головна</NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Курси</NavLink>
          <NavLink to="/schedule" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Розклад</NavLink>
          {user && <NavLink to="/my-courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Мої курси</NavLink>}
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Кабінет</NavLink>
          <NavLink to="/support" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Підтримка</NavLink>

          {user ? (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Вийти</button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Увійти</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;