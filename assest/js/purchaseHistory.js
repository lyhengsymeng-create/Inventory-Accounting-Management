document.addEventListener('DOMContentLoaded', () => {

  const notifyModalEl = document.getElementById('notifyModal');
  const notifyModalBody = document.getElementById('notifyModalBody');
  const notifyModal = notifyModalEl ? new bootstrap.Modal(notifyModalEl) : null;
  let notifyTimer = null;
  function notify(msg){
    if(!notifyModal) return;
    notifyModalBody.textContent = msg;
    notifyModal.show();
    clearTimeout(notifyTimer);
    notifyTimer = setTimeout(() => notifyModal.hide(), 1800);
  }
  function fmt(n){ return '$' + Number(n || 0).toFixed(2); }
  function poCode(n){ return 'PO-' + String(n).padStart(4, '0'); }
  function itemsSummary(items){
    if(!items || items.length === 0) return '<span class="text-secondary">—</span>';
    const text = items.map(it => `${it.name} ×${it.qty}`).join(', ');
    return `<span class="small" title="${text.replace(/"/g, '&quot;')}">${text}</span>`;
  }
  function statusBadge(status){
    const map = {
      'រង់ចាំការអនុម័ត': 'bg-warning-subtle text-warning-emphasis',
      'បានអនុម័ត': 'bg-primary-subtle text-primary',
      'បានទទួល': 'bg-success-subtle text-success',
      'បានបដិសេធ': 'bg-danger-subtle text-danger'
    };
    return `<span class="badge rounded-pill status-pill ${map[status] || 'bg-secondary-subtle text-secondary'}">${status}</span>`;
  }

  /* ---------------- Shared Purchase Orders (persisted via PurchaseStore) ---------------- */
  let purchaseOrders = window.PurchaseStore.getPurchaseOrders();

  const historyTableBody = document.getElementById('historyTableBody');
  const historySearch = document.getElementById('historySearch');

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    document.getElementById('kpiTotalPO').textContent = purchaseOrders.length;
    document.getElementById('kpiPending').textContent = purchaseOrders.filter(p => p.status === 'រង់ចាំការអនុម័ត').length;
    document.getElementById('kpiReceived').textContent = purchaseOrders.filter(p => p.status === 'បានទទួល').length;
    document.getElementById('kpiSpend').textContent = fmt(purchaseOrders.reduce((s, p) => s + p.total, 0));
  }

  /* ---------------- Purchase History ---------------- */
  function renderHistory(){
    const q = (historySearch.value || '').trim().toLowerCase();
    const rows = purchaseOrders
      .filter(p => poCode(p.id).toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q))
      .sort((a, b) => b.id - a.id);

    historyTableBody.innerHTML = '';
    if(rows.length === 0){
      historyTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary py-4">No purchase orders found</td></tr>`;
      return;
    }
    rows.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="small fw-semibold">${poCode(p.id)}</td>
        <td class="small">${p.supplier}</td>
        <td>${itemsSummary(p.items)}</td>
        <td class="small">${p.date}</td>
        <td class="small fw-semibold">${fmt(p.total)}</td>
        <td>${statusBadge(p.status)}</td>`;
      historyTableBody.appendChild(tr);
    });
  }

  historySearch.addEventListener('input', renderHistory);

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 4'));
  }

  renderKpis();
  renderHistory();
});
