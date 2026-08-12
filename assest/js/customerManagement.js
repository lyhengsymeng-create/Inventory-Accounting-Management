document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg) {
    if (!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

  function seedCustomers() {
    // Fixed data kept directly in this file (no localStorage) — kept identical to the
    // Staff Panel's customer list (assest/js/phearoun.js) so both pages show the same customers.
    return [
      { id: 1, name: 'រឹម​ ភារុន', phone: '096 555 123', email: 'roun@mail.com', password: 'roun123', address: 'ភ្នំពេញ', orders: 5, spent: 210.00, active: true },
      { id: 2, name: 'វ៉ែត សុជាតិ', phone: '012 888 999', email: 'cheak@mail.com', password: 'cheak123', address: 'សៀមរាប', orders: 2, spent: 68.00, active: true },
      { id: 3, name: 'ចាន់​ សារ៉ាក់', phone: '088 777 666', email: 'rak@mail.com', password: 'rak123', address: 'បាត់ដំបង', orders: 0, spent: 0, active: true },
      { id: 4, name: 'លីហេង ស៊ីម៉េង', phone: '088 777 666', email: 'meng@mail.com', password: 'meng123', address: 'បាត់ដំបង', orders: 3, spent: 95.50, active: true },
      { id: 5, name: 'វិទូ', phone: '088 777 888', email: 'tu@mail.com', password: 'tu123', address: 'ភ្នំពេញ', orders: 3, spent: 95.50, active: true },
      { id: 6, name: 'រឹម​ វីរះ', phone: '088 777 999', email: 'vireak@mail.com', password: 'vireak123', address: 'ភ្នំពេញ', orders: 3, spent: 95.50, active: true },
      { id: 7, name: 'មករា', phone: '088 777 111', email: 'makera@mail.com', password: 'makera123', address: 'ភ្នំពេញ', orders: 3, spent: 95.50, active: true },
      { id: 8, name: 'ចាន់ មិនា', phone: '088 777 222', email: 'mine@mail.com', password: 'mine123', address: 'ភ្នំពេញ', orders: 3, spent: 95.50, active: true },
      { id: 9, name: 'សុ​ ផល', phone: '088 777 444', email: 'pol@mail.com', password: 'pol123', address: 'ភ្នំពេញ', orders: 3, spent: 95.50, active: true },
    ];
  }

  const statusColors = {
    Active: 'bg-success-subtle text-success',
    Inactive: 'bg-secondary-subtle text-secondary'
  };

  let customers = seedCustomers();
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
          <div class="d-flex justify-content-end gap-1 flex-nowrap">
            <button class="btn btn-sm btn-light border rounded-3 view-customer" data-id="${c.id}" title="View"><i class="bi bi-eye"></i></button>
            <button class="btn btn-sm btn-light border rounded-3 edit-customer" data-id="${c.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger delete-customer" data-id="${c.id}" title="Delete"><i class="bi bi-trash"></i></button>
          </div>
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
  const passwordInput = document.getElementById('customerPassword');
  const addressInput = document.getElementById('customerAddress');
  const activeInput = document.getElementById('customerActive');

  document.getElementById('addCustomerBtn').addEventListener('click', () => {
    modalTitle.textContent = 'Add Customer';
    idInput.value = '';
    nameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    passwordInput.placeholder = 'ពាក្យសម្ងាត់ចូលប្រើសម្រាប់អតិថិជនថ្មី';
    addressInput.value = '';
    activeInput.checked = true;
  });

  // ---- View modal ----
  const viewCustomerModalEl = document.getElementById('viewCustomerModal');
  const viewCustomerModal = new bootstrap.Modal(viewCustomerModalEl);
  const viewPasswordEl = document.getElementById('viewCustPassword');
  const togglePasswordBtn = document.getElementById('toggleViewPasswordBtn');
  let viewPasswordVisible = false;
  let viewPasswordRaw = '';

  togglePasswordBtn.addEventListener('click', () => {
    viewPasswordVisible = !viewPasswordVisible;
    viewPasswordEl.textContent = viewPasswordVisible ? (viewPasswordRaw || '(not set)') : '••••••••';
    togglePasswordBtn.innerHTML = viewPasswordVisible ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
  });

  // ---- Delete confirm modal ----
  const deleteCustomerModalEl = document.getElementById('deleteCustomerModal');
  const deleteCustomerModal = new bootstrap.Modal(deleteCustomerModalEl);
  const deleteCustNameEl = document.getElementById('deleteCustName');
  let pendingDeleteId = null;

  tbody.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-customer');
    const editBtn = e.target.closest('.edit-customer');
    const delBtn = e.target.closest('.delete-customer');

    if (viewBtn) {
      const id = Number(viewBtn.dataset.id);
      const c = customers.find(x => x.id === id);
      if (!c) return;
      document.getElementById('viewCustAvatar').textContent = initials(c.name);
      document.getElementById('viewCustName').textContent = c.name;
      const badge = statusColors[c.active ? 'Active' : 'Inactive'];
      const statusBadgeEl = document.getElementById('viewCustStatus');
      statusBadgeEl.className = 'badge rounded-pill ' + badge;
      statusBadgeEl.textContent = c.active ? 'Active' : 'Inactive';
      document.getElementById('viewCustPhone').textContent = c.phone || '-';
      document.getElementById('viewCustEmail').textContent = c.email || '-';
      document.getElementById('viewCustAddress').textContent = c.address || '-';
      document.getElementById('viewCustOrders').textContent = c.orders;
      document.getElementById('viewCustSpent').textContent = '$' + c.spent.toFixed(2);

      viewPasswordRaw = c.password || '';
      viewPasswordVisible = false;
      viewPasswordEl.textContent = '••••••••';
      togglePasswordBtn.innerHTML = '<i class="bi bi-eye"></i>';

      viewCustomerModal.show();
    }

    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const c = customers.find(x => x.id === id);
      if (!c) return;
      modalTitle.textContent = 'Edit Customer';
      idInput.value = c.id;
      nameInput.value = c.name;
      phoneInput.value = c.phone;
      emailInput.value = c.email;
      passwordInput.value = '';
      passwordInput.placeholder = 'ទុកទទេ = មិនផ្លាស់ប្តូរ (ពាក្យសម្ងាត់បច្ចុប្បន្នរក្សាដដែល)';
      addressInput.value = c.address;
      activeInput.checked = !!c.active;
      customerModal.show();
    }

    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      const c = customers.find(x => x.id === id);
      if (!c) return;
      pendingDeleteId = id;
      deleteCustNameEl.textContent = c.name;
      deleteCustomerModal.show();
    }
  });

  document.getElementById('confirmDeleteCustomerBtn').addEventListener('click', () => {
    if (pendingDeleteId === null) return;
    customers = customers.filter(x => x.id !== pendingDeleteId);
    renderTable();
    notify('Customer deleted');
    pendingDeleteId = null;
  });

  document.getElementById('saveCustomerBtn').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) { notify('Please enter a customer name'); return; }

    const email = emailInput.value.trim();
    if (!email) { notify('Please enter an email — used for customer login'); return; }

    const id = idInput.value ? Number(idInput.value) : nextId++;
    const idx = customers.findIndex(c => c.id === id);
    const enteredPassword = passwordInput.value.trim();
    const password = enteredPassword
      ? enteredPassword
      : (idx >= 0 ? customers[idx].password : '');

    if (idx < 0 && !password) { notify('Please set a login password for this new customer'); return; }

    const record = {
      id,
      name,
      phone: phoneInput.value.trim(),
      email,
      password,
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

    customerModal.hide();
    renderTable();
    notify('Customer saved');
  });

  renderTable();
});
