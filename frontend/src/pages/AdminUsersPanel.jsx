import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchAdmins, createAdmin, deleteAdmin } from '../services/services';
import { ZONES } from '../utils/zones';
import ZoneBadge from '../components/ZoneBadge';

export default function AdminUsersPanel() {
  const { username: myUsername } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ username: '', password: '', zone: '' });
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admins'] });

  const createMut = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => { invalidate(); setForm({ username: '', password: '', zone: '' }); setOpen(false); setError(''); },
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la création'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: invalidate,
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la suppression'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    createMut.mutate(form);
  };

  return (
    <section style={{ marginTop: 36 }}>
      <div className="admin-toolbar">
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={17} color="var(--orange)" /> Comptes administrateurs
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>Gérez qui peut accéder à cette console d'administration.</p>
        </div>
        <button className="btn btn-orange" onClick={() => setOpen((v) => !v)}>
          <UserPlus size={14} /> Ajouter un admin
        </button>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      {open && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div>
              <label htmlFor="new-admin-username">Nom d'utilisateur</label>
              <input
                id="new-admin-username"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="new-admin-password">Mot de passe (min. 6 caractères)</label>
              <input
                id="new-admin-password"
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="new-admin-zone">Zone (le nouvel admin en devient le chef)</label>
              <select
                id="new-admin-zone"
                value={form.zone}
                onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
                required
              >
                <option value="" disabled>Choisir une zone…</option>
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>{z.nom}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-orange" disabled={createMut.isPending}>
              {createMut.isPending ? 'Création…' : "Créer l'admin"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setOpen(false); setError(''); }}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Zone</th>
              <th>Créé le</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24 }}>Chargement…</td></tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id}>
                  <td data-label="Utilisateur" style={{ fontWeight: 700, color: 'var(--t1)' }}>
                    {a.username}
                    {a.username === myUsername && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>(vous)</span>}
                  </td>
                  <td data-label="Zone"><ZoneBadge zone={a.zone} /></td>
                  <td data-label="Créé le">{a.created_at ? new Date(a.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  <td data-label="Actions" className="admin-table-actions-cell">
                    {a.username !== myUsername && (
                      <div className="row-actions">
                        <button
                          className="danger"
                          title="Supprimer"
                          onClick={() => {
                            if (confirm(`Supprimer l'admin "${a.username}" ?`)) deleteMut.mutate(a.id);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
