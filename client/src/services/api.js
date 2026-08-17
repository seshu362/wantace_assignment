const API_BASE = '/api';

/**
 * Fetch dynamic configuration for public estimator.
 * ZERO hardcoded questions/rates in client!
 */
export async function fetchPublicConfig() {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) {
    throw new Error(`Failed to load configuration (${res.status})`);
  }
  return await res.json();
}

/**
 * Submit lead details and answers to receive calculation from backend.
 */
export async function submitEstimate(payload) {
  const res = await fetch(`${API_BASE}/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.details?.join(', ') || 'Failed to calculate estimate');
  }
  return data;
}

/**
 * Authenticate owner/admin.
 */
export async function loginAdmin({ username, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }
  return data;
}

/**
 * Fetch admin config with options & rates for editing.
 */
export async function fetchAdminConfig(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/admin/config`, { headers });
  if (!res.ok) {
    throw new Error('Failed to load admin configuration');
  }
  return await res.json();
}

/**
 * Update rates, labels, and toggles in DB without code redeploy.
 */
export async function updateAdminConfig(configData, token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_BASE}/admin/config`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(configData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update configuration');
  }
  return data;
}

/**
 * Fetch captured leads list for Owner Panel table.
 */
export async function fetchAdminLeads(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/admin/leads`, { headers });
  if (!res.ok) {
    throw new Error('Failed to load customer leads');
  }
  return await res.json();
}
