document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg) {
    if (!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

  const roleColors = {
    Admin: 'bg-danger-subtle text-danger',
    Manager: 'bg-warning-subtle text-warning',
    Cashier: 'bg-success-subtle text-success',
    'Stock Clerk': 'bg-secondary-subtle text-secondary'
  };

  let staff = [
    { id: 1, name: 'Veth Socheat',        phone: '012 345 678', role: 'Admin',     active: true , image: '/assest/image/DSC_1535 copy.jpg',
      email: 'socheat.veth@iam.com', department: 'Management', joinDate: '2022-03-14', lastLogin: '2026-07-25 08:12',
      manages: 7, modules: ['Employees', 'Products', 'Inventory', 'Sales', 'Purchases', 'Accounting', 'Reports'],
      history: [
        { action: 'Logged in', time: '2026-07-25 08:12' },
        { action: 'Approved sale #SL-2291', time: '2026-07-24 16:40' },
        { action: 'Added new staff: Sok Pisey', time: '2026-07-20 10:05' },
        { action: 'Updated product price list', time: '2026-07-18 09:30' },
      ] },
    { id: 2, name: 'Rim Phearoun', phone: '096 555 210', role: 'Admin', active: true , image: '/assest/image/phearoun_image.jpg',
      email: 'phearoun.rim@iam.com', department: 'Management', joinDate: '2022-06-02', lastLogin: '2026-07-25 07:55',
      manages: 7, modules: ['Employees', 'Sales', 'Purchases', 'Reports'],
      history: [
        { action: 'Logged in', time: '2026-07-25 07:55' },
        { action: 'Disabled account: Lyheng Symeny', time: '2026-07-22 14:12' },
        { action: 'Generated monthly report', time: '2026-07-01 09:00' },
      ] },
    { id: 3, name: 'Vet Chansarak', phone: '077 888 001', role: 'Staff', active: true , image: '/assest/image/DSC_1541 copy.jpg',
      email: 'chansarak.vet@iam.com', department: 'Sales Floor', joinDate: '2023-01-10', lastLogin: '2026-07-25 09:02',
      position: 'Cashier', supervisor: 'Veth Socheat', shift: 'Morning (7am - 3pm)', salesCount: 42, attendance: '96%',
      history: [
        { action: 'Logged in', time: '2026-07-25 09:02' },
        { action: 'Processed sale #SL-2305', time: '2026-07-25 09:20' },
        { action: 'Clocked out', time: '2026-07-24 18:00' },
      ] },
    { id: 4, name: 'Lyheng Symeny', phone: '070 222 456', role: 'Staff', active: false , image: '/assest/image/meng_image.jpg',
      email: 'symeny.lyheng@iam.com', department: 'Stock Room', joinDate: '2023-05-22', lastLogin: '2026-07-21 08:30',
      position: 'Stock Clerk', supervisor: 'Rim Phearoun', shift: 'Evening (2pm - 10pm)', salesCount: 0, attendance: '71%',
      history: [
        { action: 'Account disabled by Admin', time: '2026-07-22 14:12' },
        { action: 'Logged in', time: '2026-07-21 08:30' },
      ] },
    { id: 5, name: 'Sok Pisey', phone: '012 909 333', role: 'Staff', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXKt6OpGc7iHjVJSEUr9pV7EyG821ENIwipSvKStOVTQ&s=10',
      email: 'pisey.sok@iam.com', department: 'Sales Floor', joinDate: '2024-02-01', lastLogin: '2026-07-25 08:45',
      position: 'Cashier', supervisor: 'Veth Socheat', shift: 'Morning (7am - 3pm)', salesCount: 35, attendance: '99%',
      history: [
        { action: 'Logged in', time: '2026-07-25 08:45' },
        { action: 'Processed sale #SL-2299', time: '2026-07-24 13:10' },
      ] },
    { id: 6, name: 'Sok Dara', phone: '016 700 990', role: 'Staff', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP66xZe_6NzZqJBWm79x8S2MHyt4QklAK-9-jQ-IRAFw&s=10',
      email: 'dara.sok@iam.com', department: 'Stock Room', joinDate: '2023-09-18', lastLogin: '2026-07-25 08:50',
      position: 'Stock Clerk', supervisor: 'Rim Phearoun', shift: 'Morning (7am - 3pm)', salesCount: 0, attendance: '94%',
      history: [
        { action: 'Logged in', time: '2026-07-25 08:50' },
        { action: 'Received inventory shipment', time: '2026-07-23 11:00' },
      ] },
    { id: 7, name: 'Sopheak', phone: '010 90 88 57', role: 'Staff', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxEug8Ah6v72E2hoe23E2t5awqBYfr80J9f3La5y0QSg&s=10',
      email: 'sopheak@iam.com', department: 'Sales Floor', joinDate: '2024-08-05', lastLogin: '2026-07-25 07:40',
      position: 'Cashier', supervisor: 'Rim Phearoun', shift: 'Evening (2pm - 10pm)', salesCount: 18, attendance: '88%',
      history: [
        { action: 'Logged in', time: '2026-07-25 07:40' },
        { action: 'Processed sale #SL-2280', time: '2026-07-19 15:22' },
      ] },
    { id: 8, name: 'Heng Sylong', phone: '096 97 777 254', role: 'Staff', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5gR8rxs27HynIOIU9zUAwqEZdJ8ktrvK22xDCiUj59Q&s=10',
      email: 'sylong.heng@iam.com', department: 'Sales Floor', joinDate: '2024-11-12', lastLogin: '2026-07-25 08:05',
      position: 'Cashier', supervisor: 'Veth Socheat', shift: 'Morning (7am - 3pm)', salesCount: 27, attendance: '92%',
      history: [
        { action: 'Logged in', time: '2026-07-25 08:05' },
        { action: 'Updated own phone number', time: '2026-07-15 12:00' },
      ] },
  ];
  let nextId = staff.length + 1;

  const tbody = document.getElementById('staffTableBody');
  const searchInput = document.getElementById('staffSearch');

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  function renderKpis() {
    const total = staff.length;
    const active = staff.filter(s => s.active).length;
    const inactive = total - active;
    const admins = staff.filter(s => s.role === 'Admin' || s.role === 'Manager').length;
    document.getElementById('kpiTotal').textContent = total;
    document.getElementById('kpiActive').textContent = active;
    document.getElementById('kpiInactive').textContent = inactive;
    document.getElementById('kpiAdmins').textContent = admins;
  }

  function renderTable() {
    const query = (searchInput.value || '').trim().toLowerCase();
    const rows = staff.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      (s.image || '').toLowerCase().includes(query)
    );

    tbody.innerHTML = '';
    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-4">No staff found</td></tr>`;
      return;
    }

    rows.forEach(s => {
      const tr = document.createElement('tr');
      const roleClass = roleColors[s.role] || 'bg-secondary-subtle text-secondary';
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-circle d-flex align-items-center justify-content-center">
  ${s.image
          ? `<img src="${s.image}" 
          class="rounded-circle w-100 h-100"
          style="object-fit:cover; object-position:top center;">`
          : initials(s.name)
        }
</div>
<div class="fw-semibold small">${s.name}</div>
          </div>
        </td>
        <td><span class="badge rounded-pill ${roleClass}">${s.role}</span></td>
        <td class="small text-secondary">${s.phone}</td>
        <td>
          <span class="badge rounded-pill ${s.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
            ${s.active ? 'Active' : 'Disabled'}
          </span>
        </td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-sm btn-light border rounded-3" data-action="view" data-id="${s.id}" title="View Profile"><i class="bi bi-eye-fill"></i></button>
            <button class="btn btn-sm btn-light border rounded-3" data-action="edit" data-id="${s.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-light border rounded-3" data-action="reset" data-id="${s.id}" title="Reset Password"><i class="bi bi-key-fill"></i></button>
            <button class="btn btn-sm btn-light border rounded-3" data-action="toggle" data-id="${s.id}" title="${s.active ? 'Disable' : 'Enable'}">
              <i class="bi ${s.active ? 'bi-toggle-on text-success' : 'bi-toggle-off text-secondary'}"></i>
            </button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="delete" data-id="${s.id}" title="Delete"><i class="bi bi-trash-fill"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAll() {
    renderKpis();
    renderTable();
  }

  searchInput.addEventListener('input', renderTable);

  /* ---------------- Add / Edit modal ---------------- */
  const staffModalEl = document.getElementById('staffModal');
  const staffModal = new bootstrap.Modal(staffModalEl);
  const staffForm = document.getElementById('staffForm');
  const staffModalTitle = document.getElementById('staffModalTitle');
  const addStaffBtn = document.getElementById('addStaffBtn');

  addStaffBtn.addEventListener('click', () => {
    staffModalTitle.textContent = 'Add Staff';
    staffForm.reset();
    document.getElementById('staffId').value = '';
    document.getElementById('staffActive').checked = true;
  });

  document.getElementById('saveStaffBtn').addEventListener('click', () => {
    if (!staffForm.reportValidity()) return;

    const id = document.getElementById('staffId').value;
    const name = document.getElementById('staffName').value.trim();
    const phone = document.getElementById('staffPhone').value.trim();
    const role = document.getElementById('staffRole').value;
    const active = document.getElementById('staffActive').checked;

    if (id) {
      const s = staff.find(x => x.id === Number(id));
      if (s) { Object.assign(s, { name, phone, role, active }); }
      notify('Staff updated');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      staff.push({
        id: nextId++, name, phone, role, active, image: '',
        email: '', department: isAdminRole(role) ? 'Management' : 'Sales Floor',
        joinDate: today, lastLogin: '—',
        manages: 0, modules: [],
        position: role, supervisor: '—', shift: '—', salesCount: 0, attendance: '—',
        history: [{ action: 'Account created', time: today }]
      });
      notify('Staff added');
    }

    staffModal.hide();
    renderAll();
  });

  /* ---------------- View Profile modal ---------------- */
  const profileModalEl = document.getElementById('profileModal');
  const profileModal = new bootstrap.Modal(profileModalEl);

  const isAdminRole = (role) => role === 'Admin' || role === 'Manager';

  function yearsSince(dateStr) {
    if (!dateStr) return '—';
    const start = new Date(dateStr);
    if (isNaN(start)) return '—';
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const m = now.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < start.getDate())) years--;
    return years <= 0 ? '<1' : String(years);
  }

  function bioText(s, admin) {
    const tenure = yearsSince(s.joinDate);
    if (admin) {
      return `${s.name} has served as ${s.role} in the ${s.department || '—'} department since ${s.joinDate || '—'} `
        + `(${tenure} yr${tenure === '1' ? '' : 's'} with the company), overseeing ${s.manages ?? 0} staff members `
        + `and managing access across ${(s.modules || []).length} system module${(s.modules || []).length === 1 ? '' : 's'}.`;
    }
    return `${s.name} works as a ${s.position || s.role} in the ${s.department || '—'} department, reporting to `
      + `${s.supervisor || '—'} on the ${s.shift || '—'} shift. Joined on ${s.joinDate || '—'} `
      + `(${tenure} yr${tenure === '1' ? '' : 's'} with the company), with an attendance record of ${s.attendance || '—'}.`;
  }

  function fieldRow(label, value) {
    return `<div class="d-flex justify-content-between border-bottom py-2">
      <span class="text-secondary small">${label}</span>
      <span class="fw-medium small">${value}</span>
    </div>`;
  }

  function permBadge(text, positive) {
    return `<span class="badge rounded-pill ${positive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} me-1 mb-1">${text}</span>`;
  }

  function openProfile(s) {
    const roleClass = roleColors[s.role] || 'bg-secondary-subtle text-secondary';
    const admin = isAdminRole(s.role);

    // --- Left card ---
    document.getElementById('profileName').textContent = s.name;
    document.getElementById('profilePositionTag').textContent = admin ? s.role : (s.position || s.role);
    document.getElementById('profileDeptLine').textContent = s.department || '—';
    document.getElementById('profilePhone').textContent = s.phone;

    const img = document.getElementById('profileImage');
    const initialsEl = document.getElementById('profileInitials');
    if (s.image) {
      img.src = s.image;
      img.style.display = 'block';
      initialsEl.style.display = 'none';
    } else {
      initialsEl.textContent = initials(s.name);
      initialsEl.style.display = 'flex';
      img.style.display = 'none';
    }

    // Stats row
    if (admin) {
      document.getElementById('statOneVal').textContent = yearsSince(s.joinDate);
      document.getElementById('statOneLabel').textContent = 'Years';
      document.getElementById('statTwoVal').textContent = s.manages ?? 0;
      document.getElementById('statTwoLabel').textContent = 'Manages';
      document.getElementById('statThreeVal').textContent = (s.history || []).length;
      document.getElementById('statThreeLabel').textContent = 'Activities';
    } else {
      document.getElementById('statOneVal').textContent = yearsSince(s.joinDate);
      document.getElementById('statOneLabel').textContent = 'Years';
      document.getElementById('statTwoVal').textContent = s.salesCount ?? 0;
      document.getElementById('statTwoLabel').textContent = 'Sales';
      document.getElementById('statThreeVal').textContent = s.attendance || '—';
      document.getElementById('statThreeLabel').textContent = 'Attendance';
    }

    document.getElementById('profileBio').textContent = bioText(s, admin);

    const accessBadges = document.getElementById('profileAccessBadges');
    if (admin) {
      const modules = s.modules || [];
      accessBadges.innerHTML = modules.length
        ? modules.map(m => `<span class="badge rounded-pill bg-light text-dark border">${m}</span>`).join('')
        : `<span class="text-secondary small">No modules assigned</span>`;
    } else {
      accessBadges.innerHTML = `
        <span class="badge rounded-pill bg-light text-dark border">${s.position || s.role}</span>
        <span class="badge rounded-pill bg-light text-dark border">${s.shift || '—'}</span>
        <span class="badge rounded-pill bg-light text-dark border">Supervisor: ${s.supervisor || '—'}</span>
      `;
    }

    // --- Right column: About tab ---
    document.getElementById('profileFullName').textContent = s.name;
    document.getElementById('profileMobile').textContent = s.phone;
    document.getElementById('profileEmail').textContent = s.email || '—';

    const statusEl = document.getElementById('profileStatus');
    statusEl.textContent = s.active ? 'Active' : 'Disabled';
    statusEl.className = `badge rounded-pill ${s.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`;

    const employmentList = document.getElementById('profileEmploymentList');
    employmentList.innerHTML =
      fieldRow('Staff ID', s.id) +
      fieldRow('Role', `<span class="badge rounded-pill ${roleClass}">${s.role}</span>`) +
      fieldRow('Department', s.department || '—') +
      fieldRow('Join Date', s.joinDate || '—') +
      fieldRow('Last Login', s.lastLogin || '—') +
      (admin ? '' : fieldRow('Supervisor', s.supervisor || '—') + fieldRow('Shift', s.shift || '—'));

    const accessList = document.getElementById('profileAccessList');
    if (admin) {
      accessList.innerHTML =
        permBadge('Full System Access', true) +
        permBadge('Can Manage Staff', true) +
        permBadge('Can Approve Sales', true) +
        permBadge('Can View Reports', true) +
        `<div class="text-secondary small mt-2">Manages ${s.manages ?? 0} staff members across ${(s.modules || []).length} modules.</div>`;
    } else {
      accessList.innerHTML =
        permBadge('Limited System Access', false) +
        permBadge('Can Process Sales', true) +
        `<div class="text-secondary small mt-2">Sales handled this month: ${s.salesCount ?? 0} · Attendance: ${s.attendance || '—'}</div>`;
    }

    // --- Activity tab ---
    const historyEl = document.getElementById('profileHistoryList');
    const history = s.history || [];
    if (history.length === 0) {
      historyEl.innerHTML = `<div class="text-secondary small text-center py-3">No activity recorded</div>`;
    } else {
      historyEl.innerHTML = history.map(h => `
        <div class="d-flex align-items-start gap-2 border rounded-3 p-2">
          <i class="bi bi-dot fs-4 lh-1 ${admin ? 'text-danger' : 'text-secondary'}"></i>
          <div>
            <div class="small fw-medium">${h.action}</div>
            <div class="text-secondary" style="font-size:.72rem;">${h.time}</div>
          </div>
        </div>
      `).join('');
    }

    // reset tabs to default state
    profileModalEl.querySelectorAll('[data-side-tab]').forEach(b => b.classList.toggle('active', b.dataset.sideTab === 'bio'));
    profileModalEl.querySelectorAll('[data-side-pane]').forEach(p => p.classList.toggle('active', p.dataset.sidePane === 'bio'));
    profileModalEl.querySelectorAll('[data-main-tab]').forEach(b => b.classList.toggle('active', b.dataset.mainTab === 'about'));
    profileModalEl.querySelectorAll('[data-main-pane]').forEach(p => p.classList.toggle('active', p.dataset.mainPane === 'about'));

    profileModal.show();
  }

  // Tab switching inside the profile modal
  profileModalEl.addEventListener('click', (e) => {
    const sideBtn = e.target.closest('[data-side-tab]');
    if (sideBtn) {
      profileModalEl.querySelectorAll('[data-side-tab]').forEach(b => b.classList.toggle('active', b === sideBtn));
      profileModalEl.querySelectorAll('[data-side-pane]').forEach(p => p.classList.toggle('active', p.dataset.sidePane === sideBtn.dataset.sideTab));
      return;
    }
    const mainBtn = e.target.closest('[data-main-tab]');
    if (mainBtn) {
      profileModalEl.querySelectorAll('[data-main-tab]').forEach(b => b.classList.toggle('active', b === mainBtn));
      profileModalEl.querySelectorAll('[data-main-pane]').forEach(p => p.classList.toggle('active', p.dataset.mainPane === mainBtn.dataset.mainTab));
    }
  });

  /* ---------------- Row actions ---------------- */
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    const s = staff.find(x => x.id === id);
    if (!s) return;

    if (action === 'view') {
      openProfile(s);

    } else if (action === 'edit') {
      staffModalTitle.textContent = 'Edit Staff';
      document.getElementById('staffId').value = s.id;
      document.getElementById('staffName').value = s.name;
      document.getElementById('staffPhone').value = s.phone;
      document.getElementById('staffRole').value = s.role;
      document.getElementById('staffActive').checked = s.active;
      staffModal.show();

    } else if (action === 'toggle') {
      s.active = !s.active;
      notify(s.active ? `${s.name} enabled` : `${s.name} disabled`);
      renderAll();

    } else if (action === 'reset') {
      if (confirm(`Reset password for ${s.name}?`)) {
        notify(`Password reset for ${s.name}`);
      }

    } else if (action === 'delete') {
      if (confirm(`Delete ${s.name}? This cannot be undone.`)) {
        staff = staff.filter(x => x.id !== id);
        notify(`${s.name} deleted`);
        renderAll();
      }
    }
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => notify('You have 3 new notifications'));
  }

  /* ---------------- Leave Requests (សំណើសុំច្បាប់ពី Staff) ---------------- */
  // សំខាន់៖ key នេះត្រូវដូចគ្នាបេះបិទនឹងអ្វីដែល Staff (phearoun.js) ប្រើ
  // ដើម្បីអានទិន្នន័យសំណើសុំច្បាប់ដូចគ្នា តាមរយៈ localStorage
  const LEAVE_STORAGE_KEY = 'iam_staff_leaveRequests';

  function loadLeaveRequests() {
    try {
      const raw = localStorage.getItem(LEAVE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to read leave requests', e);
      return [];
    }
  }

  function saveLeaveRequests(list) {
    try {
      localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save leave requests', e);
    }
  }

  function leaveStatusBadge(status) {
    if (status === 'បានអនុម័ត') return `<span class="badge bg-success-subtle text-success-emphasis">${status}</span>`;
    if (status === 'បានបដិសេធ') return `<span class="badge bg-danger-subtle text-danger-emphasis">${status}</span>`;
    return `<span class="badge bg-warning-subtle text-warning-emphasis">${status}</span>`;
  }

  function renderLeaveRequestsTable() {
    const tbody = document.getElementById('leaveRequestsTableBody');
    const pendingBadge = document.getElementById('leaveReqPendingBadge');
    if (!tbody) return;

    const list = loadLeaveRequests();
    const pendingCount = list.filter(r => r.status === 'កំពុងរង់ចាំអនុម័ត').length;

    if (pendingBadge) {
      if (pendingCount > 0) {
        pendingBadge.textContent = `${pendingCount} កំពុងរង់ចាំ`;
        pendingBadge.classList.remove('d-none');
      } else {
        pendingBadge.classList.add('d-none');
      }
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">មិនទាន់មានសំណើសុំច្បាប់ទេ</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(r => `
      <tr>
        <td class="fw-semibold">${r.staff || '—'}</td>
        <td>${r.start} → ${r.end}</td>
        <td class="text-secondary" style="max-width:220px;">${r.reason}</td>
        <td>${leaveStatusBadge(r.status)}</td>
        <td class="text-end">
          ${r.status === 'កំពុងរង់ចាំអនុម័ត' ? `
            <button class="btn btn-sm btn-success rounded-3 me-1" data-leave-approve="${r.id}"><i class="bi bi-check-lg"></i> Approve</button>
            <button class="btn btn-sm btn-outline-danger rounded-3" data-leave-reject="${r.id}"><i class="bi bi-x-lg"></i> Reject</button>
          ` : '<span class="text-muted small">—</span>'}
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('leaveRequestsTableBody')?.addEventListener('click', (e) => {
    const approveBtn = e.target.closest('[data-leave-approve]');
    const rejectBtn = e.target.closest('[data-leave-reject]');
    if (!approveBtn && !rejectBtn) return;

    const id = Number((approveBtn || rejectBtn).dataset.leaveApprove || (approveBtn || rejectBtn).dataset.leaveReject);
    const list = loadLeaveRequests();
    const item = list.find(r => r.id === id);
    if (!item) return;

    if (approveBtn) {
      item.status = 'បានអនុម័ត';
      notify(`Leave request for ${item.staff || 'staff'} approved`);
    } else {
      item.status = 'បានបដិសេធ';
      notify(`Leave request for ${item.staff || 'staff'} rejected`);
    }
    saveLeaveRequests(list);
    renderLeaveRequestsTable();
  });

  renderLeaveRequestsTable();

  renderAll();
});