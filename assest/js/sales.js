document.addEventListener('DOMContentLoaded', function () {
  const catalog = [
    { name: 'អាវយឺតកប្បាស ពណ៌ខ្មៅ', price: 12.00 },
    { name: 'ស្បែកជើងកីឡា Size 41', price: 68.00 },
    { name: 'ក្រែមការពារថ្ងៃ SPF50', price: 18.50 },
    { name: 'កាសស្តាប់ត្រចៀក Bluetooth', price: 32.00 },
    { name: 'កាបូបស្ពាយ Canvas', price: 29.00 },
  ];

  const customerList = [
    'រឹម​ ភារុន', 'វ៉េត សុជាតិ', 'ចាន់​ សារ៉ាក់', 'លីហេង ស៊ីម៉េង', 'វិទូ',
    'រឹម​ វីរះ', 'មករា', 'ចាន់ មិនា', 'សុ​ ផល', 'Walk-in'
  ];

 const sales = [
    { id: 'ORD-0101', customer: 'LyHeng Symeng', date: '2026-08-09', items: 2, total: 92.49, status: 'paid', online: true, fulfillment: 'pending', products: [{ name: 'Smart Watch Series 5', qty: 2, price: 46.24 }] },
  { id: 'ORD-0102', customer: 'សុខា', date: '2026-08-08', items: 1, total: 59.99, status: 'cancelled', online: true, fulfillment: 'cancelled', products: [{ name: 'Wireless Headphones', qty: 1, price: 59.99 }] },
  { id: 'ORD-0103', customer: 'ដារា', date: '2026-08-07', items: 3, total: 149.97, status: 'paid', online: true, fulfillment: 'shipped', products: [{ name: 'Travel Backpack', qty: 3, price: 49.99 }] },
  { id: 'ORD-0104', customer: 'ស្រីនាង', date: '2026-08-06', items: 2, total: 79.98, status: 'paid', online: true, fulfillment: 'delivered', products: [{ name: 'Digital Camera', qty: 2, price: 39.99 }] },
  { id: 'ORD-0105', customer: 'វិសាល', date: '2026-08-05', items: 1, total: 129.99, status: 'paid', online: true, fulfillment: 'delivered', products: [{ name: 'Classic Sunglasses', qty: 1, price: 129.99 }] },
  { id: 'ORD-0106', customer: 'មាលី', date: '2026-08-04', items: 4, total: 210.50, status: 'cancelled', online: true, fulfillment: 'cancelled', products: [{ name: 'Bluetooth Speaker', qty: 4, price: 52.63 }] },
  { id: 'ORD-0107', customer: 'ចាន់ថា', date: '2026-08-03', items: 2, total: 44.98, status: 'paid', online: true, fulfillment: 'delivered', products: [{ name: 'Running Shoes', qty: 2, price: 22.49 }] },

  { id: '1001', customer: 'រឹម​ ភារុន', date: '2026/07/14', items: 3, total: 86.00, status: 'paid', products: [{ name: 'អាវយឺតកប្បាស ពណ៌ខ្មៅ', qty: 3, price: 28.67 }] },
  { id: '1002', customer: 'Walk-in', date: '2026-07-14', items: 1, total: 12.00, status: 'paid', products: [{ name: 'ស្បែកជើងកីឡា Size 41', qty: 1, price: 12 }] },
  { id: '1003', customer: 'វ៉ែត សុជាតិ', date: '2026-07-13', items: 2, total: 100.00, status: 'unpaid', products: [{ name: 'ក្រែមការពារថ្ងៃ SPF50', qty: 2, price: 50 }] },
  { id: '1004', customer: 'ចាន់​ សារ៉ាក់', date: '2026-07-13', items: 4, total: 143.50, status: 'paid', products: [{ name: 'កាសស្តាប់ត្រចៀក Bluetooth', qty: 4, price: 35.88 }] },
  { id: '1005', customer: 'Walk-in', date: '2026-07-12', items: 1, total: 68.00, status: 'cancelled', products: [{ name: 'កាបូបស្ពាយ Canvas', qty: 1, price: 68 }] },
  { id: '1006', customer: 'លីហេង ស៊ីម៉េង', date: '2026-07-12', items: 2, total: 50.50, status: 'paid', products: [{ name: 'នាឡិកាដៃ Digital', qty: 2, price: 25.25 }] },
  { id: '1007', customer: 'វិទូ', date: '2026-07-11', items: 1, total: 32.00, status: 'unpaid', products: [{ name: 'ខោខូវប៊យ Denim', qty: 1, price: 32 }] },

  { id: '1008', customer: 'រឹម​ វីរះ', date: '2026-07-11', items: 5, total: 210.00, status: 'paid', products: [{ name: 'ដបទឹកអាលុយមីញ៉ូម', qty: 5, price: 42 }] },
  { id: '1009', customer: 'មករា', date: '2026-07-10', items: 3, total: 75.50, status: 'paid', products: [{ name: 'អាវយឺតកប្បាស ពណ៌ខ្មៅ', qty: 3, price: 25.17 }] },
  { id: '1010', customer: 'Walk-in', date: '2026-07-10', items: 2, total: 45.00, status: 'cancelled', products: [{ name: 'ស្បែកជើងកីឡា Size 41', qty: 2, price: 22.5 }] },
  { id: '1011', customer: 'ចាន់ មិនា', date: '2026-07-09', items: 6, total: 320.00, status: 'paid', products: [{ name: 'ក្រែមការពារថ្ងៃ SPF50', qty: 6, price: 53.33 }] },
  { id: '1012', customer: 'សុ​ ផល', date: '2026-07-09', items: 2, total: 95.00, status: 'unpaid', products: [{ name: 'កាសស្តាប់ត្រចៀក Bluetooth', qty: 2, price: 47.5 }] },
  { id: '1013', customer: 'រឹម​ ភារុន', date: '2026-07-08', items: 4, total: 180.50, status: 'paid', products: [{ name: 'កាបូបស្ពាយ Canvas', qty: 4, price: 45.13 }] },
  { id: '1014', customer: 'Walk-in', date: '2026-07-08', items: 1, total: 25.00, status: 'paid', products: [{ name: 'នាឡិកាដៃ Digital', qty: 1, price: 25 }] },
  { id: '1015', customer: 'វ៉េត សុជាតិ', date: '2026-07-07', items: 3, total: 120.00, status: 'cancelled', products: [{ name: 'ខោខូវប៊យ Denim', qty: 3, price: 40 }] },

  { id: '1016', customer: 'ចាន់​ សារ៉ាក់', date: '2026-07-07', items: 2, total: 65.00, status: 'paid', products: [{ name: 'ដបទឹកអាលុយមីញ៉ូម', qty: 2, price: 32.5 }] },
  { id: '1017', customer: 'លីហេង ស៊ីម៉េង', date: '2026-07-06', items: 7, total: 350.00, status: 'paid', products: [{ name: 'អាវយឺតកប្បាស ពណ៌ខ្មៅ', qty: 7, price: 50 }] },
  { id: '1018', customer: 'Walk-in', date: '2026-07-06', items: 1, total: 18.50, status: 'unpaid', products: [{ name: 'ស្បែកជើងកីឡា Size 41', qty: 1, price: 18.5 }] },
  { id: '1019', customer: 'វិទូ', date: '2026-07-05', items: 4, total: 220.00, status: 'paid', products: [{ name: 'ក្រែមការពារថ្ងៃ SPF50', qty: 4, price: 55 }] },
  { id: '1020', customer: 'រឹម​ វីរះ', date: '2026-07-05', items: 3, total: 90.00, status: 'paid', products: [{ name: 'កាសស្តាប់ត្រចៀក Bluetooth', qty: 3, price: 30 }] },
  { id: '1021', customer: 'Walk-in', date: '2026-07-04', items: 2, total: 40.00, status: 'cancelled', products: [{ name: 'កាបូបស្ពាយ Canvas', qty: 2, price: 20 }] },
  { id: '1022', customer: 'មករា', date: '2026-07-04', items: 5, total: 275.00, status: 'paid', products: [{ name: 'នាឡិកាដៃ Digital', qty: 5, price: 55 }] },
  { id: '1023', customer: 'ចាន់ មិនា', date: '2026-07-03', items: 1, total: 55.00, status: 'unpaid', products: [{ name: 'ខោខូវប៊យ Denim', qty: 1, price: 55 }] },
  { id: '1024', customer: 'សុ​ ផល', date: '2026-07-03', items: 6, total: 410.00, status: 'paid', products: [{ name: 'ដបទឹកអាលុយមីញ៉ូម', qty: 6, price: 68.33 }] },

  { id: '1025', customer: 'Walk-in', date: '2026-07-02', items: 2, total: 35.00, status: 'paid', products: [{ name: 'អាវយឺតកប្បាស ពណ៌ខ្មៅ', qty: 2, price: 17.5 }] },
  { id: '1026', customer: 'រឹម​ ភារុន', date: '2026-07-02', items: 3, total: 150.00, status: 'paid', products: [{ name: 'ស្បែកជើងកីឡា Size 41', qty: 3, price: 50 }] },
  { id: '1027', customer: 'វ៉េត សុជាតិ', date: '2026-07-01', items: 4, total: 185.50, status: 'unpaid', products: [{ name: 'ក្រែមការពារថ្ងៃ SPF50', qty: 4, price: 46.38 }] },
  { id: '1028', customer: 'Walk-in', date: '2026-07-01', items: 1, total: 22.00, status: 'paid', products: [{ name: 'កាសស្តាប់ត្រចៀក Bluetooth', qty: 1, price: 22 }] },
  { id: '1029', customer: 'ចាន់​ សារ៉ាក់', date: '2026-06-30', items: 5, total: 260.00, status: 'paid', products: [{ name: 'កាបូបស្ពាយ Canvas', qty: 5, price: 52 }] },
  { id: '1030', customer: 'លីហេង ស៊ីម៉េង', date: '2026-06-30', items: 3, total: 130.00, status: 'cancelled', products: [{ name: 'នាឡិកាដៃ Digital', qty: 3, price: 43.33 }] }
];

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

  function statusBadge(status) {
    if (status === 'paid') return '<span class="badge rounded-pill" style="background:#e6f2ef; color:#1f4d43;">បានទូទាត់</span>';
    if (status === 'unpaid') return '<span class="badge rounded-pill" style="background:#faf1e6; color:#c1793a;">មិនទាន់ទូទាត់</span>';
    return '<span class="badge rounded-pill" style="background:#fbe9e9; color:#b23b3b;">បានលុបចោល</span>';
  }

  function showToast(message) {
    document.getElementById('toastBody').textContent = message;
    new bootstrap.Toast(document.getElementById('liveToast')).show();
  }

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

    document.getElementById('invoiceItemsBody').innerHTML = '';
    if (customerSelect) customerSelect.selectedIndex = 0;
    if (dateInput) dateInput.value = '';

    renderKpis();
    renderTable();

    bootstrap.Modal.getInstance(document.getElementById('createInvoiceModal')).hide();
    showToast('Invoice created successfully');
  });

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
  });

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

    const productsBody = document.getElementById('viewInvProductsBody');
    if (productsBody) {
      const lines = s.products || [];
      productsBody.innerHTML = lines.length
        ? lines.map(p => `
            <tr>
              <td>${p.name}</td>
              <td class="text-center">${p.qty}</td>
              <td class="text-end">$${Number(p.price).toFixed(2)}</td>
              <td class="text-end fw-semibold">$${(p.qty * p.price).toFixed(2)}</td>
            </tr>`).join('')
        : `<tr><td colspan="4" class="text-center text-secondary small py-2">No product detail available</td></tr>`;
    }
  }

  document.getElementById('salesTableBody').addEventListener('click', function (e) {
    const viewBtn = e.target.closest('.view-row-btn');
    if (viewBtn) renderViewInvoice(viewBtn.dataset.id);
  });

  function populateCancelSelect() {
    const select = document.getElementById('cancelInvoiceSelect');
    select.innerHTML = sales.filter(s => s.status !== 'cancelled')
      .map(s => `<option value="${s.id}">${s.id} — ${s.customer} ($${s.total.toFixed(2)})</option>`).join('');
  }

  document.getElementById('confirmCancelSaleBtn').addEventListener('click', function () {
    bootstrap.Modal.getInstance(document.getElementById('cancelSalesModal')).hide();
    showToast('Sale cancelled and stock restored');
  });

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

  document.getElementById('invoiceSearch').addEventListener('input', renderTable);
  document.getElementById('statusFilter').addEventListener('change', renderTable);

  document.getElementById('printReceiptModal').addEventListener('show.bs.modal', populatePrintSelect);
  document.getElementById('cancelSalesModal').addEventListener('show.bs.modal', populateCancelSelect);

  renderKpis();
  renderTable();
  renderHistory();
});