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

  /* ---------------- Shared Purchase Orders (persisted via PurchaseStore) ---------------- */
  let purchaseOrders = window.PurchaseStore.getPurchaseOrders();
  let poItemCount = 0;

  const poItemsBody = document.getElementById('poItemsBody');

  /* ---------------- KPIs ---------------- */
  function renderKpis(){
    document.getElementById('kpiTotalPO').textContent = purchaseOrders.length;
    document.getElementById('kpiPending').textContent = purchaseOrders.filter(p => p.status === 'រង់ចាំការអនុម័ត').length;
    document.getElementById('kpiReceived').textContent = purchaseOrders.filter(p => p.status === 'បានទទួល').length;
    document.getElementById('kpiSpend').textContent = fmt(purchaseOrders.reduce((s, p) => s + p.total, 0));
  }

  /* ---------------- Create PO: line items ---------------- */
  function addPoItemRow(){
    poItemCount++;
    const rowId = poItemCount;
    const tr = document.createElement('tr');
    tr.className = 'po-item-row';
    tr.dataset.rowId = rowId;
    tr.innerHTML = `
      <td><input type="text" class="form-control form-control-sm rounded-3" placeholder="Item name" data-field="name"></td>
      <td style="width:90px;"><input type="number" min="1" value="1" class="form-control form-control-sm rounded-3" data-field="qty"></td>
      <td style="width:120px;"><input type="number" min="0" step="0.01" value="0" class="form-control form-control-sm rounded-3" data-field="price"></td>
      <td class="small fw-semibold line-total">$0.00</td>
      <td><button type="button" class="btn btn-sm btn-light border rounded-3 text-danger" data-action="remove-item"><i class="bi bi-trash"></i></button></td>`;
    poItemsBody.appendChild(tr);
  }

  function recalcPoTotal(){
    let grand = 0;
    poItemsBody.querySelectorAll('.po-item-row').forEach(row => {
      const qty = parseFloat(row.querySelector('[data-field="qty"]').value) || 0;
      const price = parseFloat(row.querySelector('[data-field="price"]').value) || 0;
      const lineTotal = qty * price;
      row.querySelector('.line-total').textContent = fmt(lineTotal);
      grand += lineTotal;
    });
    document.getElementById('poGrandTotal').textContent = fmt(grand);
    return grand;
  }

  poItemsBody.addEventListener('input', recalcPoTotal);
  poItemsBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="remove-item"]');
    if(!btn) return;
    btn.closest('tr').remove();
    recalcPoTotal();
  });

  document.getElementById('addPoItemBtn').addEventListener('click', addPoItemRow);

  document.getElementById('submitPoBtn').addEventListener('click', () => {
    const supplier = document.getElementById('poSupplier').value;
    const date = document.getElementById('poDate').value || new Date().toISOString().slice(0, 10);
    const expected = document.getElementById('poExpected').value || date;
    const rows = poItemsBody.querySelectorAll('.po-item-row');

    if(rows.length === 0){
      notify('សូមបន្ថែមធាតុយ៉ាងតិចមួយមុននឹងដាក់ស្នើ');
      return;
    }
    const total = recalcPoTotal();
    if(total <= 0){
      notify('សរុបការបញ្ជាទិញត្រូវតែធំជាងសូន្យ');
      return;
    }

    const items = Array.from(rows).map(row => ({
      name: row.querySelector('[data-field="name"]').value.trim() || 'ធាតុគ្មានឈ្មោះ',
      qty: parseFloat(row.querySelector('[data-field="qty"]').value) || 0,
      price: parseFloat(row.querySelector('[data-field="price"]').value) || 0
    }));

    const newId = window.PurchaseStore.nextId(purchaseOrders);
    purchaseOrders.push({ id: newId, supplier, date, expected, total, status: 'រង់ចាំការអនុម័ត', items });
    window.PurchaseStore.savePurchaseOrders(purchaseOrders);
    notify(`${poCode(newId)} បានដាក់ស្នើសុំការអនុម័ត`);

    poItemsBody.innerHTML = '';
    document.getElementById('poGrandTotal').textContent = '$0.00';
    addPoItemRow();
    renderKpis();
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('អ្នកមានការជូនដំណឹងថ្មី 4'));
  }

  addPoItemRow();
  addPoItemRow();
  recalcPoTotal();
  renderKpis();
});
