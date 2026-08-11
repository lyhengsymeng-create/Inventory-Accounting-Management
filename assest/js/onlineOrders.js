const ORDER_STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const ORDER_STATUS_LABEL_KM = {
  Pending: 'កំពុងរង់ចាំ',
  Processing: 'កំពុងរៀបចំ',
  Shipped: 'កំពុងដឹកជញ្ជូន',
  Delivered: 'បានប្រគល់ជូន'
};
const ORDER_STATUS_BADGE_CLASS = {
  Pending: 'bg-warning-subtle text-warning-emphasis',
  Processing: 'bg-info-subtle text-info-emphasis',
  Shipped: 'bg-primary-subtle text-primary-emphasis',
  Delivered: 'bg-success-subtle text-success-emphasis'
};

const ONLINE_ORDERS_DATA = [
  {
    id: 'ORD-10231',
    date: '2026-08-05T09:40:00',
    customer: 'សុខា',
    items: [{ name: 'អាវយឺត Cotton', qty: 2 }, { name: 'ខោខូវប៊យ', qty: 1 }],
    total: 42.50,
    status: 'Delivered'
  },
  {
    id: 'ORD-10245',
    date: '2026-08-06T14:15:00',
    customer: 'ដារា',
    items: [{ name: 'ស្បែកជើងកីឡា', qty: 1 }],
    total: 58.00,
    status: 'Shipped'
  },
  {
    id: 'ORD-10259',
    date: '2026-08-07T11:05:00',
    customer: 'ស្រីនាង',
    items: [{ name: 'កាបូបស្ពាយ', qty: 1 }, { name: 'អាវក្រៅ Denim', qty: 1 }],
    total: 76.20,
    status: 'Processing'
  },
  {
    id: 'ORD-10267',
    date: '2026-08-08T16:50:00',
    customer: 'វិសាល',
    items: [{ name: 'អាវយឺត Cotton', qty: 3 }],
    total: 33.00,
    status: 'Pending'
  },
  {
    id: 'ORD-10272',
    date: '2026-08-09T08:20:00',
    customer: 'មាលី',
    items: [{ name: 'មួកមាឌ', qty: 1 }, { name: 'ខ្សែក្រវាត់', qty: 1 }],
    total: 21.75,
    status: 'Pending'
  }
];

function formatOrderDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch (e) { return iso; }
}

function advanceOnlineOrder(orderId) {
  const order = ONLINE_ORDERS_DATA.find(o => o.id === orderId);
  if (!order) return;
  const idx = ORDER_STATUS_FLOW.indexOf(order.status);
  if (idx > -1 && idx < ORDER_STATUS_FLOW.length - 1) {
    order.status = ORDER_STATUS_FLOW[idx + 1];
  }
  loadOnlineOrders();
}

function loadOnlineOrders() {
  const tbody = document.getElementById('onlineOrdersTbody');
  if (!tbody) return;
  const orders = ONLINE_ORDERS_DATA.slice().reverse();

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">មិនទាន់មានការបញ្ជាទិញ</td></tr>';
  } else {
    tbody.innerHTML = orders.map(o => {
      const itemsSummary = o.items.map(i => `${i.name} ×${i.qty}`).join(', ');
      const badgeClass = ORDER_STATUS_BADGE_CLASS[o.status] || 'bg-secondary-subtle text-secondary-emphasis';
      const statusLabel = ORDER_STATUS_LABEL_KM[o.status] || o.status;
      const isFinal = o.status === 'Delivered';
      const nextLabel = ORDER_STATUS_FLOW[ORDER_STATUS_FLOW.indexOf(o.status) + 1];
      const actionBtn = isFinal
        ? '<span class="text-muted small">បញ្ចប់</span>'
        : `<button class="btn btn-sm btn-moss" onclick="advanceOnlineOrder('${o.id}')">➜ ${nextLabel ? ORDER_STATUS_LABEL_KM[nextLabel] : ''}</button>`;
      return `
        <tr>
          <td class="fw-semibold">${o.id}</td>
          <td class="small">${formatOrderDate(o.date)}</td>
          <td>${o.customer || '—'}</td>
          <td class="small" style="max-width:260px;">${itemsSummary}</td>
          <td class="fw-bold">$${Number(o.total).toFixed(2)}</td>
          <td><span class="badge ${badgeClass}">${statusLabel}</span></td>
          <td>${actionBtn}</td>
        </tr>`;
    }).join('');
  }

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const navBadge = document.getElementById('ordersNavBadge');
  if (navBadge) {
    if (pendingCount > 0) {
      navBadge.textContent = pendingCount;
      navBadge.style.display = 'inline-block';
    } else {
      navBadge.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadOnlineOrders();
  const ordersLink = document.querySelector('.sidebar .nav-link[data-tab="orders"]');
  if (ordersLink) ordersLink.addEventListener('click', loadOnlineOrders);
});
