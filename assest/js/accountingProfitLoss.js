/* ==========================================================
   accountingProfitLoss.js — Profit & Loss report page (KPIs +
   P&L table, read-only). Split from accounting.js.
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

  const plTbody = document.getElementById('plTableBody');

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    document.getElementById('kpiIncome').textContent = fmt(totalIncome);
    document.getElementById('kpiExpense').textContent = fmt(totalExpense);
    document.getElementById('kpiProfit').textContent = fmt(totalIncome - totalExpense);
    document.getElementById('kpiCash').textContent = fmt(totalIncome - totalExpense);
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

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 2'));
  }

  renderKpis();
  renderPL();
});
