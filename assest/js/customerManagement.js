document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg) {
    if (!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveToStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function seedCustomers() {
    return [
      { id: 1, name: 'សុខា', phone: '012 345 678', email: 'sokha@gmail.com', address: 'Phnom Penh', orders: 3, spent: 86.00, active: true },
      { id: 2, name: 'ដារា', phone: '098 765 432', email: 'dara@gmail.com', address: 'Siem Reap', orders: 2, spent: 100.00, active: true },
      { id: 3, name: 'ស្រីនាង', phone: '070 123 456', email: 'sreyneang@gmail.com', address: 'Battambang', orders: 4, spent: 143.50, active: true },
      { id: 4, name: 'វិសាល', phone: '011 222 333', email: 'visal@gmail.com', address: 'Phnom Penh', orders: 2, spent: 50.50, active: true },
      { id: 5, name: 'ចាន់ថា', phone: '086 555 999', email: 'chantha@gmail.com', address: 'Kandal', orders: 1, spent: 32.00, active: false },
      { id: 6, name: 'មាលី', phone: '077 888 111', email: 'malis@gmail.com', address: 'Phnom Penh', orders: 5, spent: 210.00, active: true },
      { id: 7, name: 'ពិសិដ្ឋ', phone: '093 444 222', email: 'piseth@gmail.com', address: 'Kampong Cham', orders: 3, spent: 75.50, active: true },
      { id: 8, name: 'រតនា', phone: '015 666 777', email: 'reatana@gmail.com', address: 'Phnom Penh', orders: 6, spent: 320.00, active: true },
      { id: 9, name: 'សុភា', phone: '096 333 555', email: 'sophea@gmail.com', address: 'Siem Reap', orders: 2, spent: 95.00, active: false },
      { id: 10, name: 'វណ្ណា', phone: '069 111 999', email: 'vanna@gmail.com', address: 'Phnom Penh', orders: 4, spent: 180.50, active: true },
      { id: 11, name: 'Walk-in', phone: '-', email: '', address: '', orders: 12, spent: 480.50, active: true },
    ];
  }

  const statusColors = {
    Active: 'bg-success-subtle text-success',
    Inactive: 'bg-secondary-subtle text-secondary'
  };

  let customers = loadFromStorage('customers', null);
  if (!customers) {
    customers = seedCustomers();
    saveToStorage('customers', customers);
  }
  let nextId = Math.max(0, ...customers.map(c => c.id)) + 1;

  const tbody = document.getElementById('customerTableBody');
  const searchInput = document.getElementById('customerSearch');
  const statusFilter = document.getElementById('customerStatusFilter');

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  function renderKpis() {
    document.getElementById('kpiTotal').textContent = customers.length;
    document.getElementById('kpiActive').textContent = customers.filter(c => c.active).length;
    document.getElementById('kpiOrders').textContent = customers.reduce((sum, c) => sum + (c.orders || 0), 0);
    const revenue = customers.reduce((sum, c) => sum + (c.spent || 0), 0);
    document.getElementById('kpiRevenue').textContent = `$${revenue.toFixed(2)}`;
  }

  function renderTable() {
    renderKpis();
    const q = (searchInput.value || '').trim().toLowerCase();
    const statusQ = statusFilter.value;

    const filtered = customers.filter(c => {
      if (q && !(c.name.toLowerCase().includes(q) || (c.phone || '').includes(q) || (c.email || '').toLowerCase().includes(q))) return false;
      if (statusQ === 'Active' && !c.active) return false;
      if (statusQ === 'Inactive' && c.active) return false;
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-secondary py-4">No customers found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => {
      const badge = statusColors[c.active ? 'Active' : 'Inactive'];
      const avatar = `<div style="width:32px;height:32px;border-radius:50%;background:#e7efeb;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#1f4d43;">${initials(c.name)}</div>`;
      return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            ${avatar}
            <span class="fw-semibold">${c.name}</span>
          </div>
        </td>
        <td>${c.phone || '-'}</td>
        <td>${c.email || '-'}</td>
        <td>${c.orders}</td>
        <td>$${c.spent.toFixed(2)}</td>
        <td><span class="badge rounded-pill ${badge}">${c.active ? 'Active' : 'Inactive'}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-light border rounded-2 me-1 edit-customer" data-id="${c.id}"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-light border rounded-2 delete-customer" data-id="${c.id}"><i class="bi bi-trash text-danger"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  searchInput.addEventListener('input', renderTable);
  statusFilter.addEventListener('change', renderTable);

  // ---- Add / Edit modal ----
  const customerModalEl = document.getElementById('customerModal');
  const customerModal = new bootstrap.Modal(customerModalEl);
  const modalTitle = document.getElementById('customerModalTitle');
  const idInput = document.getElementById('customerId');
  const nameInput = document.getElementById('customerName');
  const phoneInput = document.getElementById('customerPhone');
  const emailInput = document.getElementById('customerEmail');
  const addressInput = document.getElementById('customerAddress');
  const activeInput = document.getElementById('customerActive');

  document.getElementById('addCustomerBtn').addEventListener('click', () => {
    modalTitle.textContent = 'Add Customer';
    idInput.value = '';
    nameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    addressInput.value = '';
    activeInput.checked = true;
  });

  tbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-customer');
    const delBtn = e.target.closest('.delete-customer');

    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const c = customers.find(x => x.id === id);
      if (!c) return;
      modalTitle.textContent = 'Edit Customer';
      idInput.value = c.id;
      nameInput.value = c.name;
      phoneInput.value = c.phone;
      emailInput.value = c.email;
      addressInput.value = c.address;
      activeInput.checked = !!c.active;
      customerModal.show();
    }

    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      customers = customers.filter(x => x.id !== id);
      saveToStorage('customers', customers);
      renderTable();
      notify('Customer deleted');
    }
  });

  document.getElementById('saveCustomerBtn').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) { notify('Please enter a customer name'); return; }

    const id = idInput.value ? Number(idInput.value) : nextId++;
    const idx = customers.findIndex(c => c.id === id);
    const record = {
      id,
      name,
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      address: addressInput.value.trim(),
      orders: idx >= 0 ? customers[idx].orders : 0,
      spent: idx >= 0 ? customers[idx].spent : 0,
      active: activeInput.checked
    };

    if (idx >= 0) {
      customers[idx] = record;
    } else {
      customers.push(record);
    }

    saveToStorage('customers', customers);
    customerModal.hide();
    renderTable();
    notify('Customer saved');
  });

  renderTable();
});
