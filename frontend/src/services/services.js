import api from './api';

export async function fetchAgences({ lat, lng, q } = {}) {
  const { data } = await api.get('/agences', { params: { lat, lng, q } });
  return data.data;
}

export async function fetchAgenceById(id) {
  const { data } = await api.get(`/agences/${id}`);
  return data.data;
}

export async function fetchAgencesStats() {
  const { data } = await api.get('/agences/stats');
  return data.data;
}

export async function createAgence(payload) {
  const { data } = await api.post('/agences', payload);
  return data.data;
}

export async function updateAgence(id, payload) {
  const { data } = await api.put(`/agences/${id}`, payload);
  return data.data;
}

export async function deleteAgence(id) {
  await api.delete(`/agences/${id}`);
}

export async function toggleAgenceDisponible(id, disponible) {
  const { data } = await api.patch(`/agences/${id}/disponible`, { disponible });
  return data.data;
}

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data.data;
}

export async function fetchAdmins() {
  const { data } = await api.get('/admins');
  return data.data;
}

export async function createAdmin(payload) {
  const { data } = await api.post('/admins', payload);
  return data.data;
}

export async function deleteAdmin(id) {
  await api.delete(`/admins/${id}`);
}
