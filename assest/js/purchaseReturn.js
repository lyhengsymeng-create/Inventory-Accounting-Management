
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
      'បានអនុម័ត': 'bg-primary-subtle text-primary',
      'បានបដិសេធ': 'bg-danger-subtle text-danger',
      'រង់ចាំ': 'bg-warning-subtle text-warning-emphasis'
    };
    return `<span class="badge rounded-pill status-pill ${map[status] || 'bg-secondary-subtle text-secondary'}">${status}</span>`;
  }

  /* ---------------- Shared Purchase Orders (received only, for return source) ---------------- */
  let purchaseOrders = window.PurchaseStore.getPurchaseOrders();

  /* ---------------- Shared Purchase Returns (persisted via PurchaseStore) ---------------- */
  let returns = window.PurchaseStore.getPurchaseReturns();

  const returnTableBody = document.getElementById('returnTableBody');
  const retPO = document.getElementById('retPO');

  function retCode(n){ return 'RET-' + String(n).padStart(4, '0'); }

  function populateRetPO(){
    const received = purchaseOrders.filter(p => p.status === 'បានទទួល');
    retPO.innerHTML = received.map(p => `<option value="${p.id}">${poCode(p.id)} — ${p.supplier}</option>`).join('')
      || `<option value="">មិនមានការបញ្ជាទិញដែលទទួលរួច</option>`;
    populateRetItems();
  }

  function populateRetItems(){
    const retItem = document.getElementById('retItem');
    const po = purchaseOrders.find(p => p.id === Number(retPO.value));
    const items = (po && po.items) || [];
    retItem.innerHTML = items.map((it, idx) => `<option value="${idx}" data-price="${it.price}" data-max="${it.qty}">${it.name} (បញ្ជាទិញ ${it.qty})</option>`).join('')
      || `<option value="">—</option>`;
    syncRetQtyMax();
  }

  function syncRetQtyMax(){
    const retItem = document.getElementById('retItem');
    const retQty = document.getElementById('retQty');
    const opt = retItem.selectedOptions[0];
    retQty.max = opt ? opt.dataset.max || '' : '';
  }

  retPO.addEventListener('change', populateRetItems);
  document.getElementById('retItem').addEventListener('change', syncRetQtyMax);

  function renderReturnKpis(){
    document.getElementById('kpiRetTotal').textContent = returns.length;
    document.getElementById('kpiRetPending').textContent = returns.filter(r => r.status === 'រង់ចាំ').length;
    document.getElementById('kpiRetApproved').textContent = returns.filter(r => r.status === 'បានអនុម័ត').length;
    const value = returns.reduce((s, r) => s + (r.qty * (r.price || 0)), 0);
    document.getElementById('kpiRetValue').textContent = fmt(value);
  }

  function renderReturns(){
    renderReturnKpis();
    returnTableBody.innerHTML = '';
    if(returns.length === 0){
      returnTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-secondary py-4">No returns yet</td></tr>`;
      return;
    }
    returns.slice().sort((a, b) => b.id - a.id).forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="small fw-semibold">${retCode(r.id)}</td>
        <td class="small">${poCode(r.poId)}</td>
        <td class="small">${r.item}</td>
        <td class="small">${r.qty}</td>
        <td class="small fw-semibold">${fmt(r.qty * (r.price || 0))}</td>
        <td class="small">${r.reason}</td>
        <td>${statusBadge(r.status)}</td>
        <td class="text-end">
          ${r.status === 'រង់ចាំ' ? `
            <div class="d-flex justify-content-end gap-1">
              <button class="btn btn-sm rounded-3 text-white" style="background:#1f4d43;" data-action="ret-approve" data-id="${r.id}"><i class="bi bi-check-lg"></i> Approve</button>
              <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="ret-reject" data-id="${r.id}"><i class="bi bi-x-lg"></i> Reject</button>
            </div>` : `<span class="text-secondary small">—</span>`}
        </td>`;
      returnTableBody.appendChild(tr);
    });
  }

  document.getElementById('addReturnBtn').addEventListener('click', () => {
    const poId = Number(retPO.value);
    const retItem = document.getElementById('retItem');
    const opt = retItem.selectedOptions[0];
    const qty = parseInt(document.getElementById('retQty').value, 10) || 0;
    const reason = document.getElementById('retReason').value;
    if(!poId || !opt || !opt.value === ''){
      notify('សូមជ្រើសរើសការបញ្ជាទិញ និងទំនិញ');
      return;
    }
    if(qty <= 0){
      notify('សូមបញ្ចូលបរិមាណត្រឡប់');
      return;
    }
    const max = Number(opt.dataset.max || 0);
    if(max && qty > max){
      notify(`បរិមាណត្រឡប់មិនអាចលើសពី ${max} ដែលបានបញ្ជាទិញទេ`);
      return;
    }
    const newRetId = window.PurchaseStore.nextId(returns);
    returns.push({
      id: newRetId,
      poId,
      item: opt.textContent.replace(/\s*\(បញ្ជាទិញ.*\)$/, ''),
      qty,
      price: Number(opt.dataset.price || 0),
      reason,
      status: 'រង់ចាំ'
    });
    window.PurchaseStore.savePurchaseReturns(returns);
    document.getElementById('retQty').value = '';
    notify(`${retCode(newRetId)} បានដាក់ស្នើសុំត្រឡប់`);
    renderReturns();
  });

  returnTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const r = returns.find(x => x.id === id);
    if(!r) return;
    if(btn.dataset.action === 'ret-approve'){
      r.status = 'បានអនុម័ត';
      notify(`${retCode(r.id)} បានអនុម័ត`);
    } else {
      r.status = 'បានបដិសេធ';
      notify(`${retCode(r.id)} បានបដិសេធ`);
    }
    window.PurchaseStore.savePurchaseReturns(returns);
    renderReturns();
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 4'));
  }

  populateRetPO();
  renderReturns();
});
