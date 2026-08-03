
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

  function statusBadge(status){
    const map = {
      'រង់ចាំការអនុម័ត': 'bg-warning-subtle text-warning-emphasis',
      'បានអនុម័ត': 'bg-primary-subtle text-primary',
      'បានទទួល': 'bg-success-subtle text-success',
      'បានបដិសេធ': 'bg-danger-subtle text-danger',
      'កំពុងបើក': 'bg-secondary-subtle text-secondary',
      'បានបំប្លែង': 'bg-success-subtle text-success'
    };
    return `<span class="badge rounded-pill status-pill ${map[status] || 'bg-secondary-subtle text-secondary'}">${status}</span>`;
  }

  /* ---------------- Shared Purchase Orders (persisted via PurchaseStore) ---------------- */
  let purchaseOrders = window.PurchaseStore.getPurchaseOrders();

  /* ---------------- Shared Purchase Requests (persisted via PurchaseStore) ---------------- */
  let requests = window.PurchaseStore.getPurchaseRequests();

  const requestTableBody = document.getElementById('requestTableBody');

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    document.getElementById('kpiTotalPO').textContent = purchaseOrders.length;
    document.getElementById('kpiPending').textContent = purchaseOrders.filter(p => p.status === 'រង់ចាំការអនុម័ត').length;
    document.getElementById('kpiReceived').textContent = purchaseOrders.filter(p => p.status === 'បានទទួល').length;
    document.getElementById('kpiSpend').textContent = fmt(purchaseOrders.reduce((s, p) => s + p.total, 0));
  }

  /* ---------------- Purchase Requests ---------------- */
  function renderRequests(){
    requestTableBody.innerHTML = '';
    if(requests.length === 0){
      requestTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary py-4">No purchase requests</td></tr>`;
      return;
    }
    requests.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="small fw-semibold">${r.item}</td>
        <td class="small">${r.qty}</td>
        <td class="small">${r.requester}</td>
        <td><span class="badge rounded-pill status-pill ${r.urgency === 'Urgent' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'}">${r.urgency}</span></td>
        <td>${statusBadge(r.status)}</td>
        <td class="text-end">
          ${r.status === 'កំពុងបើក' ? `
            <div class="d-flex justify-content-end gap-1">
              <button class="btn btn-sm text-white rounded-3" style="background:var(--violet);" data-action="convert" data-id="${r.id}">
                <i class="bi bi-arrow-right-circle"></i> Convert to PO
              </button>
            </div>` : `<span class="text-secondary small">—</span>`}
        </td>`;
      requestTableBody.appendChild(tr);
    });
  }

  document.getElementById('addRequestBtn').addEventListener('click', () => {
    const item = document.getElementById('reqItem').value.trim();
    const qty = parseInt(document.getElementById('reqQty').value, 10) || 1;
    const requester = document.getElementById('reqRequester').value.trim() || 'មិនស្គាល់';
    const urgency = document.getElementById('reqUrgency').value;
    if(!item){
      notify('សូមបញ្ចូលឈ្មោះធាតុ');
      return;
    }
    requests.push({ id: window.PurchaseStore.nextId(requests), item, qty, requester, urgency, status: 'កំពុងបើក' });
    window.PurchaseStore.savePurchaseRequests(requests);
    document.getElementById('reqItem').value = '';
    document.getElementById('reqQty').value = '';
    document.getElementById('reqRequester').value = '';
    notify('បានដាក់ស្នើសំណើសុំទិញ');
    renderRequests();
  });

  requestTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="convert"]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const r = requests.find(x => x.id === id);
    if(!r) return;
    r.status = 'បានបំប្លែង';
    const newPoId = window.PurchaseStore.nextId(purchaseOrders);
    purchaseOrders.push({
      id: newPoId,
      supplier: 'រង់ចាំចាត់តាំង',
      date: new Date().toISOString().slice(0, 10),
      expected: new Date().toISOString().slice(0, 10),
      total: 0,
      status: 'រង់ចាំការអនុម័ត',
      items: [ { name: r.item, qty: r.qty, price: 0 } ]
    });
    window.PurchaseStore.savePurchaseOrders(purchaseOrders);
    window.PurchaseStore.savePurchaseRequests(requests);
    notify(`សំណើត្រូវបានបំប្លែងទៅជា ${poCode(newPoId)}`);
    renderRequests();
    renderKpis();
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 4'));
  }

  renderKpis();
  renderRequests();
});
