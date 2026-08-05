/* ==========================================================
   accountingCashFlow.js — Cash Flow report page (KPIs + cash
   flow table, read-only). Split from accounting.js.
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

  /* ---------------- Demo data (same figures as Income / Expense pages) ---------------- */
  const incomes = [
    { date: '2026-07-01', source: 'ការលក់ប្រចាំថ្ងៃ',      category: 'Sales Revenue',  method: 'Cash',         amount: 420.50 },
    { date: '2026-07-05', source: 'ការលក់ដុំ',               category: 'Sales Revenue',  method: 'Bank Transfer',amount: 1250.00 },
    { date: '2026-07-10', source: 'សេវាដឹកជញ្ជូន',           category: 'Service Income',  method: 'ABA KHQR',     amount: 85.00 },
    { date: '2026-07-15', source: 'ការវិនិយោគបន្ថែម',        category: 'Investment',      method: 'Bank Transfer',amount: 2000.00 },
    { date: '2026-07-20', source: 'ការលក់ប្រចាំថ្ងៃ',      category: 'Sales Revenue',  method: 'Cash',         amount: 610.25 }
  ];

  const expenses = [
    { date: '2026-07-02', payee: 'ភ្ជាប់ទំនិញ ABC',         category: 'Inventory Purchase', method: 'Bank Transfer', amount: 800.00 },
    { date: '2026-07-04', payee: 'ថ្លៃជួលហាង',              category: 'Rent',               method: 'Cash',           amount: 350.00 },
    { date: '2026-07-08', payee: 'អគ្គិសនី & ទឹក',          category: 'Utilities',          method: 'ABA KHQR',       amount: 95.60 },
    { date: '2026-07-12', payee: 'បៀវត្សបុគ្គលិក',          category: 'Salaries',           method: 'Bank Transfer', amount: 1200.00 },
    { date: '2026-07-18', payee: 'ការផ្សាយពាណិជ្ជកម្ម',    category: 'Marketing',          method: 'Card',           amount: 120.00 }
  ];

  const cashflowTbody = document.getElementById('cashflowTableBody');

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById('kpiIncome').textContent = fmt(totalIncome);
    document.getElementById('kpiExpense').textContent = fmt(totalExpense);
    document.getElementById('kpiProfit').textContent = fmt(totalIncome - totalExpense);
    document.getElementById('kpiCash').textContent = fmt(totalIncome - totalExpense);
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

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 2'));
  }

  renderKpis();
  renderCashflow();
});
