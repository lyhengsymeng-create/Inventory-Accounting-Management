/* ============================================================
   Staff Dashboard — ShopEase Online KPI cards + storefront
   (SharedStore) low-stock panel. Kept separate from the existing
   grocery/POS inventory widgets, since they're different catalogs.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof SharedStore === 'undefined') return;

  const ordersTodayEl = document.getElementById('kpiOnlineOrdersToday');
  const revenueTodayEl = document.getElementById('kpiOnlineRevenueToday');
  const pendingEl = document.getElementById('kpiOnlinePendingOrders');
  const openTicketsEl = document.getElementById('kpiOpenTickets');
  const lowStockGrid = document.getElementById('onlineLowStockAlertGrid');
  const lowStockCountLabel = document.getElementById('onlineLowStockCountLabel');

  if (!ordersTodayEl && !lowStockGrid) return; // not on the Dashboard tab

  const ONLINE_LOW_STOCK_THRESHOLD = 10;

  function isToday(iso) {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }

  function renderKpis() {
    const orders = SharedStore.getOrders().filter(o => o.source === 'online');
    const todays = orders.filter(o => isToday(o.createdAt));
    const pending = orders.filter(o => o.status === 'pending');
    const revenueToday = todays.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    if (ordersTodayEl) ordersTodayEl.textContent = todays.length;
    if (revenueTodayEl) revenueTodayEl.textContent = `$${revenueToday.toFixed(2)}`;
    if (pendingEl) pendingEl.textContent = pending.length;

    if (openTicketsEl && typeof SharedStore.getTickets === 'function') {
      const openTickets = SharedStore.getTickets().filter(t => t.status === 'open').length;
      openTicketsEl.textContent = openTickets;
    }
  }

  function renderOnlineLowStock() {
    if (!lowStockGrid) return;
    const products = SharedStore.getProducts()
      .filter(p => typeof p.stockLeft === 'number' && p.stockLeft <= ONLINE_LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.stockLeft - b.stockLeft)
      .slice(0, 8);

    if (lowStockCountLabel) lowStockCountLabel.textContent = `${products.length} ធាតុត្រូវការជាបន្ទាន់`;

    if (products.length === 0) {
      lowStockGrid.innerHTML = `<div class="col-12 text-center text-muted small km py-3">គ្មានទំនិញអនឡាញជិតអស់ស្តុកនាពេលនេះទេ 🎉</div>`;
      return;
    }

    lowStockGrid.innerHTML = products.map(p => {
      const isCritical = p.stockLeft <= 5;
      const pct = Math.max(4, Math.min(100, Math.round((p.stockLeft / ONLINE_LOW_STOCK_THRESHOLD) * 100)));
      const badgeClass = isCritical ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning';
      const barClass = isCritical ? 'bg-danger' : 'bg-warning';
      const numClass = isCritical ? 'text-danger' : 'text-warning';
      const label = isCritical ? 'Critical' : 'Low';
      return `
        <div class="col-md-6 col-xl-3">
          <div class="border rounded-3 p-3 h-100">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="small fw-semibold">${p.name}</div>
              <span class="badge ${badgeClass} rounded-pill">${label}</span>
            </div>
            <div class="progress mb-1" style="height:6px;">
              <div class="progress-bar ${barClass}" style="width:${pct}%"></div>
            </div>
            <div class="km text-secondary small">នៅសល់ <b class="${numClass}">${p.stockLeft}</b> ឯកតា</div>
          </div>
        </div>`;
    }).join('');
  }

  function renderAll() {
    renderKpis();
    renderOnlineLowStock();
  }

  renderAll();
  SharedStore.onChange(() => renderAll());

  // refresh whenever Staff comes back to the Dashboard tab
  const dashboardLink = document.querySelector('.sidebar .nav-link[data-tab="Dashboard"]');
  if (dashboardLink) dashboardLink.addEventListener('click', renderAll);
});
