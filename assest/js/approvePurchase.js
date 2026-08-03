/* ==========================================================
   approvePurchase.js — Approve Purchase page.
   In-memory demo data, same interaction pattern as
   productManagement.js.
   ========================================================== */

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

  const approveTableBody = document.getElementById('approveTableBody');

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    document.getElementById('kpiTotalPO').textContent = purchaseOrders.length;
    document.getElementById('kpiPending').textContent = purchaseOrders.filter(p => p.status === 'រង់ចាំការអនុម័ត').length;
    document.getElementById('kpiReceived').textContent = purchaseOrders.filter(p => p.status === 'បានទទួល').length;
    document.getElementById('kpiSpend').textContent = fmt(purchaseOrders.reduce((s, p) => s + p.total, 0));
  }

  /* ---------------- Approve Purchase ---------------- */
  function renderApprove(){
    const rows = purchaseOrders.filter(p => p.status === 'រង់ចាំការអនុម័ត');
    approveTableBody.innerHTML = '';
    if(rows.length === 0){
      approveTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-secondary py-4">No orders awaiting approval</td></tr>`;
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
        <td>${statusBadge(p.status)}</td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-sm rounded-3 text-white" style="background:#1f4d43;" data-action="approve" data-id="${p.id}"><i class="bi bi-check-lg"></i> Approve</button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="reject" data-id="${p.id}"><i class="bi bi-x-lg"></i> Reject</button>
          </div>
        </td>`;
      approveTableBody.appendChild(tr);
    });
  }

  approveTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const po = purchaseOrders.find(p => p.id === id);
    if(!po) return;
    if(btn.dataset.action === 'approve'){
      po.status = 'បានអនុម័ត';
      notify(`${poCode(po.id)} បានអនុម័ត`);
    } else {
      po.status = 'បានបដិសេធ';
      notify(`${poCode(po.id)} បានបដិសេធ`);
    }
    window.PurchaseStore.savePurchaseOrders(purchaseOrders);
    renderKpis();
    renderApprove();
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 4'));
  }

  renderKpis();
  renderApprove();
});
