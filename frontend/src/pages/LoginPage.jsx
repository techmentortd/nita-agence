import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useThemeLang } from '../context/ThemeLangContext';
import nitaLogo from '../assets/nita-logo-mark.png';

export function LoginPage() {
  const { login } = useAuth();
  const { t } = useThemeLang();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || t('login_error_default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero" style={{ minHeight: 'calc(100vh - 62px)', display: 'flex', alignItems: 'center', paddingTop: 40 }}>
      <div className="hero-orb o1" />
      <div className="hero-orb o2" />
      <div className="hero-orb o3" />
      <div className="login-card">
        <img src={nitaLogo} alt="NITA — Transfert d'argent" className="login-logo" />
        <p className="login-tagline">{t('tagline')}</p>

        <div className="login-badge">
          <ShieldCheck size={16} />
          {t('login_badge')}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <User size={15} />
            <input
              type="text"
              placeholder={t('login_username_ph')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="login-field">
            <Lock size={15} />
            <input
              type="password"
              placeholder={t('login_password_ph')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn btn-orange" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? t('login_submitting') : t('login_submit')}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
