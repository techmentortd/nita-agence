import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, Pencil, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from '../services/services';
import { ZONES } from '../utils/zones';
import ZoneBadge from '../components/ZoneBadge';

const EMPTY = { username: '', password: '', zone: '' };

export default function AdminUsersPanel() {
  const { username: myUsername } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admins'] });

  const openNew = () => {
    setForm(EMPTY);
    setError('');
    setEditing({});
  };

  const openEdit = (a) => {
    setForm({ username: a.username, password: '', zone: a.zone || '' });
    setError('');
    setEditing(a);
  };

  const closeForm = () => {
    setEditing(null);
    setError('');
  };

  const createMut = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => { invalidate(); closeForm(); },
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la création'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateAdmin(id, payload),
    onSuccess: () => { invalidate(); closeForm(); },
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la modification'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: invalidate,
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la suppression'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (editing?.id) {
      const payload = { username: form.username, zone: form.zone };
      if (form.password) payload.password = form.password;
      updateMut.mutate({ id: editing.id, payload });
    } else {
      createMut.mutate(form);
    }
  };

  return (
    <section style={{ marginTop: 36 }}>
      <div className="admin-toolbar">
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={17} color="var(--orange)" /> Chefs d'agence
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>Gérez qui administre chaque zone.</p>
        </div>
        <button className="btn btn-orange" onClick={openNew}>
          <UserPlus size={14} /> Ajouter un chef d'agence
        </button>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      {editing && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div>
              <label htmlFor="admin-username">Nom d'utilisateur</label>
              <input
                id="admin-username"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password">
                {editing.id ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe (min. 6 caractères)'}
              </label>
              <input
                id="admin-password"
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required={!editing.id}
              />
            </div>
            <div>
              <label htmlFor="admin-zone">Zone (agence gérée)</label>
              <select
                id="admin-zone"
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
            <button type="submit" className="btn btn-orange" disabled={createMut.isPending || updateMut.isPending}>
              {createMut.isPending || updateMut.isPending ? 'Enregistrement…' : editing.id ? "Enregistrer les modifications" : "Créer l'admin"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={closeForm}>
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
                    <div className="row-actions">
                      {a.zone && (
                        <button title="Modifier" onClick={() => openEdit(a)}>
                          <Pencil size={13} />
                        </button>
                      )}
                      {a.username !== myUsername && (
                        <button
                          className="danger"
                          title="Supprimer"
                          onClick={() => {
                            if (confirm(`Supprimer l'admin "${a.username}" ?`)) deleteMut.mutate(a.id);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
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
