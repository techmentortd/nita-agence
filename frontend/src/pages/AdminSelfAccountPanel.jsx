import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { User, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateOwnAdminAccount } from '../services/services';
import ZoneBadge from '../components/ZoneBadge';

export default function AdminSelfAccountPanel() {
  const { username: myUsername, zone, updateUsername } = useAuth();
  const [username, setUsername] = useState(myUsername || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mut = useMutation({
    mutationFn: () =>
      updateOwnAdminAccount({
        username,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }),
    onSuccess: (data) => {
      updateUsername(data.username);
      setCurrentPassword('');
      setNewPassword('');
      setError('');
      setSuccess('Compte mis à jour.');
    },
    onError: (e) => {
      setSuccess('');
      setError(e.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    mut.mutate();
  };

  return (
    <section style={{ marginTop: 36 }}>
      <div className="admin-toolbar">
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={17} color="var(--orange)" /> Mon compte
            <ZoneBadge zone={zone} />
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>
            Modifiez votre nom d'utilisateur ou votre mot de passe.
          </p>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="admin-success" style={{ marginBottom: 16 }}>{success}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div>
            <label htmlFor="self-username">Nom d'utilisateur</label>
            <input id="self-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="self-current-password"><KeyRound size={11} style={{ verticalAlign: '-1px', marginInlineEnd: 4 }} />Mot de passe actuel</label>
            <input
              id="self-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="requis pour changer le mot de passe"
            />
          </div>
          <div>
            <label htmlFor="self-new-password">Nouveau mot de passe (min. 6 caractères)</label>
            <input
              id="self-new-password"
              type="password"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="laisser vide pour ne pas changer"
            />
          </div>
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-orange" disabled={mut.isPending}>
            {mut.isPending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </section>
  );
}
