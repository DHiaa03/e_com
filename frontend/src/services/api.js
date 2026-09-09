const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('be_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If body is FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errData = await response.json();
      errorDetail = errData.detail || JSON.stringify(errData);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Public Store Endpoints
  getCategories: (rootOnly = true) => request(`/categories?root_only=${rootOnly}`),
  getCategory: (idOrSlug) => request(`/categories/${idOrSlug}`),
  
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/products?${query.toString()}`);
  },

  getProduct: (idOrSlug) => request(`/products/${idOrSlug}`),

  // Guest Checkout Order
  createOrder: (orderData) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  getOrder: (idOrNumber) => request(`/orders/${idOrNumber}`),

  // Admin Endpoints
  loginAdmin: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  getAdminProfile: () => request('/auth/me'),

  getAdminStats: () => request('/orders/stats/summary'),

  getAdminOrders: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/orders?${query.toString()}`);
  },

  updateOrderStatus: (orderId, status) => request(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  createProduct: (data) => request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateProduct: (id, data) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteProduct: (id) => request(`/products/${id}`, {
    method: 'DELETE',
  }),

  uploadProductImage: (productId, formData) => request(`/images/products/${productId}`, {
    method: 'POST',
    body: formData,
  }),

  createCategory: (data) => request('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  deleteCategory: (id) => request(`/categories/${id}`, {
    method: 'DELETE',
  }),
};
