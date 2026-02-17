// ==================== API HELPER ====================
const api = {
  post: (url, body) => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(body)
  }).then(r => r.json()),

  postForm: (url, formData) => fetch(url, {
    method: 'POST', credentials: 'include', body: formData
  }).then(r => r.json()),

  put: (url, body) => fetch(url, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(body)
  }).then(r => r.json()),

  get: (url) => fetch(url, { credentials: 'include' }).then(r => r.json()),

  del: (url) => fetch(url, { method: 'DELETE', credentials: 'include' }).then(r => r.json())
};

// ==================== FLASH MESSAGES ====================
function showAlert(message, type = 'error', containerId = 'alert-box') {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => box.innerHTML = '', 4000);
}

// ==================== LOGOUT ====================
function logout(role) {
  api.post(`/api/${role}/logout`, {}).then(() => {
    window.location.href = '/pages/index.html';
  });
}

// ==================== ORDER STATUS BADGE ====================
function statusBadge(status) {
  const map = {
    'Received':           'badge-blue',
    'Ready for Shipping': 'badge-yellow',
    'Out for Delivery':   'badge-yellow',
    'Delivered':          'badge-green'
  };
  return `<span class="badge ${map[status] || 'badge-blue'}">${status}</span>`;
}

// ==================== FORMAT PRICE ====================
function fmt(n) { return `Rs/${Number(n).toLocaleString('en-IN')}/-`; }

// ==================== SESSION CHECK ====================
async function requireSession(role) {
  // Pages call this; if session missing, redirect to login
  try {
    const res = await api.get(`/api/${role}/products`);
    if (res.message === 'Unauthorized. Please log in.') {
      window.location.href = `/${role}-login.html`;
    }
  } catch (e) { /* network error */ }
}
