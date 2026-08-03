/* ==========================================================
   accounting.js — Income & expense recording, Profit & Loss
   report, and Cash Flow report. In-memory demo data, same
   interaction pattern as productManagement.js.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg){
    if(!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }
  function fmt(n){ return '$' + Number(n || 0).toFixed(2); }

  /* ---------------- Demo data ---------------- */
  let incomes = [
    { id: 1, date: '2026-07-01', source: 'ការលក់ប្រចាំថ្ងៃ',      category: 'Sales Revenue',  method: 'Cash',         amount: 420.50 },
    { id: 2, date: '2026-07-05', source: 'ការលក់ដុំ',               category: 'Sales Revenue',  method: 'Bank Transfer',amount: 1250.00 },
    { id: 3, date: '2026-07-10', source: 'សេវាដឹកជញ្ជូន',           category: 'Service Income',  method: 'ABA KHQR',     amount: 85.00 },
    { id: 4, date: '2026-07-15', source: 'ការវិនិយោគបន្ថែម',        category: 'Investment',      method: 'Bank Transfer',amount: 2000.00 },
    { id: 5, date: '2026-07-20', source: 'ការលក់ប្រចាំថ្ងៃ',      category: 'Sales Revenue',  method: 'Cash',         amount: 610.25 }
  ];

  let expenses = [
    { id: 1, date: '2026-07-02', payee: 'ភ្ជាប់ទំនិញ ABC',         category: 'Inventory Purchase', method: 'Bank Transfer', amount: 800.00 },
    { id: 2, date: '2026-07-04', payee: 'ថ្លៃជួលហាង',              category: 'Rent',               method: 'Cash',           amount: 350.00 },
    { id: 3, date: '2026-07-08', payee: 'អគ្គិសនី & ទឹក',          category: 'Utilities',          method: 'ABA KHQR',       amount: 95.60 },
    { id: 4, date: '2026-07-12', payee: 'បៀវត្សបុគ្គលិក',          category: 'Salaries',           method: 'Bank Transfer', amount: 1200.00 },
    { id: 5, date: '2026-07-18', payee: 'ការផ្សាយពាណិជ្ជកម្ម',    category: 'Marketing',          method: 'Card',           amount: 120.00 }
  ];

  let nextIncomeId = incomes.length + 1;
  let nextExpenseId = expenses.length + 1;

  const incomeTbody = document.getElementById('incomeTableBody');
  const expenseTbody = document.getElementById('expenseTableBody');
  const plTbody = document.getElementById('plTableBody');
  const cashflowTbody = document.getElementById('cashflowTableBody');
  const incomeSearch = document.getElementById('incomeSearch');
  const expenseSearch = document.getElementById('expenseSearch');

  /* ---------------- Tabs ---------------- */
  function activateTab(tab){
    const btn = document.querySelector('.acct-tab-btn[data-tab="' + tab + '"]');
    const pane = document.getElementById('pane-' + tab);
    if(!btn || !pane) return;
    document.querySelectorAll('.acct-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.acct-tab-pane').forEach(p => p.classList.remove('show'));
    pane.classList.add('show');

    // Keep the sidebar submenu (desktop + mobile) in sync with the active tab
    document.querySelectorAll('#accountingSubmenu1 .nav-link, #accountingSubmenu2 .nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === 'Accounting.html#' + tab);
    });
  }

  document.getElementById('acctTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.acct-tab-btn');
    if(!btn) return;
    activateTab(btn.dataset.tab);
    history.replaceState(null, '', 'Accounting.html#' + btn.dataset.tab);
  });

  // Deep link support: Accounting.html#income / #expenses / #pl / #cashflow
  const initialTab = (location.hash || '').replace('#', '');
  if(initialTab && document.getElementById('pane-' + initialTab)){
    activateTab(initialTab);
  }
  window.addEventListener('hashchange', () => {
    const tab = (location.hash || '').replace('#', '');
    if(tab && document.getElementById('pane-' + tab)) activateTab(tab);
  });

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById('kpiIncome').textContent = fmt(totalIncome);
    document.getElementById('kpiExpense').textContent = fmt(totalExpense);
    document.getElementById('kpiProfit').textContent = fmt(totalIncome - totalExpense);
    document.getElementById('kpiCash').textContent = fmt(totalIncome - totalExpense);
  }

  /* ---------------- Income table ---------------- */
  function renderIncomeTable(){
    const q = (incomeSearch.value || '').trim().toLowerCase();
    const rows = incomes
      .filter(i => i.source.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .sort((a, b) => a.date < b.date ? 1 : -1);

    incomeTbody.innerHTML = '';
    if(rows.length === 0){
      incomeTbody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary py-4">No income records found</td></tr>`;
      return;
    }
    rows.forEach(i => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="small">${i.date}</td>
        <td class="fw-semibold small">${i.source}</td>
        <td><span class="badge rounded-pill bg-success-subtle text-success">${i.category}</span></td>
        <td class="small text-secondary">${i.method}</td>
        <td class="small fw-semibold" style="color:#1f4d43;">${fmt(i.amount)}</td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-sm btn-light border rounded-3" data-action="edit-income" data-id="${i.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="delete-income" data-id="${i.id}" title="Delete"><i class="bi bi-trash-fill"></i></button>
          </div>
        </td>`;
      incomeTbody.appendChild(tr);
    });
  }

  /* ---------------- Expense table ---------------- */
  function renderExpenseTable(){
    const q = (expenseSearch.value || '').trim().toLowerCase();
    const rows = expenses
      .filter(e => e.payee.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
      .sort((a, b) => a.date < b.date ? 1 : -1);

    expenseTbody.innerHTML = '';
    if(rows.length === 0){
      expenseTbody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary py-4">No expense records found</td></tr>`;
      return;
    }
    rows.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="small">${e.date}</td>
        <td class="fw-semibold small">${e.payee}</td>
        <td><span class="badge rounded-pill bg-warning-subtle text-warning-emphasis">${e.category}</span></td>
        <td class="small text-secondary">${e.method}</td>
        <td class="small fw-semibold" style="color:#c1793a;">${fmt(e.amount)}</td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-sm btn-light border rounded-3" data-action="edit-expense" data-id="${e.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="delete-expense" data-id="${e.id}" title="Delete"><i class="bi bi-trash-fill"></i></button>
          </div>
        </td>`;
      expenseTbody.appendChild(tr);
    });
  }

  /* ---------------- Profit & Loss report ---------------- */
  function renderPL(){
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const grandTotal = totalIncome + totalExpense || 1;

    const byCategory = {};
    incomes.forEach(i => {
      byCategory[i.category] = byCategory[i.category] || { type: 'Income', amount: 0 };
      byCategory[i.category].amount += i.amount;
    });
    expenses.forEach(e => {
      byCategory[e.category] = byCategory[e.category] || { type: 'Expense', amount: 0 };
      byCategory[e.category].amount += e.amount;
    });

    const entries = Object.entries(byCategory).sort((a, b) => b[1].amount - a[1].amount);
    plTbody.innerHTML = '';
    entries.forEach(([cat, v]) => {
      const share = ((v.amount / grandTotal) * 100).toFixed(1);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="small fw-semibold">${cat}</td>
        <td><span class="badge rounded-pill ${v.type === 'Income' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'}">${v.type}</span></td>
        <td class="small">${fmt(v.amount)}</td>
        <td style="min-width:140px;">
          <div class="flow-bar-track">
            <div class="flow-bar-fill" style="width:${share}%; background:${v.type === 'Income' ? '#1f4d43' : '#c1793a'};"></div>
          </div>
          <div class="text-secondary" style="font-size:.7rem;">${share}%</div>
        </td>`;
      plTbody.appendChild(tr);
    });

    document.getElementById('plNet').textContent = fmt(totalIncome - totalExpense);
  }

  /* ---------------- Cash Flow report ---------------- */
  function renderCashflow(){
    const combined = [
      ...incomes.map(i => ({ date: i.date, desc: i.source, inflow: i.amount, outflow: 0 })),
      ...expenses.map(e => ({ date: e.date, desc: e.payee, inflow: 0, outflow: e.amount }))
    ].sort((a, b) => a.date.localeCompare(b.date));

    let balance = 0;
    cashflowTbody.innerHTML = '';
    if(combined.length === 0){
      cashflowTbody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-4">No transactions yet</td></tr>`;
      return;
    }
    combined.forEach(row => {
      balance += row.inflow - row.outflow;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="small">${row.date}</td>
        <td class="small fw-semibold">${row.desc}</td>
        <td class="small" style="color:#1f4d43;">${row.inflow ? fmt(row.inflow) : '—'}</td>
        <td class="small" style="color:#c1793a;">${row.outflow ? fmt(row.outflow) : '—'}</td>
        <td class="small fw-bold">${fmt(balance)}</td>`;
      cashflowTbody.appendChild(tr);
    });
  }

  function renderAll(){
    renderKpis();
    renderIncomeTable();
    renderExpenseTable();
    renderPL();
    renderCashflow();
  }

  incomeSearch.addEventListener('input', renderIncomeTable);
  expenseSearch.addEventListener('input', renderExpenseTable);

  /* ---------------- Income modal ---------------- */
  const incomeModalEl = document.getElementById('incomeModal');
  const incomeModal = new bootstrap.Modal(incomeModalEl);
  const incomeForm = document.getElementById('incomeForm');
  const incomeModalTitle = document.getElementById('incomeModalTitle');

  document.getElementById('addIncomeBtn').addEventListener('click', () => {
    incomeModalTitle.textContent = 'Record Income';
    incomeForm.reset();
    document.getElementById('incomeId').value = '';
    document.getElementById('incomeDate').value = new Date().toISOString().slice(0, 10);
  });

  document.getElementById('saveIncomeBtn').addEventListener('click', () => {
    if(!incomeForm.reportValidity()) return;
    const id = document.getElementById('incomeId').value;
    const date = document.getElementById('incomeDate').value;
    const source = document.getElementById('incomeSource').value.trim();
    const category = document.getElementById('incomeCategory').value;
    const method = document.getElementById('incomeMethod').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value) || 0;

    if(id){
      const rec = incomes.find(x => x.id === Number(id));
      if(rec) Object.assign(rec, { date, source, category, method, amount });
      notify('បានធ្វើបច្ចុប្បន្នភាពចំណូល');
    } else {
      incomes.push({ id: nextIncomeId++, date, source, category, method, amount });
      notify('បានកត់ត្រាចំណូល');
    }
    incomeModal.hide();
    renderAll();
  });

  incomeTbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const rec = incomes.find(x => x.id === id);
    if(!rec) return;

    if(btn.dataset.action === 'edit-income'){
      incomeModalTitle.textContent = 'Edit Income';
      document.getElementById('incomeId').value = rec.id;
      document.getElementById('incomeDate').value = rec.date;
      document.getElementById('incomeSource').value = rec.source;
      document.getElementById('incomeCategory').value = rec.category;
      document.getElementById('incomeMethod').value = rec.method;
      document.getElementById('incomeAmount').value = rec.amount;
      incomeModal.show();
    } else if(btn.dataset.action === 'delete-income'){
      if(confirm(`តើអ្នកពិតជាចង់លុបចំណូល "${rec.source}" មែនទេ?`)){
        incomes = incomes.filter(x => x.id !== id);
        notify('បានលុបចំណូល');
        renderAll();
      }
    }
  });

  /* ---------------- Expense modal ---------------- */
  const expenseModalEl = document.getElementById('expenseModal');
  const expenseModal = new bootstrap.Modal(expenseModalEl);
  const expenseForm = document.getElementById('expenseForm');
  const expenseModalTitle = document.getElementById('expenseModalTitle');

  document.getElementById('addExpenseBtn').addEventListener('click', () => {
    expenseModalTitle.textContent = 'Record Expense';
    expenseForm.reset();
    document.getElementById('expenseId').value = '';
    document.getElementById('expenseDate').value = new Date().toISOString().slice(0, 10);
  });

  document.getElementById('saveExpenseBtn').addEventListener('click', () => {
    if(!expenseForm.reportValidity()) return;
    const id = document.getElementById('expenseId').value;
    const date = document.getElementById('expenseDate').value;
    const payee = document.getElementById('expensePayee').value.trim();
    const category = document.getElementById('expenseCategory').value;
    const method = document.getElementById('expenseMethod').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value) || 0;

    if(id){
      const rec = expenses.find(x => x.id === Number(id));
      if(rec) Object.assign(rec, { date, payee, category, method, amount });
      notify('បានធ្វើបច្ចុប្បន្នភាពចំណាយ');
    } else {
      expenses.push({ id: nextExpenseId++, date, payee, category, method, amount });
      notify('បានកត់ត្រាចំណាយ');
    }
    expenseModal.hide();
    renderAll();
  });

  expenseTbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const rec = expenses.find(x => x.id === id);
    if(!rec) return;

    if(btn.dataset.action === 'edit-expense'){
      expenseModalTitle.textContent = 'Edit Expense';
      document.getElementById('expenseId').value = rec.id;
      document.getElementById('expenseDate').value = rec.date;
      document.getElementById('expensePayee').value = rec.payee;
      document.getElementById('expenseCategory').value = rec.category;
      document.getElementById('expenseMethod').value = rec.method;
      document.getElementById('expenseAmount').value = rec.amount;
      expenseModal.show();
    } else if(btn.dataset.action === 'delete-expense'){
      if(confirm(`តើអ្នកពិតជាចង់លុបចំណាយ "${rec.payee}" មែនទេ?`)){
        expenses = expenses.filter(x => x.id !== id);
        notify('បានលុបចំណាយ');
        renderAll();
      }
    }
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 2'));
  }

  renderAll();
});
