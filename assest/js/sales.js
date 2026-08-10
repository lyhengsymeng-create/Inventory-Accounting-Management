document.addEventListener('DOMContentLoaded', function () {

  // ---------- Sample data (replace with API data later) ----------
  const catalog = [
    { name: 'អាវយឺតកប្បាស ពណ៌ខ្មៅ', price: 12.00 },
    { name: 'ស្បែកជើងកីឡា Size 41', price: 68.00 },
    { name: 'ក្រែមការពារថ្ងៃ SPF50', price: 18.50 },
    { name: 'កាសស្តាប់ត្រចៀក Bluetooth', price: 32.00 },
    { name: 'កាបូបស្ពាយ Canvas', price: 29.00 },
  ];

  // ---------- Customers (fixed data kept directly in this file — no localStorage) ----------
  // Kept identical to the Admin/Staff Customer Management list so names stay consistent.
  const customerList = [
    'រឹម​ ភារុន', 'វ៉េត សុជាតិ', 'ចាន់​ សារ៉ាក់', 'លីហេង ស៊ីម៉េង', 'វិទូ',
    'រឹម​ វីរះ', 'មករា', 'ចាន់ មិនា', 'សុ​ ផល', 'Walk-in'
  ];

 const sales = [
  { id: '1001', customer: 'រឹម​ ភារុន', date: '2026/07/14', items: 3, total: 86.00, status: 'paid' },
  { id: '1002', customer: 'Walk-in', date: '2026-07-14', items: 1, total: 12.00, status: 'paid' },
  { id: '1003', customer: 'វ៉េត សុជាតិ', date: '2026-07-13', items: 2, total: 100.00, status: 'unpaid' },
  { id: '1004', customer: 'ចាន់​ សារ៉ាក់', date: '2026-07-13', items: 4, total: 143.50, status: 'paid' },
  { id: '1005', customer: 'Walk-in', date: '2026-07-12', items: 1, total: 68.00, status: 'cancelled' },
  { id: '1006', customer: 'លីហេង ស៊ីម៉េង', date: '2026-07-12', items: 2, total: 50.50, status: 'paid' },
  { id: '1007', customer: 'វិទូ', date: '2026-07-11', items: 1, total: 32.00, status: 'unpaid' },

  { id: '1008', customer: 'រឹម​ វីរះ', date: '2026-07-11', items: 5, total: 210.00, status: 'paid' },
  { id: '1009', customer: 'មករា', date: '2026-07-10', items: 3, total: 75.50, status: 'paid' },
  { id: '1010', customer: 'Walk-in', date: '2026-07-10', items: 2, total: 45.00, status: 'cancelled' },
  { id: '1011', customer: 'ចាន់ មិនា', date: '2026-07-09', items: 6, total: 320.00, status: 'paid' },
  { id: '1012', customer: 'សុ​ ផល', date: '2026-07-09', items: 2, total: 95.00, status: 'unpaid' },
  { id: '1013', customer: 'រឹម​ ភារុន', date: '2026-07-08', items: 4, total: 180.50, status: 'paid' },
  { id: '1014', customer: 'Walk-in', date: '2026-07-08', items: 1, total: 25.00, status: 'paid' },
  { id: '1015', customer: 'វ៉េត សុជាតិ', date: '2026-07-07', items: 3, total: 120.00, status: 'cancelled' },

  { id: '1016', customer: 'ចាន់​ សារ៉ាក់', date: '2026-07-07', items: 2, total: 65.00, status: 'paid' },
  { id: '1017', customer: 'លីហេង ស៊ីម៉េង', date: '2026-07-06', items: 7, total: 350.00, status: 'paid' },
  { id: '1018', customer: 'Walk-in', date: '2026-07-06', items: 1, total: 18.50, status: 'unpaid' },
  { id: '1019', customer: 'វិទូ', date: '2026-07-05', items: 4, total: 220.00, status: 'paid' },
  { id: '1020', customer: 'រឹម​ វីរះ', date: '2026-07-05', items: 3, total: 90.00, status: 'paid' },
  { id: '1021', customer: 'Walk-in', date: '2026-07-04', items: 2, total: 40.00, status: 'cancelled' },
  { id: '1022', customer: 'មករា', date: '2026-07-04', items: 5, total: 275.00, status: 'paid' },
  { id: '1023', customer: 'ចាន់ មិនា', date: '2026-07-03', items: 1, total: 55.00, status: 'unpaid' },
  { id: '1024', customer: 'សុ​ ផល', date: '2026-07-03', items: 6, total: 410.00, status: 'paid' },

  { id: '1025', customer: 'Walk-in', date: '2026-07-02', items: 2, total: 35.00, status: 'paid' },
  { id: '1026', customer: 'រឹម​ ភារុន', date: '2026-07-02', items: 3, total: 150.00, status: 'paid' },
  { id: '1027', customer: 'វ៉េត សុជាតិ', date: '2026-07-01', items: 4, total: 185.50, status: 'unpaid' },
  { id: '1028', customer: 'Walk-in', date: '2026-07-01', items: 1, total: 22.00, status: 'paid' },
  { id: '1029', customer: 'ចាន់​ សារ៉ាក់', date: '2026-06-30', items: 5, total: 260.00, status: 'paid' },
  { id: '1030', customer: 'លីហេង ស៊ីម៉េង', date: '2026-06-30', items: 3, total: 130.00, status: 'cancelled' }
];

  // ---------- Online orders (written by the Customer shop's checkout, shared via localStorage) ----------
  const ONLINE_ORDERS_KEY = 'shopease_orders';
  function loadOnlineOrdersIntoSales() {
    let onlineOrders = [];
    try { onlineOrders = JSON.parse(localStorage.getItem(ONLINE_ORDERS_KEY)) || []; }
    catch (e) { onlineOrders = []; }

    // Remove any previously-merged online orders so re-loading doesn't duplicate them
    for (let i = sales.length - 1; i >= 0; i--) {
      if (sales[i].online) sales.splice(i, 1);
    }

    onlineOrders.slice().reverse().forEach(o => {
      sales.unshift({
        id: o.id,
        customer: o.customer || 'Online customer',
        date: (o.date || '').slice(0, 10),
        items: (o.items || []).reduce((n, it) => n + it.qty, 0),
        total: Number(o.total) || 0,
        status: o.status === 'Delivered' ? 'paid' : 'unpaid',
        online: true,
        fulfillment: o.status
      });
    });
  }
  loadOnlineOrdersIntoSales();
  window.addEventListener('storage', function (e) {
    if (e.key === ONLINE_ORDERS_KEY) {
      loadOnlineOrdersIntoSales();
      renderKpis();
      renderTable();
    }
  });

  const salesHistory = [
    { type: 'create', title: 'Invoice created — 1007', date: '11 Jul 2026, 3:40 PM', note: 'អតិថិជន ចាន់ថា • $32.00' },
    { type: 'paid', title: 'Payment received — 1006', date: '12 Jul 2026, 5:10 PM', note: 'បានទូទាត់ពេញលេញ $50.50' },
    { type: 'cancel', title: 'Sale cancelled — 1005', date: '12 Jul 2026, 6:00 PM', note: 'មូលហេតុ៖ Wrong item / pricing error' },
    { type: 'create', title: 'Invoice created — 1004', date: '13 Jul 2026, 11:00 AM', note: 'អតិថិជន ស្រីនាង • $143.50' },
    { type: 'paid', title: 'Payment received — 1001', date: '14 Jul 2026, 9:15 AM', note: 'បានទូទាត់ពេញលេញ $86.00' },
  ];

  const historyIcon = {
    create: { icon: 'bi-receipt', bg: '#ece9fb', color: 'var(--violet, #6b4fe0)' },
    paid:   { icon: 'bi-check-circle', bg: '#e6f2ef', color: '#1f4d43' },
    cancel: { icon: 'bi-x-circle', bg: '#fbe9e9', color: '#b23b3b' },
  };

  let invoiceLineCount = 0;

  // ---------- Helpers ----------
  function statusBadge(status) {
    if (status === 'paid') return '<span class="badge rounded-pill" style="background:#e6f2ef; color:#1f4d43;">បានទូទាត់</span>';
    if (status === 'unpaid') return '<span class="badge rounded-pill" style="background:#faf1e6; color:#c1793a;">មិនទាន់ទូទាត់</span>';
    return '<span class="badge rounded-pill" style="background:#fbe9e9; color:#b23b3b;">បានលុបចោល</span>';
  }

  function showToast(message) {
    document.getElementById('toastBody').textContent = message;
    new bootstrap.Toast(document.getElementById('liveToast')).show();
  }

  // ---------- Render KPI cards ----------
  function renderKpis() {
    const today = '2026-07-14';
    const todaySales = sales.filter(s => s.date === today && s.status !== 'cancelled');
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
    const unpaid = sales.filter(s => s.status === 'unpaid').length;
    const cancelled = sales.filter(s => s.status === 'cancelled').length;

    document.getElementById('kpiTodaySales').textContent = '$' + todayRevenue.toFixed(2);
    document.getElementById('kpiTodayInvoices').textContent = todaySales.length;
    document.getElementById('kpiUnpaid').textContent = unpaid;
    document.getElementById('kpiCancelled').textContent = cancelled;
  }

  // ---------- Render sales table ----------
  function renderTable() {
    const term = (document.getElementById('invoiceSearch').value || '').toLowerCase();
    const status = document.getElementById('statusFilter').value;

    const tbody = document.getElementById('salesTableBody');
    tbody.innerHTML = '';

    const filtered = sales.filter(s => {
      const matchesTerm = s.id.toLowerCase().includes(term) || s.customer.toLowerCase().includes(term);
      const matchesStatus = !status || s.status === status;
      return matchesTerm && matchesStatus;
    });

    filtered.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="fw-semibold">${s.id}</td>
        <td>${s.customer}${s.online ? ` <span class="badge bg-teal-subtle text-teal-emphasis" style="background:#e1f5ee;color:#0f6e56;">Online · ${s.fulfillment}</span>` : ''}</td>
        <td><small>${s.date}</small></td>
        <td>${s.items}</td>
        <td>$${s.total.toFixed(2)}</td>
        <td>${statusBadge(s.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-light border rounded-3 me-1 view-row-btn" data-id="${s.id}" title="View" data-bs-toggle="modal" data-bs-target="#viewInvoiceModal"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-light border rounded-3 me-1 print-row-btn" data-id="${s.id}" title="Print" data-bs-toggle="modal" data-bs-target="#printReceiptModal"><i class="bi bi-printer"></i></button>
          ${s.status !== 'cancelled' ? `<button class="btn btn-sm btn-light border rounded-3 cancel-row-btn" data-id="${s.id}" title="Cancel" data-bs-toggle="modal" data-bs-target="#cancelSalesModal"><i class="bi bi-x-lg"></i></button>` : ''}
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('visibleCount').textContent = filtered.length;
    document.getElementById('totalCount').textContent = sales.length;
  }

  // ---------- Invoice builder (Create Sales Invoice modal) ----------
  function addInvoiceLine() {
    invoiceLineCount++;
    const rowId = 'line-' + invoiceLineCount;
    const options = catalog.map(c => `<option value="${c.price}">${c.name}</option>`).join('');
    const tr = document.createElement('tr');
    tr.id = rowId;
    tr.innerHTML = `
      <td><select class="form-select form-select-sm line-item">${options}</select></td>
      <td><input type="number" class="form-control form-control-sm line-qty" value="1" min="1" style="width:70px;"></td>
      <td class="line-price">$${catalog[0].price.toFixed(2)}</td>
      <td class="line-subtotal fw-semibold">$${catalog[0].price.toFixed(2)}</td>
      <td><button type="button" class="btn btn-sm btn-light border rounded-3 remove-line-btn"><i class="bi bi-trash"></i></button></td>
    `;
    document.getElementById('invoiceItemsBody').appendChild(tr);
    recalcInvoice();
  }

  function recalcInvoice() {
    let subtotal = 0;
    document.querySelectorAll('#invoiceItemsBody tr').forEach(row => {
      const price = parseFloat(row.querySelector('.line-item').value);
      const qty = parseInt(row.querySelector('.line-qty').value, 10) || 0;
      const lineTotal = price * qty;
      row.querySelector('.line-price').textContent = '$' + price.toFixed(2);
      row.querySelector('.line-subtotal').textContent = '$' + lineTotal.toFixed(2);
      subtotal += lineTotal;
    });
    document.getElementById('invoiceSubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('invoiceTotal').textContent = '$' + subtotal.toFixed(2);
  }

  document.getElementById('addInvoiceLineBtn').addEventListener('click', addInvoiceLine);

  document.getElementById('invoiceItemsBody').addEventListener('change', function (e) {
    if (e.target.classList.contains('line-item') || e.target.classList.contains('line-qty')) recalcInvoice();
  });

  document.getElementById('invoiceItemsBody').addEventListener('click', function (e) {
    if (e.target.closest('.remove-line-btn')) {
      e.target.closest('tr').remove();
      recalcInvoice();
    }
  });

  document.getElementById('createInvoiceModal').addEventListener('shown.bs.modal', function () {
    if (document.getElementById('invoiceItemsBody').children.length === 0) addInvoiceLine();
    const customerSelect = document.getElementById('invoiceCustomerSelect');
    if (customerSelect && !customerSelect.dataset.populated) {
      customerSelect.innerHTML = customerList.map(name => `<option value="${name}">${name}</option>`).join('');
      customerSelect.dataset.populated = '1';
    }
    const dateInput = document.getElementById('invoiceDateInput');
    if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
  });

  document.getElementById('saveInvoiceBtn').addEventListener('click', function () {
    const customerSelect = document.getElementById('invoiceCustomerSelect');
    const dateInput = document.getElementById('invoiceDateInput');
    const rows = document.querySelectorAll('#invoiceItemsBody tr');

    let itemCount = 0;
    let total = 0;
    rows.forEach(row => {
      const price = parseFloat(row.querySelector('.line-item').value) || 0;
      const qty = parseInt(row.querySelector('.line-qty').value, 10) || 0;
      itemCount += qty;
      total += price * qty;
    });

    const newSale = {
      id: String(1000 + sales.length + 1),
      customer: customerSelect ? customerSelect.value : 'Walk-in',
      date: (dateInput && dateInput.value) || new Date().toISOString().slice(0, 10),
      items: itemCount,
      total: +total.toFixed(2),
      status: 'unpaid'
    };
    sales.unshift(newSale);

    // Reset the form for next time
    document.getElementById('invoiceItemsBody').innerHTML = '';
    if (customerSelect) customerSelect.selectedIndex = 0;
    if (dateInput) dateInput.value = '';

    renderKpis();
    renderTable();

    bootstrap.Modal.getInstance(document.getElementById('createInvoiceModal')).hide();
    showToast('Invoice created successfully');
  });

  // ---------- Print Receipt modal ----------
  function populatePrintSelect() {
    const select = document.getElementById('printInvoiceSelect');
    select.innerHTML = sales.map(s => `<option value="${s.id}">${s.id} — ${s.customer} ($${s.total.toFixed(2)})</option>`).join('');
    renderReceiptPreview(select.value);
  }

  function renderReceiptPreview(invoiceId) {
    const s = sales.find(x => x.id === invoiceId) || sales[0];
    document.getElementById('receiptBody').innerHTML = `
      <div class="d-flex justify-content-between"><span>Invoice</span><span class="fw-semibold">${s.id}</span></div>
      <div class="d-flex justify-content-between"><span>Customer</span><span>${s.customer}</span></div>
      <div class="d-flex justify-content-between"><span>Date</span><span>${s.date}</span></div>
      <div class="d-flex justify-content-between"><span>Items</span><span>${s.items}</span></div>
      <div class="d-flex justify-content-between fw-bold mt-2"><span>Total</span><span>$${s.total.toFixed(2)}</span></div>
    `;
  }

  document.getElementById('printInvoiceSelect').addEventListener('change', function () {
    renderReceiptPreview(this.value);
  });

  document.getElementById('confirmPrintBtn').addEventListener('click', function () {
    bootstrap.Modal.getInstance(document.getElementById('printReceiptModal')).hide();
    showToast('Receipt sent to printer');
    // TODO: trigger window.print() or a dedicated print template
  });

  // ---------- View Invoice modal ----------
  function renderViewInvoice(invoiceId) {
    const s = sales.find(x => x.id === invoiceId);
    if (!s) return;
    document.getElementById('viewInvId').textContent = s.id;
    const statusEl = document.getElementById('viewInvStatus');
    statusEl.outerHTML = statusBadge(s.status).replace('<span', '<span id="viewInvStatus"');
    document.getElementById('viewInvCustomer').textContent = s.customer + (s.online ? ` (Online · ${s.fulfillment})` : '');
    document.getElementById('viewInvDate').textContent = s.date;
    document.getElementById('viewInvItems').textContent = s.items;
    document.getElementById('viewInvTotal').textContent = '$' + s.total.toFixed(2);
  }

  document.getElementById('salesTableBody').addEventListener('click', function (e) {
    const viewBtn = e.target.closest('.view-row-btn');
    if (viewBtn) renderViewInvoice(viewBtn.dataset.id);
  });

  // ---------- Cancel Sales modal ----------
  function populateCancelSelect() {
    const select = document.getElementById('cancelInvoiceSelect');
    select.innerHTML = sales.filter(s => s.status !== 'cancelled')
      .map(s => `<option value="${s.id}">${s.id} — ${s.customer} ($${s.total.toFixed(2)})</option>`).join('');
  }

  document.getElementById('confirmCancelSaleBtn').addEventListener('click', function () {
    bootstrap.Modal.getInstance(document.getElementById('cancelSalesModal')).hide();
    showToast('Sale cancelled and stock restored');
    // TODO: set matching sale's status to 'cancelled', then renderTable()/renderKpis()
  });

  // ---------- Sales History modal ----------
  function renderHistory() {
    const list = document.getElementById('salesHistoryList');
    list.innerHTML = salesHistory.map(h => {
      const cfg = historyIcon[h.type];
      return `
        <div class="d-flex gap-3 pb-2 border-bottom">
          <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width:34px; height:34px; background:${cfg.bg}; color:${cfg.color};">
            <i class="bi ${cfg.icon}"></i>
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <span class="fw-semibold small">${h.title}</span>
              <span class="text-secondary" style="font-size:.75rem;">${h.date}</span>
            </div>
            <p class="km text-secondary mb-0" style="font-size:.8rem;">${h.note}</p>
          </div>
        </div>`;
    }).join('');
  }

  // ---------- Wire up table filters ----------
  document.getElementById('invoiceSearch').addEventListener('input', renderTable);
  document.getElementById('statusFilter').addEventListener('change', renderTable);

  // ---------- Modal show events to (re)populate dynamic content ----------
  document.getElementById('printReceiptModal').addEventListener('show.bs.modal', populatePrintSelect);
  document.getElementById('cancelSalesModal').addEventListener('show.bs.modal', populateCancelSelect);

  // ---------- Initial render ----------
  renderKpis();
  renderTable();
  renderHistory();
});