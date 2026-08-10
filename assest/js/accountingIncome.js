/* ==========================================================
   accountingIncome.js — Income recording page (KPIs + income
   table + income modal). Split from accounting.js.
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

  // KPI cards also show totals against expenses, so we keep the same
  // demo expense figures used on the Expense page.
  const expenses = [
    { amount: 800.00 }, { amount: 350.00 }, { amount: 95.60 }, { amount: 1200.00 }, { amount: 120.00 }
  ];

  let nextIncomeId = incomes.length + 1;

  const incomeTbody = document.getElementById('incomeTableBody');
  const incomeSearch = document.getElementById('incomeSearch');

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

  function renderAll(){
    renderKpis();
    renderIncomeTable();
  }

  incomeSearch.addEventListener('input', renderIncomeTable);

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

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 2'));
  }

  renderAll();
});
