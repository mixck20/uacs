export function getAuthToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(path, { ...options, headers });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const PatientsAPI = {
  list: (q) => apiFetch(`/api/patients${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  create: (payload) => apiFetch('/api/patients', { method: 'POST', body: JSON.stringify(payload) }),
};

export const InventoryAPI = {
  list: (lowStock) => apiFetch(`/api/inventory${lowStock ? `?lowStock=1` : ''}`),
  create: (payload) => apiFetch('/api/inventory', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => apiFetch(`/api/inventory/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};

export const AppointmentsAPI = {
  list: () => apiFetch('/api/appointments'),
  update: (id, payload) => apiFetch(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};






