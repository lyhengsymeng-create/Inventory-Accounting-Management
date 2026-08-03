document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg) {
    if (!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

  // ---- Employee roster (kept in sync with Employee Management) ----
  const employees = [
    { id: 3, name: 'Vet Chansarak', image: '/assest/image/DSC_1541 copy.jpg', shift: 'General' },
    { id: 4, name: 'Lyheng Symeny', image: '/assest/image/meng_image.jpg', shift: 'Late' },
    { id: 5, name: 'Rim Phearoun', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXKt6OpGc7iHjVJSEUr9pV7EyG821ENIwipSvKStOVTQ&s=10', shift: 'General' },
    { id: 6, name: 'Sok Dara', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP66xZe_6NzZqJBWm79x8S2MHyt4QklAK-9-jQ-IRAFw&s=10', shift: 'Early' },
    { id: 7, name: 'Sok Pisey', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxEug8Ah6v72E2hoe23E2t5awqBYfr80J9f3La5y0QSg&s=10', shift: 'Late' },
    { id: 8, name: 'Heng Sylong', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5gR8rxs27HynIOIU9zUAwqEZdJ8ktrvK22xDCiUj59Q&s=10', shift: 'General' },
  ];

  const statusColors = {
    Present: 'bg-success-subtle text-success',
    Late: 'bg-warning-subtle text-warning',
    Absent: 'bg-danger-subtle text-danger',
    'Half Day': 'bg-primary-subtle text-primary',
    'On Leave': 'bg-secondary-subtle text-secondary'
  };

  function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
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

  function seedTodayRecords() {
    return [
      { id: 1, empId: 3, firstIn: '08:00', break: '12:00', lastOut: '17:00', status: 'Present', shift: 'General' },
      { id: 1, empId: 3, firstIn: '08:00', break: '12:00', lastOut: '17:00', status: 'Present', shift: 'General' },
      { id: 2, empId: 5, firstIn: '08:00', break: '12:00', lastOut: '17:00', status: 'Present', shift: 'General' },
      { id: 3, empId: 6, firstIn: '08:00', break: '12:00', lastOut: '17:00', status: 'Present', shift: 'General' },
      { id: 4, empId: 4, firstIn: '08:00', break: 'hasa',     lastOut: '12:00', status: 'Half Day', shift: 'General' },
      { id: 5, empId: 7, firstIn: '08:15', break: '12:00', lastOut: '17:00', status: 'Late', shift: 'General' },
      { id: 6, empId: 8, firstIn: '08:00', break: '12:00', lastOut: '17:00', status: 'Present', shift: 'General' },
      // { id: 6, empId: 8, firstIn: '08:00', break: '12:00', lastOut: '17:00', status: 'Present', shift: 'General' },
    ];
  }

// Records are stored per-date: { '2026-07-25': [ {id, empId, firstIn, break, lastOut, status, shift}, ... ] }
// SEED_VERSION: bump this any time seedTodayRecords() changes, so browsers with
// stale cached localStorage data automatically pick up the new seed values.
const SEED_VERSION = 2;
let allRecords = loadFromStorage('attendanceRecords', {});
let currentDate = todayStr();
const storedSeedVersion = loadFromStorage('attendanceSeedVersion', 0);
if (storedSeedVersion !== SEED_VERSION || !allRecords[currentDate]) {
  allRecords[currentDate] = seedTodayRecords();
  saveToStorage('attendanceRecords', allRecords);
  saveToStorage('attendanceSeedVersion', SEED_VERSION);
}
let nextRecordId = Math.max(0, ...Object.values(allRecords).flat().map(r => r.id)) + 1;

  const dateInput = document.getElementById('attendanceDate');
  const todayBtn = document.getElementById('todayBtn');
  const tbody = document.getElementById('attendanceTableBody');
  const searchInput = document.getElementById('attendanceSearch');
  const statusFilter = document.getElementById('statusFilter');
  const empSelect = document.getElementById('attendanceEmployee');

  dateInput.value = currentDate;

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  function employeeById(id) {
    return employees.find(e => e.id === id);
  }

  function totalHours(firstIn, lastOut) {
    if (!firstIn || !lastOut) return '0h 00m';
    const [h1, m1] = firstIn.split(':').map(Number);
    const [h2, m2] = lastOut.split(':').map(Number);
    let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (mins < 0) mins = 0;
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
  }

function to12h(t) {
  if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return '-';
  let [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

  function populateEmployeeSelect() {
    empSelect.innerHTML = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  }

  function renderKpis(records) {
    document.getElementById('kpiPresent').textContent = records.filter(r => r.status === 'Present').length;
    document.getElementById('kpiLate').textContent = records.filter(r => r.status === 'Late').length;
    document.getElementById('kpiAbsent').textContent = records.filter(r => r.status === 'Absent').length;
    document.getElementById('kpiHalfDay').textContent = records.filter(r => r.status === 'Half Day').length;
  }

  function renderTable() {
    const records = allRecords[currentDate] || [];
    const q = (searchInput.value || '').trim().toLowerCase();
    const statusQ = statusFilter.value;

    renderKpis(records);

    const filtered = records.filter(r => {
      const emp = employeeById(r.empId);
      if (!emp) return false;
      if (q && !emp.name.toLowerCase().includes(q)) return false;
      if (statusQ && r.status !== statusQ) return false;
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-secondary py-4">No attendance records for this date.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const emp = employeeById(r.empId);
      const badge = statusColors[r.status] || 'bg-secondary-subtle text-secondary';
      const hours = r.status === 'Absent' ? '0h 00m' : totalHours(r.firstIn, r.lastOut);
      const avatar = emp.image
        ? `<img src="${emp.image}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" alt="">`
        : `<div style="width:32px;height:32px;border-radius:50%;background:#e7efeb;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#1f4d43;">${initials(emp.name)}</div>`;
      return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            ${avatar}
            <span class="fw-semibold">${emp.name}</span>
          </div>
        </td>
        <td>${r.status === 'Absent' ? '-' : to12h(r.firstIn)}</td>
        <td>${r.status === 'Absent' ? '-' : to12h(r.break)}</td>
        <td>${r.status === 'Absent' ? '-' : to12h(r.lastOut)}</td>
        <td>${hours}</td>
        <td><span class="badge rounded-pill ${badge}">${r.status}</span></td>
        <td>${r.shift}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-light border rounded-2 me-1 edit-record" data-id="${r.id}"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-light border rounded-2 delete-record" data-id="${r.id}"><i class="bi bi-trash text-danger"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  // ---- Date navigation ----
  dateInput.addEventListener('change', () => {
    currentDate = dateInput.value || todayStr();
    if (!allRecords[currentDate]) {
      allRecords[currentDate] = [];
      saveToStorage('attendanceRecords', allRecords);
    }
    renderTable();
  });

  todayBtn.addEventListener('click', () => {
    currentDate = todayStr();
    dateInput.value = currentDate;
    if (!allRecords[currentDate]) {
      allRecords[currentDate] = seedTodayRecords();
      saveToStorage('attendanceRecords', allRecords);
    }
    renderTable();
  });

  searchInput.addEventListener('input', renderTable);
  statusFilter.addEventListener('change', renderTable);

  // ---- Add / Edit modal ----
  const attendanceModalEl = document.getElementById('attendanceModal');
  const attendanceModal = new bootstrap.Modal(attendanceModalEl);
  const modalTitle = document.getElementById('attendanceModalTitle');
  const recordIdInput = document.getElementById('attendanceRecordId');
  const firstInInput = document.getElementById('attendanceFirstIn');
  const breakInput = document.getElementById('attendanceBreak');
  const lastOutInput = document.getElementById('attendanceLastOut');
  const shiftSelect = document.getElementById('attendanceShift');
  const statusSelect = document.getElementById('attendanceStatus');

  document.getElementById('addAttendanceBtn').addEventListener('click', () => {
    modalTitle.textContent = 'Add Attendance Record';
    recordIdInput.value = '';
    empSelect.disabled = false;
    firstInInput.value = '';
    breakInput.value = '';
    lastOutInput.value = '';
    shiftSelect.value = 'General';
    statusSelect.value = 'Present';
  });

  tbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-record');
    const delBtn = e.target.closest('.delete-record');

    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const rec = (allRecords[currentDate] || []).find(r => r.id === id);
      if (!rec) return;
      modalTitle.textContent = 'Edit Attendance Record';
      recordIdInput.value = rec.id;
      empSelect.value = rec.empId;
      empSelect.disabled = true;
      firstInInput.value = rec.firstIn || '';
      breakInput.value = rec.break || '';
      lastOutInput.value = rec.lastOut || '';
      shiftSelect.value = rec.shift || 'General';
      statusSelect.value = rec.status || 'Present';
      attendanceModal.show();
    }

    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      allRecords[currentDate] = (allRecords[currentDate] || []).filter(r => r.id !== id);
      saveToStorage('attendanceRecords', allRecords);
      renderTable();
      notify('Attendance record deleted');
    }
  });

  document.getElementById('saveAttendanceBtn').addEventListener('click', () => {
    const empId = Number(empSelect.value);
    if (!empId) { notify('Please select an employee'); return; }

    const id = recordIdInput.value ? Number(recordIdInput.value) : nextRecordId++;
    const record = {
      id, empId,
      firstIn: firstInInput.value,
      break: breakInput.value,
      lastOut: lastOutInput.value,
      status: statusSelect.value,
      shift: shiftSelect.value
    };

    if (!allRecords[currentDate]) allRecords[currentDate] = [];
    const idx = allRecords[currentDate].findIndex(r => r.id === id);
    if (idx >= 0) {
      allRecords[currentDate][idx] = record;
    } else {
      // one record per employee per day
      const dupIdx = allRecords[currentDate].findIndex(r => r.empId === empId);
      if (dupIdx >= 0) {
        allRecords[currentDate][dupIdx] = record;
      } else {
        allRecords[currentDate].push(record);
      }
    }

    saveToStorage('attendanceRecords', allRecords);
    attendanceModal.hide();
    renderTable();
    notify('Attendance record saved');
  });

  populateEmployeeSelect();
  renderTable();

  
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
