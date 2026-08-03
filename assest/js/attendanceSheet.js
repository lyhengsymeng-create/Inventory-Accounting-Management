document.addEventListener('DOMContentLoaded', () => {

  const employees = [
    { id: 3, name: 'Vet Chansarak', image: '../../../assest/image/DSC_1541 copy.jpg' },
    { id: 4, name: 'Lyheng Symeny', image: '../../../assest/image/meng_image.jpg' },
    { id: 5, name: 'Rim Phearoun', image: '../../../assest/image/phearoun_image.jpg' },
    { id: 6, name: 'Sok Dara', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP66xZe_6NzZqJBWm79x8S2MHyt4QklAK-9-jQ-IRAFw&s=10' },
    { id: 7, name: 'Sok Pisey', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxEug8Ah6v72E2hoe23E2t5awqBYfr80J9f3La5y0QSg&s=10' },
    { id: 8, name: 'Heng Sylong', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5gR8rxs27HynIOIU9zUAwqEZdJ8ktrvK22xDCiUj59Q&s=10' },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const yearSelect = document.getElementById('sheetYear');
  const monthSelect = document.getElementById('sheetMonth');
  const searchBtn = document.getElementById('sheetSearchBtn');
  const headerRow = document.getElementById('sheetHeaderRow');
  const tbody = document.getElementById('sheetTableBody');
  const filterLabel = document.getElementById('sheetFilterLabel');

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

  // icon markup per day status, wrapped in a colored circular badge
  function dayIcon(status) {
    const icons = {
      weekend: 'bi-dash',
      present: 'bi-check-lg',
      leave: 'bi-x-lg',
      holiday: 'bi-star-fill',
      half: 'bi-star-half',
    };
    const icon = icons[status] || '';
    return `<span class="day-badge status-${status}"><i class="bi ${icon}"></i></span>`;
  }

  function dayStatus(empId, year, month, day) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    // 6-day work week: Sunday(0) is off; Saturday(6) is a half-day (morning only).
    if (dow === 0) return 'weekend';
    // fixed monthly holiday example: 1st of month
    if (day === 1 && month === 0) return 'holiday';
    const r = seededRandom(empId * 1000 + month * 31 + day);
    if (r > 0.9) return 'leave';
    if (r > 0.85) return 'holiday';
    if (dow === 6) return 'half';
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
      const dow = new Date(year, month, d).getDay();
      if (dow === 0) th.classList.add('weekend-col');
      if (dow === 6) th.classList.add('half-col');
      headerRow.appendChild(th);
    }

    tbody.innerHTML = employees.map(emp => {
      const avatar = emp.image
        ? `<img class="emp-avatar" src="${emp.image}" alt="">`
        : `<div class="emp-avatar-fallback">${initials(emp.name)}</div>`;
      let cells = '';
      for (let d = 1; d <= daysInMonth; d++) {
        const status = dayStatus(emp.id, year, month, d);
        let colCls = '';
        if (status === 'weekend') colCls = ' weekend-col';
        else if (status === 'half') colCls = ' half-col';
        cells += `<td class="${colCls.trim()}">${dayIcon(status)}</td>`;
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
});
