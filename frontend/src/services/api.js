/**
 * Single API client for the BLACK ELEGANCE backend.
 * Every path here exists in the contract exposed by the FastAPI app
 * (routers/auth, users, categories, products, images, orders) under /api/v1.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const PREFIX = '/api/v1';
const TOKEN_KEY = 'be_admin_token';

export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (value) => localStorage.setItem(TOKEN_KEY, value),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/** Turn a stored media path from the API into a URL the browser can load. */
export function mediaUrl(path, fallback = '/assets/logo.png') {
  if (!path) return fallback;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  if (path.startsWith('/static/')) return `${API_BASE}${path}`;
  return path;
}

/** Human readable message from a FastAPI error body (detail is string or list). */
function readDetail(payload, status) {
  const detail = payload?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : '';
        return field ? `${field}: ${item.msg}` : item?.msg || 'Invalid value';
      })
      .join('، ');
  }
  if (status === 401) return 'Incorrect email or password.';
  if (status === 403) return 'This action is not allowed.';
  if (status === 404) return 'Not found.';
  return `Request failed (${status}).`;
}

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function query(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.append(key, value);
  });
  const text = search.toString();
  return text ? `?${text}` : '';
}

async function request(path, options = {}) {
  const { method = 'GET', body, auth = false, signal } = options;
  const headers = {};
  let payload;

  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (auth) {
    const current = token.get();
    if (current) headers.Authorization = `Bearer ${current}`;
    else throw new ApiError('Sign in to continue.', 401);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${PREFIX}${path}`, { method, headers, body: payload, signal });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ApiError('No connection to the store server.', 0);
  }

  if (response.status === 204) return null;

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (auth && (response.status === 401 || response.status === 403)) token.clear();
    throw new ApiError(readDetail(data, response.status), response.status, data);
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: { email, password } }),
    me: (options = {}) => request('/auth/me', { auth: true, ...options }),
  },

  admin: {
    profile: (options = {}) => request('/users/admin', { auth: true, ...options }),
    changePassword: (oldPassword, newPassword) =>
      request('/users/admin/password', {
        method: 'PUT',
        auth: true,
        body: { old_password: oldPassword, new_password: newPassword },
      }),
  },

  categories: {
    list: (rootOnly = true, options = {}) =>
      request(`/categories${query({ root_only: rootOnly })}`, options),
    get: (idOrSlug, options = {}) => request(`/categories/${idOrSlug}`, options),
    create: (data) => request('/categories', { method: 'POST', auth: true, body: data }),
    update: (id, data) => request(`/categories/${id}`, { method: 'PUT', auth: true, body: data }),
    remove: (id) => request(`/categories/${id}`, { method: 'DELETE', auth: true }),
  },

  products: {
    list: (params = {}, options = {}) => request(`/products${query(params)}`, options),
    get: (idOrSlug, options = {}) => request(`/products/${idOrSlug}`, options),
    create: (data) => request('/products', { method: 'POST', auth: true, body: data }),
    update: (id, data) => request(`/products/${id}`, { method: 'PUT', auth: true, body: data }),
    remove: (id) => request(`/products/${id}`, { method: 'DELETE', auth: true }),
    addVariant: (productId, data) =>
      request(`/products/${productId}/variants`, { method: 'POST', auth: true, body: data }),
    updateVariant: (variantId, data) =>
      request(`/products/variants/${variantId}`, { method: 'PUT', auth: true, body: data }),
    removeVariant: (variantId) =>
      request(`/products/variants/${variantId}`, { method: 'DELETE', auth: true }),
  },

  images: {
    upload: (productId, formData) =>
      request(`/images/products/${productId}`, { method: 'POST', auth: true, body: formData }),
    remove: (imageId) => request(`/images/${imageId}`, { method: 'DELETE', auth: true }),
  },

  orders: {
    create: (order) => request('/orders', { method: 'POST', body: order }),
    list: (params = {}, options = {}) => request(`/orders${query(params)}`, { auth: true, ...options }),
    get: (idOrNumber, options = {}) => request(`/orders/${idOrNumber}`, options),
    updateStatus: (orderId, status) =>
      request(`/orders/${orderId}/status`, { method: 'PATCH', auth: true, body: { status } }),
    stats: (options = {}) => request('/orders/stats/summary', { auth: true, ...options }),
  },
};

export default api;
