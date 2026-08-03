document.addEventListener('DOMContentLoaded', () => {

  const employees = [
    { id: 3, name: 'Vet Chansarak', image: '/assest/image/DSC_1541 copy.jpg', position: 'Cashier', department: 'Sales Floor', joinDate: '2023-01-10', empCode: 'IM062501VC' },
    { id: 4, name: 'Lyheng Symeny', image: '/assest/image/meng_image.jpg', position: 'Stock Clerk', department: 'Stock Room', joinDate: '2023-05-22', empCode: 'IM062502LS' },
    { id: 5, name: 'Rim Phearoun', image: '/assest/image/phearoun_image.jpg', position: 'Cashier', department: 'Sales Floor', joinDate: '2023-01-10', empCode: 'IM062503RP' },
    { id: 6, name: 'Sok Dara', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP66xZe_6NzZqJBWm79x8S2MHyt4QklAK-9-jQ-IRAFw&s=10', position: 'Stock Clerk', department: 'Stock Room', joinDate: '2023-09-18', empCode: 'IM062504SD' },
    { id: 7, name: 'Sok Pisey', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxEug8Ah6v72E2hoe23E2t5awqBYfr80J9f3La5y0QSg&s=10', position: 'Cashier', department: 'Sales Floor', joinDate: '2024-08-05', empCode: 'IM062505SK' },
    { id: 8, name: 'Heng Sylong', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5gR8rxs27HynIOIU9zUAwqEZdJ8ktrvK22xDCiUj59Q&s=10', position: 'Cashier', department: 'Sales Floor', joinDate: '2024-11-12', empCode: 'IM062506HS' },
  ];

  const statusColors = {
    Present: 'bg-success-subtle text-success',
    Late: 'bg-warning-subtle text-warning',
    Absent: 'bg-danger-subtle text-danger',
    'Half Day': 'bg-primary-subtle text-primary'
  };

  // Deterministic pseudo-random log generator per employee (so it's stable across reloads)
  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function generateLog(empId) {
    const log = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const day = d.getDay();
      const dateStr = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

      if (day === 0) { // Sunday off
        log.push({ date: dateStr, checkIn: '-', checkOut: '-', hours: '-', shift: '-', status: 'Weekend' });
        continue;
      }

      const r = seededRandom(empId * 100 + i);

      if (day === 6) { // Saturday: half-day, morning only (08:00 - 12:00)
        if (r > 0.85) {
          log.push({ date: dateStr, checkIn: '-', checkOut: '-', hours: '-', shift: 'General', status: 'Absent' });
          continue;
        }
        const inM = Math.floor(r * 15);
        const checkIn = `08:${pad(inM)}`;
        const checkOut = '12:00';
        const mins = (12 * 60) - (8 * 60 + inM);
        const hours = `${Math.floor(mins / 60)}h ${pad(mins % 60)}m`;
        log.push({ date: dateStr, checkIn, checkOut, hours, shift: 'General', status: 'Half Day' });
        continue;
      }

      // Monday - Friday: standard shift 08:00 - 17:00
      let status = 'Present';
      let inH = 8, inM = Math.floor(r * 15);
      if (r > 0.85) { status = 'Absent'; }
      else if (r > 0.7) { status = 'Late'; inM = 15 + Math.floor(r * 20); }

      if (status === 'Absent') {
        log.push({ date: dateStr, checkIn: '-', checkOut: '-', hours: '-', shift: 'General', status });
        continue;
      }
      const outH = 17;
      const outM = Math.floor(r * 15);
      const checkIn = `${pad(inH)}:${pad(inM)}`;
      const checkOut = `${pad(outH)}:${pad(outM)}`;
      const mins = (outH * 60 + outM) - (inH * 60 + inM);
      const hours = `${Math.floor(mins / 60)}h ${pad(mins % 60)}m`;
      log.push({ date: dateStr, checkIn, checkOut, hours, shift: 'General', status });
    }
    return log.reverse();
  }

  function avgStats(log) {
    const workDays = log.filter(l => l.status !== 'Weekend' && l.status !== 'Absent');
    if (workDays.length === 0) return { hours: '0h 00m', inTime: '-', outTime: '-', breakTime: '1h 00m' };
    let totalMins = 0, totalInMins = 0, totalOutMins = 0;
    workDays.forEach(l => {
      const [ih, im] = l.checkIn.split(':').map(Number);
      const [oh, om] = l.checkOut.split(':').map(Number);
      totalInMins += ih * 60 + im;
      totalOutMins += oh * 60 + om;
      totalMins += (oh * 60 + om) - (ih * 60 + im);
    });
    const avgMins = Math.round(totalMins / workDays.length);
    const avgInMins = Math.round(totalInMins / workDays.length);
    const avgOutMins = Math.round(totalOutMins / workDays.length);
    function fmtHM(mins) { return `${Math.floor(mins / 60)}h ${pad(mins % 60)}m`; }
    function fmtClock(mins) {
      let h = Math.floor(mins / 60), m = mins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12; if (h === 0) h = 12;
      return `${pad(h)}:${pad(m)} ${ampm}`;
    }
    return { hours: fmtHM(avgMins), inTime: fmtClock(avgInMins), outTime: fmtClock(avgOutMins), breakTime: '1h 00m' };
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  const listEl = document.getElementById('employeeList');
  const searchEl = document.getElementById('empListSearch');

  function renderList() {
    const q = (searchEl.value || '').trim().toLowerCase();
    const filtered = employees.filter(e => e.name.toLowerCase().includes(q));
    listEl.innerHTML = filtered.map(e => `
      <button type="button" class="btn btn-light border-0 rounded-3 d-flex align-items-center gap-2 text-start emp-pick" data-id="${e.id}" style="padding:.5rem .6rem;">
        ${e.image
          ? `<img src="${e.image}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;" alt="">`
          : `<div style="width:36px;height:36px;border-radius:50%;background:#e7efeb;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#1f4d43;flex-shrink:0;">${initials(e.name)}</div>`}
        <div style="min-width:0;">
          <div class="small fw-semibold text-truncate">${e.name}</div>
          <div class="text-secondary text-truncate" style="font-size:.72rem;">${e.position}</div>
        </div>
      </button>
    `).join('');

    listEl.querySelectorAll('.emp-pick').forEach(btn => {
      btn.addEventListener('click', () => selectEmployee(Number(btn.dataset.id)));
    });
  }

  function selectEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    listEl.querySelectorAll('.emp-pick').forEach(btn => {
      btn.classList.toggle('bg-light', false);
      btn.style.background = Number(btn.dataset.id) === id ? 'var(--violet-soft)' : '';
    });

    document.getElementById('profName').textContent = emp.name;
    document.getElementById('profPosition').textContent = emp.position;
    document.getElementById('profId').textContent = emp.empCode;
    document.getElementById('profDept').textContent = emp.department;
    document.getElementById('profJoined').textContent = new Date(emp.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    const imgEl = document.getElementById('profAvatarImg');
    const initEl = document.getElementById('profAvatarInitials');
    if (emp.image) {
      imgEl.src = emp.image;
      imgEl.style.display = 'block';
      initEl.style.display = 'none';
    } else {
      imgEl.style.display = 'none';
      initEl.style.display = 'block';
      initEl.textContent = initials(emp.name);
    }

    const log = generateLog(emp.id);
    const stats = avgStats(log);
    document.getElementById('statAvgHours').textContent = stats.hours;
    document.getElementById('statAvgIn').textContent = stats.inTime;
    document.getElementById('statAvgOut').textContent = stats.outTime;
    document.getElementById('statAvgBreak').textContent = stats.breakTime;

    const tbody = document.getElementById('empLogTableBody');
    tbody.innerHTML = log.map(l => {
      const badge = l.status === 'Weekend' ? 'bg-secondary-subtle text-secondary' : (statusColors[l.status] || 'bg-secondary-subtle text-secondary');
      return `
      <tr>
        <td>${l.date}</td>
        <td>${l.checkIn}</td>
        <td>${l.checkOut}</td>
        <td>${l.hours}</td>
        <td>${l.shift}</td>
        <td><span class="badge rounded-pill ${badge}">${l.status}</span></td>
      </tr>`;
    }).join('');
  }

  searchEl.addEventListener('input', renderList);

  renderList();
  if (employees.length) selectEmployee(employees[0].id);
});
