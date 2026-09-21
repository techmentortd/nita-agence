import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
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
      setError(err.response?.data?.message || 'Identifiants incorrects');
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
        <p className="login-tagline">Le transfert le plus fiable au Tchad</p>

        <div className="login-badge">
          <ShieldCheck size={16} />
          Authentification
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <User size={15} />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
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
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn btn-orange" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
