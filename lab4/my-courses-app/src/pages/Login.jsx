import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <h2 className="login-title">{isRegister ? 'Реєстрація' : 'Вхід'}</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Пароль (мін. 6 символів)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="login-btn" type="submit">
            {isRegister ? 'Зареєструватись' : 'Увійти'}
          </button>
        </form>

        <p className="login-switch">
          {isRegister ? 'Вже маєш акаунт?' : 'Ще немає акаунту?'}
          <button className="login-switch-btn" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Увійти' : 'Зареєструватись'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;