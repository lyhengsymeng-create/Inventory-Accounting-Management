document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('onlineOrdersTbody');
  const emptyMsg = document.getElementById('onlineOrdersEmpty');
  const sidebarBadge = document.getElementById('sidebarOnlineOrdersBadge');
  const sidebarLink = document.querySelector('.sidebar .nav-link[data-tab="online_orders"]');
  const statusFilter = document.getElementById('onlineOrderStatusFilter');
  const searchInput = document.getElementById('onlineOrderSearch');

  if (!tbody || typeof SharedStore === 'undefined') return;

  const STATUS_LABEL = {
    pending: 'កំពុងរង់ចាំ',
    processing: 'កំពុងរៀបចំ',
    shipped: 'កំពុងដឹកជញ្ជូន',
    delivered: 'បានដឹកជញ្ជូន',
    cancelled: 'បានលុបចោល'
  };
  const STATUS_BADGE = {
    pending: 'bg-warning-subtle text-warning-emphasis',
    processing: 'bg-info-subtle text-info-emphasis',
    shipped: 'bg-primary-subtle text-primary-emphasis',
    delivered: 'bg-success-subtle text-success',
    cancelled: 'bg-danger-subtle text-danger'
  };
  const NEXT_STATUS = { pending: 'processing', processing: 'shipped', shipped: 'delivered' };

  // Refresh whenever Staff opens this tab from the sidebar
  if (sidebarLink) sidebarLink.addEventListener('click', renderOnlineOrders);
  if (statusFilter) statusFilter.addEventListener('change', renderOnlineOrders);
  if (searchInput) searchInput.addEventListener('input', renderOnlineOrders);

  function renderOnlineOrders() {
    const orders = SharedStore.getOrders().filter(o => o.source === 'online');
    const filterVal = statusFilter ? statusFilter.value : 'all';
    const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let filtered = filterVal === 'all' ? orders : orders.filter(o => o.status === filterVal);
    if (searchVal) {
      filtered = filtered.filter(o => (o.customerName || '').toLowerCase().includes(searchVal));
    }

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    if (sidebarBadge) {
      if (pendingCount > 0) { sidebarBadge.textContent = pendingCount; sidebarBadge.style.display = ''; }
      else { sidebarBadge.style.display = 'none'; }
    }

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      emptyMsg.classList.remove('d-none');
      return;
    }
    emptyMsg.classList.add('d-none');

    tbody.innerHTML = filtered.map(o => {
      const itemsSummary = (o.items || []).map(i => `${i.name} ×${i.qty}`).join(', ');
      const badgeClass = STATUS_BADGE[o.status] || 'bg-secondary-subtle text-secondary';
      const statusLabel = STATUS_LABEL[o.status] || o.status;
      const nextStatus = NEXT_STATUS[o.status];
      const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('km-KH') : '';

      let actions = '';
      if (nextStatus) {
        actions += `<button class="btn btn-light btn-sm border rounded-2 me-1 font-khmer" onclick="StaffOnlineOrders.advance('${o.id}')" title="ប្តូរទៅ${STATUS_LABEL[nextStatus]}">
          <i class="fa-solid fa-arrow-right text-primary"></i> ${STATUS_LABEL[nextStatus]}
        </button>`;
      }
      if (o.status !== 'delivered' && o.status !== 'cancelled') {
        actions += `<button class="btn btn-light btn-sm border rounded-2 text-danger" onclick="StaffOnlineOrders.cancel('${o.id}')" title="លុបចោល">
          <i class="fa-solid fa-xmark"></i>
        </button>`;
      }

      return `
      <tr>
        <td class="fw-semibold">#${o.id}</td>
        <td>${o.customerName || '-'}</td>
        <td class="small text-secondary" style="max-width:260px;">${itemsSummary}</td>
        <td class="fw-semibold">$${Number(o.total || 0).toFixed(2)}</td>
        <td><span class="badge bg-light text-muted border">${dateStr}</span></td>
        <td><span class="badge rounded-pill ${badgeClass}">${statusLabel}</span></td>
        <td class="text-end">${actions}</td>
      </tr>`;
    }).join('');
  }

  window.StaffOnlineOrders = {
    advance(id) {
      const order = SharedStore.getOrder(id);
      if (!order) return;
      const next = NEXT_STATUS[order.status];
      if (next) SharedStore.updateOrderStatus(id, next);
      renderOnlineOrders();
    },
    cancel(id) {
      if (!confirm('តើអ្នកពិតជាចង់លុបចោលការបញ្ជាទិញនេះមែនទេ?')) return;
      SharedStore.updateOrderStatus(id, 'cancelled');
      renderOnlineOrders();
    },
    refresh: renderOnlineOrders
  };

  renderOnlineOrders();

  SharedStore.onChange(() => renderOnlineOrders());
});
