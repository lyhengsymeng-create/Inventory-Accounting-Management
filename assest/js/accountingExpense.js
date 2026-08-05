/* ==========================================================
   accountingExpense.js — Expense recording page (KPIs + expense
   table + expense modal). Split from accounting.js.
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

  // KPI cards also show totals against income, so we keep the same
  // demo income figures used on the Income page.
  const incomes = [
    { amount: 420.50 }, { amount: 1250.00 }, { amount: 85.00 }, { amount: 2000.00 }, { amount: 610.25 }
  ];

  /* ---------------- Demo data ---------------- */
  let expenses = [
    { id: 1, date: '2026-07-02', payee: 'ភ្ជាប់ទំនិញ ABC',         category: 'Inventory Purchase', method: 'Bank Transfer', amount: 800.00 },
    { id: 2, date: '2026-07-04', payee: 'ថ្លៃជួលហាង',              category: 'Rent',               method: 'Cash',           amount: 350.00 },
    { id: 3, date: '2026-07-08', payee: 'អគ្គិសនី & ទឹក',          category: 'Utilities',          method: 'ABA KHQR',       amount: 95.60 },
    { id: 4, date: '2026-07-12', payee: 'បៀវត្សបុគ្គលិក',          category: 'Salaries',           method: 'Bank Transfer', amount: 1200.00 },
    { id: 5, date: '2026-07-18', payee: 'ការផ្សាយពាណិជ្ជកម្ម',    category: 'Marketing',          method: 'Card',           amount: 120.00 }
  ];

  let nextExpenseId = expenses.length + 1;

  const expenseTbody = document.getElementById('expenseTableBody');
  const expenseSearch = document.getElementById('expenseSearch');

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById('kpiIncome').textContent = fmt(totalIncome);
    document.getElementById('kpiExpense').textContent = fmt(totalExpense);
    document.getElementById('kpiProfit').textContent = fmt(totalIncome - totalExpense);
    document.getElementById('kpiCash').textContent = fmt(totalIncome - totalExpense);
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

  function renderAll(){
    renderKpis();
    renderExpenseTable();
  }

  expenseSearch.addEventListener('input', renderExpenseTable);

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
