import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchAgences, createAgence, updateAgence, deleteAgence, toggleAgenceDisponible } from '../services/services';
import AdminAgencyForm from './AdminAgencyForm';
import AdminUsersPanel from './AdminUsersPanel';

export function AdminPage() {
  const { username, logout } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [error, setError] = useState('');

  const { data: agences = [], isLoading } = useQuery({
    queryKey: ['admin-agences'],
    queryFn: () => fetchAgences(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-agences'] });
    queryClient.invalidateQueries({ queryKey: ['home-agences'] });
    queryClient.invalidateQueries({ queryKey: ['agences-stats'] });
  };

  const createMut = useMutation({
    mutationFn: createAgence,
    onSuccess: () => { invalidate(); setEditing(null); },
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la création'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateAgence(id, payload),
    onSuccess: () => { invalidate(); setEditing(null); },
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la modification'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteAgence,
    onSuccess: invalidate,
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la suppression'),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, disponible }) => toggleAgenceDisponible(id, disponible),
    onSuccess: invalidate,
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors du changement de statut'),
  });

  const handleSubmit = (payload) => {
    setError('');
    if (editing?.id) updateMut.mutate({ id: editing.id, payload });
    else createMut.mutate(payload);
  };

  return (
    <section className="section" style={{ maxWidth: 960 }}>
      <div className="admin-toolbar">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>Administration des agences</h1>
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '4px 0 0' }}>Connecté en tant que {username}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-orange" onClick={() => setEditing({})}>
            <Plus size={14} /> Nouvelle agence
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      {editing && (
        <AdminAgencyForm
          initial={editing.id ? editing : null}
          saving={createMut.isPending || updateMut.isPending}
          onCancel={() => { setEditing(null); setError(''); }}
          onSubmit={handleSubmit}
        />
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Quartier</th>
              <th>Type</th>
              <th>Disponibilité</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>Chargement…</td></tr>
            ) : !agences.length ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>Aucune agence</td></tr>
            ) : (
              agences.map((a) => (
                <tr key={a.id}>
                  <td data-label="Nom" style={{ fontWeight: 700, color: 'var(--t1)' }}>
                    <Building2 size={13} style={{ verticalAlign: '-2px', marginRight: 6, color: 'var(--orange)' }} />
                    {a.nom}
                  </td>
                  <td data-label="Quartier">{a.quartier}</td>
                  <td data-label="Type">{a.type === 'principale' ? 'Principale' : 'Standard'}</td>
                  <td data-label="Disponibilité">
                    <button
                      className={`status-toggle${a.disponible === false ? ' off' : ''}`}
                      onClick={() => toggleMut.mutate({ id: a.id, disponible: !(a.disponible !== false) })}
                      disabled={toggleMut.isPending}
                      title={a.disponible === false ? 'Marquer comme disponible' : 'Marquer comme indisponible'}
                    >
                      <span className="status-dot" />
                      {a.disponible === false ? 'Indisponible' : 'Disponible'}
                    </button>
                  </td>
                  <td data-label="Actions" className="admin-table-actions-cell">
                    <div className="row-actions">
                      <button onClick={() => setEditing(a)} title="Modifier"><Pencil size={13} /></button>
                      <button
                        className="danger"
                        title="Supprimer"
                        onClick={() => {
                          if (confirm(`Supprimer "${a.nom}" ?`)) deleteMut.mutate(a.id);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminUsersPanel />
    </section>
  );
}

export default AdminPage;
