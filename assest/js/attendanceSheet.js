document.addEventListener('DOMContentLoaded', () => {

  const employees = [
    { id: 3, name: 'Vet Chansarak', image: '/assest/image/DSC_1541 copy.jpg' },
    { id: 4, name: 'Lyheng Symeny', image: '/assest/image/meng_image.jpg' },
    { id: 5, name: 'Sok Pisey', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXKt6OpGc7iHjVJSEUr9pV7EyG821ENIwipSvKStOVTQ&s=10' },
    { id: 6, name: 'Sok Dara', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP66xZe_6NzZqJBWm79x8S2MHyt4QklAK-9-jQ-IRAFw&s=10' },
    { id: 7, name: 'Sopheak', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxEug8Ah6v72E2hoe23E2t5awqBYfr80J9f3La5y0QSg&s=10' },
    { id: 8, name: 'Heng Sylong', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5gR8rxs27HynIOIU9zUAwqEZdJ8ktrvK22xDCiUj59Q&s=10' },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const yearSelect = document.getElementById('sheetYear');
  const monthSelect = document.getElementById('sheetMonth');
  const searchBtn = document.getElementById('sheetSearchBtn');
  const headerRow = document.getElementById('sheetHeaderRow');
  const tbody = document.getElementById('sheetTableBody');
  const filterLabel = document.getElementById('sheetFilterLabel');

  
  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg) {
    if (!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

  function populateSelectors() {
    const now = new Date();
    const currentYear = now.getFullYear();
    for (let y = currentYear; y >= currentYear - 3; y--) {
      const opt = document.createElement('option');
      opt.value = y; opt.textContent = y;
      yearSelect.appendChild(opt);
    }
    months.forEach((m, i) => {
      const opt = document.createElement('option');
      opt.value = i; opt.textContent = m;
      monthSelect.appendChild(opt);
    });
    yearSelect.value = currentYear;
    monthSelect.value = now.getMonth();
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // icon markup per day status
  function dayIcon(status) {
    switch (status) {
      case 'weekend': return '<i class="bi bi-dash-circle text-secondary"></i>';
      case 'present': return '<i class="bi bi-check-circle-fill text-success"></i>';
      case 'leave': return '<i class="bi bi-x-circle-fill text-danger"></i>';
      case 'holiday': return '<i class="bi bi-circle-fill" style="color:#f5b301;"></i>';
      default: return '';
    }
  }

  function dayStatus(empId, year, month, day) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    // 5-day work week: Saturday(6) and Sunday(0) are non-working days.
    if (dow === 0 || dow === 6) return 'weekend';
    // fixed monthly holiday example: 1st of month
    if (day === 1 && month === 0) return 'holiday';
    const r = seededRandom(empId * 1000 + month * 31 + day);
    if (r > 0.9) return 'leave';
    if (r > 0.85) return 'holiday';
    return 'present';
  }

  function render() {
    const year = Number(yearSelect.value);
    const month = Number(monthSelect.value);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    filterLabel.textContent = `Filtered by: Year: ${year} | Month: ${months[month]}`;

    // header row: Employee Name th already present, append day columns
    headerRow.innerHTML = `<th class="text-start" style="font-size:.72rem; letter-spacing:.05em; min-width:160px;">Employee Name</th>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const th = document.createElement('th');
      th.style.fontSize = '.72rem';
      th.style.minWidth = '38px';
      th.textContent = d;
      headerRow.appendChild(th);
    }

    tbody.innerHTML = employees.map(emp => {
      const avatar = emp.image
        ? `<img src="${emp.image}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;" alt="">`
        : `<div style="width:28px;height:28px;border-radius:50%;background:#e7efeb;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;color:#1f4d43;">${initials(emp.name)}</div>`;
      let cells = '';
      for (let d = 1; d <= daysInMonth; d++) {
        const status = dayStatus(emp.id, year, month, d);
        cells += `<td>${dayIcon(status)}</td>`;
      }
      return `
      <tr>
        <td class="text-start">
          <div class="d-flex align-items-center gap-2">
            ${avatar}
            <span class="fw-semibold small">${emp.name}</span>
          </div>
        </td>
        ${cells}
      </tr>`;
    }).join('');
  }

  searchBtn.addEventListener('click', render);

  populateSelectors();
  render();

/* ---------------- Leave Requests (សំណើសុំច្បាប់ពី Staff) ---------------- */
  
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

});
