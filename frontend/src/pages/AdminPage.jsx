import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, LogOut, Building2, CheckCircle2, XCircle, MapPinned, Search, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchAgences, createAgence, updateAgence, deleteAgence, toggleAgenceDisponible, toggleAgenceVerifie } from '../services/services';
import { ZONES } from '../utils/zones';
import ZoneBadge from '../components/ZoneBadge';
import Modal from '../components/Modal';
import AdminAgencyForm from './AdminAgencyForm';
import AdminUsersPanel from './AdminUsersPanel';
import AdminSelfAccountPanel from './AdminSelfAccountPanel';

export function AdminPage() {
  const { username, zone: adminZone, logout } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [error, setError] = useState('');
  const [zoneFilter, setZoneFilter] = useState(adminZone || 'all');
  const [search, setSearch] = useState('');
  const [verifyConfirm, setVerifyConfirm] = useState(null); // agence en attente de confirmation

  const { data: agences = [], isLoading } = useQuery({
    queryKey: ['admin-agences'],
    queryFn: () => fetchAgences(),
  });

  // Un chef de zone ne voit que les agences de sa zone ; un super-admin peut filtrer.
  const scoped = useMemo(
    () => (adminZone ? agences.filter((a) => a.zone === adminZone) : agences),
    [agences, adminZone]
  );
  const byZone = useMemo(
    () => (zoneFilter === 'all' ? scoped : scoped.filter((a) => a.zone === zoneFilter)),
    [scoped, zoneFilter]
  );
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return byZone;
    return byZone.filter(
      (a) => a.nom.toLowerCase().includes(q) || (a.quartier || '').toLowerCase().includes(q)
    );
  }, [byZone, search]);
  const stats = useMemo(() => ({
    total: scoped.length,
    disponibles: scoped.filter((a) => a.disponible !== false).length,
    indisponibles: scoped.filter((a) => a.disponible === false).length,
    verifiees: scoped.filter((a) => a.verifie).length,
    zones: new Set(scoped.map((a) => a.zone)).size,
  }), [scoped]);

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

  const toggleVerifieMut = useMutation({
    mutationFn: ({ id, verifie }) => toggleAgenceVerifie(id, verifie),
    onSuccess: () => { invalidate(); setVerifyConfirm(null); },
    onError: (e) => setError(e.response?.data?.message || 'Erreur lors de la vérification'),
  });

  const handleSubmit = (payload) => {
    setError('');
    if (editing?.id) updateMut.mutate({ id: editing.id, payload });
    else createMut.mutate(payload);
  };

  return (
    <section className="section" style={{ maxWidth: 960 }}>
      <div className="admin-header-card">
        <div className="admin-toolbar">
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>Administration des agences</h1>
            <p style={{ fontSize: 13, color: 'var(--t3)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              Connecté en tant que <strong style={{ color: 'var(--t1)' }}>{username}</strong>
              <ZoneBadge zone={adminZone} />
            </p>
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

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ '--stat-color': 'var(--blue)' }}><Building2 size={16} /></div>
            <div><div className="admin-stat-n">{stats.total}</div><div className="admin-stat-l">Agences</div></div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ '--stat-color': 'var(--green)' }}><CheckCircle2 size={16} /></div>
            <div><div className="admin-stat-n">{stats.disponibles}</div><div className="admin-stat-l">Disponibles</div></div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ '--stat-color': 'var(--red)' }}><XCircle size={16} /></div>
            <div><div className="admin-stat-n">{stats.indisponibles}</div><div className="admin-stat-l">Indisponibles</div></div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ '--stat-color': 'var(--blue)' }}><BadgeCheck size={16} /></div>
            <div><div className="admin-stat-n">{stats.verifiees}/{stats.total}</div><div className="admin-stat-l">Infos vérifiées</div></div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ '--stat-color': 'var(--orange)' }}><MapPinned size={16} /></div>
            <div><div className="admin-stat-n">{adminZone ? 1 : stats.zones}</div><div className="admin-stat-l">{adminZone ? 'Votre zone' : 'Zones couvertes'}</div></div>
          </div>
        </div>

        {!adminZone && (
          <div className="admin-zone-tabs">
            <button className={zoneFilter === 'all' ? 'active' : ''} onClick={() => setZoneFilter('all')}>Toutes les zones</button>
            {ZONES.map((z) => (
              <button key={z.id} className={zoneFilter === z.id ? 'active' : ''} onClick={() => setZoneFilter(z.id)}>{z.nom}</button>
            ))}
          </div>
        )}
      </div>

      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-search-input">
        <Search size={15} color="#8a93a6" />
        <input
          type="text"
          placeholder="Rechercher une agence (nom, quartier)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {editing && (
        <Modal title={editing.id ? "Modifier l'agence" : 'Nouvelle agence'} onClose={() => { setEditing(null); setError(''); }}>
          <AdminAgencyForm
            initial={editing.id ? editing : null}
            saving={createMut.isPending || updateMut.isPending}
            onCancel={() => { setEditing(null); setError(''); }}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Quartier</th>
              <th>Zone</th>
              <th>Type</th>
              <th>Disponibilité</th>
              <th>Infos vérifiées</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>Chargement…</td></tr>
            ) : !visible.length ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>Aucune agence</td></tr>
            ) : (
              visible.map((a) => (
                <tr key={a.id}>
                  <td data-label="Nom" style={{ fontWeight: 700, color: 'var(--t1)' }}>
                    <Building2 size={13} style={{ verticalAlign: '-2px', marginRight: 6, color: 'var(--orange)' }} />
                    {a.nom}
                  </td>
                  <td data-label="Quartier">{a.quartier}</td>
                  <td data-label="Zone"><ZoneBadge zone={a.zone} fallback="—" /></td>
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
                  <td data-label="Infos vérifiées">
                    {a.verifie && adminZone ? (
                      // Un chef d'agence ne peut plus annuler une fois confirmé.
                      <span className="status-toggle verify" style={{ cursor: 'default', opacity: .85 }} title="Confirmée — ne peut plus être annulée">
                        <BadgeCheck size={12} /> Vérifiée
                      </span>
                    ) : (
                      <button
                        className={`status-toggle verify${a.verifie ? '' : ' off'}`}
                        onClick={() => (a.verifie ? toggleVerifieMut.mutate({ id: a.id, verifie: false }) : setVerifyConfirm(a))}
                        disabled={toggleVerifieMut.isPending}
                        title={a.verifie ? 'Marquer comme non vérifiée' : 'Confirmer les informations de cette agence'}
                      >
                        <BadgeCheck size={12} />
                        {a.verifie ? 'Vérifiée' : 'Confirmer'}
                      </button>
                    )}
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

      <AdminSelfAccountPanel />
      {!adminZone && <AdminUsersPanel />}

      {verifyConfirm && (
        <Modal title="Confirmer les informations" onClose={() => setVerifyConfirm(null)}>
          <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, margin: '0 0 8px' }}>
            Confirmer que les informations de <strong style={{ color: 'var(--t1)' }}>{verifyConfirm.nom}</strong> sont exactes et à jour ?
          </p>
          {adminZone && (
            <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700, margin: '0 0 20px' }}>
              Cette action est définitive — vous ne pourrez plus l'annuler ensuite.
            </p>
          )}
          <div className="admin-form-actions">
            <button
              type="button"
              className="btn btn-orange"
              disabled={toggleVerifieMut.isPending}
              onClick={() => toggleVerifieMut.mutate({ id: verifyConfirm.id, verifie: true })}
            >
              {toggleVerifieMut.isPending ? 'Confirmation…' : 'Oui, confirmer'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setVerifyConfirm(null)}>
              Annuler
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

export default AdminPage;
