
const CATEGORIES = [
  { name: "Electronics", icon: "bi-laptop" },
  { name: "Fashion", icon: "bi-handbag" },
  { name: "Home & Living", icon: "bi-house-heart" },
  { name: "Beauty", icon: "bi-flower2" },
  { name: "Sports", icon: "bi-dribbble" },
  { name: "Automotive", icon: "bi-car-front" },
  { name: "Toys & Games", icon: "bi-controller" },
  { name: "More", icon: "bi-three-dots" },
];

function staticProductsFallback() {
  return [
    { id: 1, name: "Wireless Headphones", cat: "electronics", brand: "Sony", price: 59.99, old: 79.99, rating: 5, reviews: 128, stock: "in", badge: "SALE", img: "headphones", image: "https://kfourgroup.com.kh/wp-content/uploads/2024/01/JBLT770NC-BLK.webp", isNew: false, dealPct: 25, stockLeft: 62 },
    { id: 2, name: "Smart Watch Series 5", cat: "electronics", brand: "Apple", price: 129.99, old: null, rating: 4, reviews: 89, stock: "in", badge: "NEW", img: "smartwatch", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3BqE121r3vujeCt-B6E11Pac8Ily1CfFUmqqCCoPx_w&s=10", isNew: true, dealPct: null, stockLeft: 40 },
    { id: 3, name: "Travel Backpack", cat: "fashion", brand: "Nike", price: 39.99, old: 49.99, rating: 4, reviews: 56, stock: "low", badge: "SALE", img: "backpack", image: "https://nakie.co/cdn/shop/files/MBA_-_BACKPACK_TRAVEL_-_River_Blue.png?v=1783678535&width=1150", isNew: false, dealPct: 20, stockLeft: 8 },
  ];
}
const PRODUCTS = (typeof SharedStore !== 'undefined') ? SharedStore.getProducts() : staticProductsFallback();

const CURRENT_CUSTOMER_ID = 100;
function syncCartBadge() {
  const badgeEl = document.getElementById('cartBadge');
  if (!badgeEl || typeof SharedStore === 'undefined') return;
  badgeEl.textContent = SharedStore.getCartCount(CURRENT_CUSTOMER_ID);
}
syncCartBadge();

const BRANDS = [
  { name: "Apple", count: 48}, { name: "Samsung", count: 65 }, { name: "Sony", count: 37 }, { name: "Nike", count: 52 },
  { name: "Adidas", count: 44 }, { name: "Canon", count: 21 }, { name: "Philips", count: 33 }, { name: "Dell", count: 29 },
  { name: "Lenovo", count: 26 }, { name: "Puma", count: 31 }, { name: "LG", count: 38 }, { name: "Xiaomi", count: 41 },
];

/* ---------- 2. NAVBAR SCROLL SHADOW + ACTIVE LINK ---------- */
const mainNavbar = document.getElementById('mainNavbar');
if (mainNavbar) {
  window.addEventListener('scroll', () => {
    mainNavbar.classList.toggle('scrolled', window.scrollY > 8);
  });
}
document.querySelectorAll('.subnav .nav-link').forEach(link => {
  const page = location.pathname.split('/').pop() || 'index.html';
  if (link.getAttribute('href') === page) link.classList.add('active');
});

/* ---------- 3. SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
function observeNew(el) { revealObserver.observe(el); }

/* ---------- 4. PRODUCT CARD RENDERER (shared by home/shop/deals/new-arrivals) ---------- */
function starHtml(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) { s += `<i class="bi ${i <= rating ? 'bi-star-fill' : 'bi-star'}"></i>`; }
  return s;
}
function productCardHtml(p) {
  const badge = p.badge ? `<span class="product-badge ${p.badge === 'NEW' ? 'badge-new' : 'badge-sale'}">${p.badge}</span>` : '';
  const oldPrice = p.old ? `<span class="price-old">$${p.old.toFixed(2)}</span>` : '';
  const stockChip = p.stock === 'in' ? `<span class="stock-chip stock-in">In Stock</span>` : `<span class="stock-chip stock-low">Low Stock</span>`;
  return `
  <div class="col product-item reveal in-view" data-cat="${p.cat}" data-brand="${p.brand}" data-price="${p.price}">
    <div class="product-card">
      <div class="product-media">
        <img src="${p.image ? p.image : 'asset/image/no-image.svg'}" alt="${p.name}" loading="lazy">
        ${badge}
        <button class="fav-btn" data-idx="${p.id}" aria-label="Add to favorites"><i class="bi bi-heart"></i></button>
        <div class="quick-add" data-idx="${p.id}"><i class="bi bi-eye me-1"></i>Quick View</div>
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-rating">${starHtml(p.rating)} <span class="count">(${p.reviews})</span></div>
        <div class="price-row"><span class="price-now">$${p.price.toFixed(2)}</span>${oldPrice}</div>
        ${stockChip}
        <button class="add-cart-btn" data-idx="${p.id}"><i class="bi bi-cart-plus me-1"></i>Add to Cart</button>
      </div>
    </div>
  </div>`;
}
function renderProducts(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(productCardHtml).join('');
  el.querySelectorAll('.reveal').forEach(observeNew);
}

/* ---------- 5. FAVORITE + ADD TO CART (event delegation, works on any page) ---------- */
document.addEventListener('click', (e) => {
  const fav = e.target.closest('.fav-btn');
  if (fav) {
    fav.classList.toggle('active');
    fav.classList.remove('pulse'); void fav.offsetWidth; fav.classList.add('pulse');
    fav.querySelector('i').className = fav.classList.contains('active') ? 'bi bi-heart-fill' : 'bi bi-heart';
    return;
  }
  const addBtn = e.target.closest('.add-cart-btn');
  if (addBtn) {
    const idx = addBtn.dataset.idx;
    const product = PRODUCTS.find(p => String(p.id) === String(idx));
    addBtn.classList.add('added');
    addBtn.innerHTML = '<i class="bi bi-check2 me-1"></i>Added';
    setTimeout(() => { addBtn.classList.remove('added'); addBtn.innerHTML = '<i class="bi bi-cart-plus me-1"></i>Add to Cart'; }, 1400);

    if (typeof SharedStore !== 'undefined' && product) {
      SharedStore.addToCart(CURRENT_CUSTOMER_ID, product.id, 1);
    }
    syncCartBadge();

    const toastMsg = document.getElementById('toastMsg');
    const toastEl = document.getElementById('cartToast');
    if (toastMsg && toastEl && product) {
      toastMsg.textContent = `${product.name} added to cart`;
      new bootstrap.Toast(toastEl).show();
    }
  }
});

/* ---------- 6. FILTER BAR (shop page + home popular products) ---------- */
const filterBar = document.getElementById('filterBar');
if (filterBar) {
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-item').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.style.display = show ? '' : 'none';
    });
  });
}

/* Shop page sidebar checkbox filters */
const sidebarFilters = document.getElementById('sidebarFilters');
if (sidebarFilters) {
  sidebarFilters.addEventListener('change', () => {
    const checked = Array.from(sidebarFilters.querySelectorAll('input[name="catFilter"]:checked')).map(i => i.value);
    document.querySelectorAll('.product-item').forEach(item => {
      const show = checked.length === 0 || checked.includes(item.dataset.cat);
      item.style.display = show ? '' : 'none';
    });
    const countEl = document.getElementById('resultCount');
    if (countEl) {
      const visible = document.querySelectorAll('.product-item').length - document.querySelectorAll('.product-item[style*="display: none"]').length;
      countEl.textContent = visible;
    }
  });
}

/* Sort dropdown (shop page) */
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    const grid = document.getElementById('shopGrid');
    const items = Array.from(grid.children);
    const val = sortSelect.value;
    items.sort((a, b) => {
      const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
      if (val === 'low') return pa - pb;
      if (val === 'high') return pb - pa;
      return 0;
    });
    items.forEach(i => grid.appendChild(i));
  });
}

/* ---------- 7. CATEGORY CIRCLES (home page) ---------- */
const categoryGrid = document.getElementById('categoryGrid');
if (categoryGrid) {
  categoryGrid.innerHTML = CATEGORIES.map(c => `
    <div class="col">
      <a href="shop.html" class="cat-circle-card">
        <span class="cat-circle"><i class="bi ${c.icon}"></i></span>
        <span>${c.name}</span>
      </a>
    </div>`).join('');
}

/* ---------- 8. BRANDS (top-brands.html) ---------- */
const brandGrid = document.getElementById('brandGrid');
if (brandGrid) {
  brandGrid.innerHTML = BRANDS.map(b => `
    <div class="col-6 col-md-4 col-lg-3 reveal">
      <div class="brand-card">
        <div class="brand-logo-box">${b.name}</div>
        <div class="text-ink-soft small mb-3">${b.count} Products</div>
        <a href="shop.html" class="btn btn-outline-primary btn-sm w-100">View Products</a>
      </div>
    </div>`).join('');
  brandGrid.querySelectorAll('.reveal').forEach(observeNew);
}

/* ---------- 9. COUNTDOWN TIMER (deals.html) ---------- */
const countdownEl = document.getElementById('countdown');
if (countdownEl) {
  let totalSeconds = 2 * 3600 + 14 * 60 + 36; // 02:14:36 demo countdown
  function renderCountdown() {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    countdownEl.innerHTML = `
      <div class="box"><div class="num">${String(h).padStart(2, '0')}</div><div class="lbl">Hrs</div></div>
      <div class="box"><div class="num">${String(m).padStart(2, '0')}</div><div class="lbl">Min</div></div>
      <div class="box"><div class="num">${String(s).padStart(2, '0')}</div><div class="lbl">Sec</div></div>`;
  }
  renderCountdown();
  setInterval(() => { if (totalSeconds > 0) { totalSeconds--; renderCountdown(); } }, 1000);
}

/* ---------- 10. CART PAGE LOGIC (cart.html) ---------- */
const cartTable = document.getElementById('cartItems');
if (cartTable && typeof SharedStore !== 'undefined') {

  function cartItemRowHtml(item) {
    const imgSrc = item.image ? item.image : 'asset/image/no-image.svg';
    return `
      <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
        <img src="${imgSrc}" alt="${item.name}">
        <div class="flex-grow-1">
          <div class="fw-semibold">${item.name}</div>
          <div class="mt-2"><a href="#" class="small text-ink-soft"><i class="bi bi-bookmark me-1"></i>រក្សាទុកសម្រាប់ក្រោយ</a></div>
        </div>
        <div class="qty-control"><button class="qty-decr" type="button">−</button><input type="text" value="${item.qty}" readonly><button class="qty-incr" type="button">+</button></div>
        <div class="text-end" style="min-width:80px;">
          <div class="fw-bold line-total">$${(item.price * item.qty).toFixed(2)}</div>
          <button class="btn btn-sm border-0 text-danger cart-remove"><i class="bi bi-trash3"></i></button>
        </div>
      </div>`;
  }

  function renderCartPage() {
    const items = SharedStore.getCart(CURRENT_CUSTOMER_ID);
    const emptyEl = document.getElementById('cartEmpty');
    const countEl = document.getElementById('cartItemCount');
    if (countEl) countEl.textContent = `(${items.reduce((s, i) => s + i.qty, 0)} មុខទំនិញ)`;

    if (items.length === 0) {
      cartTable.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('d-none');
    } else {
      if (emptyEl) emptyEl.classList.add('d-none');
      cartTable.innerHTML = items.map(cartItemRowHtml).join('');
    }
    updateCartTotals();
    const checkoutBtnEl = document.getElementById('checkoutBtn');
    if (checkoutBtnEl) checkoutBtnEl.disabled = items.length === 0;
  }

  cartTable.addEventListener('click', (e) => {
    const incr = e.target.closest('.qty-incr');
    const decr = e.target.closest('.qty-decr');
    const remove = e.target.closest('.cart-remove');
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const productId = Number(row.dataset.id);

    if (incr || decr) {
      const input = row.querySelector('.qty-control input');
      const current = parseInt(input.value, 10) || 1;
      const next = incr ? current + 1 : Math.max(1, current - 1);
      SharedStore.updateCartQty(CURRENT_CUSTOMER_ID, productId, next);
      renderCartPage();
      syncCartBadge();
    }
    if (remove) {
      SharedStore.removeFromCart(CURRENT_CUSTOMER_ID, productId);
      renderCartPage();
      syncCartBadge();
    }
  });

  renderCartPage();
}
function updateCartTotals() {
  let subtotal = 0;
  document.querySelectorAll('.cart-item').forEach(item => {
    const price = parseFloat(item.dataset.price);
    const qty = parseInt(item.querySelector('.qty-control input').value);
    subtotal += price * qty;
  });
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;
  const subtotalEl = document.getElementById('sumSubtotal');
  if (subtotalEl) {
    document.getElementById('sumSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('sumShipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('sumTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('sumTotal').textContent = `$${total.toFixed(2)}`;
  }
}

const checkoutBtn = document.getElementById('checkoutBtn');
const qrPaymentModalEl = document.getElementById('qrPaymentModal');
if (checkoutBtn && qrPaymentModalEl) {
  qrPaymentModalEl.addEventListener('show.bs.modal', () => {
    const totalText = document.getElementById('sumTotal')?.textContent || '$0.00';
    document.getElementById('qrPaymentTotal').textContent = totalText;
  });
}

const confirmQrPaymentBtn = document.getElementById('confirmQrPaymentBtn');
if (confirmQrPaymentBtn) {
  confirmQrPaymentBtn.addEventListener('click', () => {
    if (typeof SharedStore === 'undefined') return;
    const items = SharedStore.getCart(CURRENT_CUSTOMER_ID).map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }));
    if (items.length === 0) return;

    const totalText = document.getElementById('sumTotal')?.textContent.replace('$', '') || '0';
    const cust = SharedStore.getCustomer(CURRENT_CUSTOMER_ID);

    const order = SharedStore.addOrder({
      customerId: CURRENT_CUSTOMER_ID,
      customerName: cust ? cust.name : 'LyHeng Symeng',
      items,
      total: parseFloat(totalText) || items.reduce((s, i) => s + i.price * i.qty, 0),
      source: 'online',
      paymentMethod: 'ABA KHQR',
      address: cust ? cust.address : '',
    });

    SharedStore.clearCart(CURRENT_CUSTOMER_ID);
    syncCartBadge();

    const modalInstance = bootstrap.Modal.getInstance(qrPaymentModalEl);
    if (modalInstance) modalInstance.hide();

    setTimeout(() => {
      if (typeof window.showInvoiceModal === 'function') window.showInvoiceModal(order);
    }, 350); 
  });
}

function buildInvoiceContentHtml(order, customer) {
  const itemsRows = (order.items || []).map(i => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #E2E8F0;">${i.name}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #E2E8F0;text-align:center;">${i.qty}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #E2E8F0;text-align:right;">$${Number(i.price).toFixed(2)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #E2E8F0;text-align:right;">$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`).join('');
  const subtotal = (order.items || []).reduce((s, i) => s + i.price * i.qty, 0);
  const total = Number(order.total || subtotal);
  const other = +(total - subtotal).toFixed(2);
  return `
    <div style="font-family:'Noto Sans Khmer',Arial,sans-serif;color:#1E293B;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #4F46E5;padding-bottom:16px;">
        <div><div style="font-weight:800;font-size:20px;color:#4F46E5;">ShopEase</div><div style="color:#64748B;font-size:13px;">Phnom Penh, Cambodia<br>support@shopease.com · +855 12 345 678</div></div>
        <div style="text-align:right;"><h1 style="font-size:20px;margin:0 0 4px;">វិក្កយបត្រ / INVOICE</h1><div style="color:#64748B;font-size:13px;">លេខ: ${order.id}<br>កាលបរិច្ឆេទ: ${new Date(order.createdAt).toLocaleString('km-KH')}</div></div>
      </div>
      <div style="background:#F8FAFC;border-radius:8px;padding:14px 16px;margin-top:20px;">
        <div style="font-weight:600;">ទូទាត់ដោយ (Bill To)</div>
        <div style="color:#64748B;font-size:13px;">${customer ? customer.name : (order.customerName || '')}<br>${customer && customer.phone ? customer.phone : ''} ${customer && customer.email ? '· ' + customer.email : ''}<br>${order.address || (customer ? customer.address : '') || ''}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:20px;">
        <thead><tr>
          <th style="text-align:left;padding:8px 6px;background:#F1F5F9;font-size:13px;">ទំនិញ</th>
          <th style="text-align:center;padding:8px 6px;background:#F1F5F9;font-size:13px;">ចំនួន</th>
          <th style="text-align:right;padding:8px 6px;background:#F1F5F9;font-size:13px;">តម្លៃឯកតា</th>
          <th style="text-align:right;padding:8px 6px;background:#F1F5F9;font-size:13px;">សរុប</th>
        </tr></thead>
        <tbody>${itemsRows}</tbody>
      </table>
      <div style="max-width:280px;margin-left:auto;margin-top:12px;">
        <div style="display:flex;justify-content:space-between;margin-top:6px;"><span>សរុបរង (Subtotal)</span><span>$${subtotal.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;"><span>ពន្ធ/ដឹកជញ្ជូន (Tax/Shipping)</span><span>$${other.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:18px;border-top:2px solid #1E293B;padding-top:8px;margin-top:8px;"><span>សរុប (Total)</span><span>$${total.toFixed(2)}</span></div>
      </div>
      <div style="background:#F8FAFC;border-radius:8px;padding:14px 16px;margin-top:20px;">
        <span style="color:#64748B;font-size:13px;">វិធីទូទាត់ប្រាក់៖ </span><strong>${order.paymentMethod || '--'}</strong> &nbsp;&nbsp;
        <span style="color:#64748B;font-size:13px;">ស្ថានភាព៖ </span><strong style="color:#16A34A;">បានទូទាត់ (Paid)</strong>
      </div>
      <p style="color:#64748B;font-size:13px;margin-top:24px;">សូមអរគុណសម្រាប់ការទិញទំនិញជាមួយ ShopEase!</p>
    </div>`;
}
function buildInvoiceHtml(order, customer) {
  return `<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><title>វិក្កយបត្រ #${order.id}</title>
  <style>
    body{font-family:'Khmer OS Battambang','Noto Sans Khmer',Arial,sans-serif;max-width:760px;margin:32px auto;padding:0 24px;}
    @media print{ .no-print{display:none;} body{margin:0;padding:16px;} }
  </style></head><body>
    ${buildInvoiceContentHtml(order, customer)}
    <button class="no-print" onclick="window.print()" style="margin-top:8px;padding:10px 20px;background:#4F46E5;color:#fff;border:0;border-radius:8px;cursor:pointer;">បោះពុម្ព (Print)</button>
  </body></html>`;
}
function openInvoiceForOrder(order) {
  if (!order) { alert('រកមិនឃើញព័ត៌មានការបញ្ជាទិញទេ។'); return; }
  const customer = (typeof SharedStore !== 'undefined') ? SharedStore.getCustomer(order.customerId) : null;
  const win = window.open('', '_blank');
  if (!win) { alert('សូមអនុញ្ញាត Pop-up ដើម្បីមើលវិក្កយបត្រ។'); return; }
  win.document.write(buildInvoiceHtml(order, customer));
  win.document.close();
}
const viewInvoiceBtn = document.getElementById('viewInvoiceBtn');
if (viewInvoiceBtn) {
  viewInvoiceBtn.addEventListener('click', () => {
    if (typeof SharedStore === 'undefined') return;
    const orderId = document.getElementById('trackOrderId')?.textContent;
    const order = orderId ? SharedStore.getOrder(orderId) : null;
    openInvoiceForOrder(order);
  });
}

const invoiceModalEl = document.getElementById('invoiceModal');
if (invoiceModalEl) {
  const printInvoiceBtn = document.getElementById('printInvoiceBtn');
  const goToTrackOrderBtn = document.getElementById('goToTrackOrderBtn');
  let lastOrder = null;

  function showInvoiceModal(order) {
    lastOrder = order;
    const customer = (typeof SharedStore !== 'undefined') ? SharedStore.getCustomer(order.customerId) : null;
    document.getElementById('invoiceModalBody').innerHTML = buildInvoiceContentHtml(order, customer);
    new bootstrap.Modal(invoiceModalEl).show();
  }
  window.showInvoiceModal = showInvoiceModal;

  if (printInvoiceBtn) {
    printInvoiceBtn.addEventListener('click', () => {
      if (lastOrder) openInvoiceForOrder(lastOrder);
    });
  }
  if (goToTrackOrderBtn) {
    goToTrackOrderBtn.addEventListener('click', () => {
      if (lastOrder) window.location.href = `track-order.html?id=${encodeURIComponent(lastOrder.id)}`;
    });
  }
}

/* ---------- 11. TRACK ORDER (track-order.html) ---------- */
const trackForm = document.getElementById('trackForm');
if (trackForm) {
  const TIMELINE_STEPS = [
    { key: 'pending', title: 'បានធ្វើការបញ្ជាទិញ', icon: 'bi-check' },
    { key: 'processing', title: 'កំពុងរៀបចំការបញ្ជាទិញ', icon: 'bi-box-seam' },
    { key: 'shipped', title: 'កំពុងដឹកជញ្ជូន', icon: 'bi-truck' },
    { key: 'delivered', title: 'បានដឹកជញ្ជូនដល់', icon: 'bi-house-check' },
  ];
  const STATUS_LABEL_KM = {
    pending: 'កំពុងរង់ចាំ', processing: 'កំពុងរៀបចំ', shipped: 'កំពុងចេញដឹកជញ្ជូន',
    delivered: 'បានដឹកជញ្ជូនដល់', cancelled: 'បានលុបចោល',
  };

  function fmtDate(iso) {
    if (!iso) return '--';
    return new Date(iso).toLocaleString('km-KH', { dateStyle: 'long', timeStyle: 'short' });
  }

  function renderTimeline(order) {
    const stepIndex = TIMELINE_STEPS.findIndex(s => s.key === order.status);
    const el = document.getElementById('trackTimeline');
    if (order.status === 'cancelled') {
      el.innerHTML = `<li class="done" style="--dot-bg:#EF4444;"><span class="dot"><i class="bi bi-x"></i></span><div class="step-title">ការបញ្ជាទិញត្រូវបានលុបចោល</div><div class="step-sub">${fmtDate(order.updatedAt)}</div></li>`;
      return;
    }
    el.innerHTML = TIMELINE_STEPS.map((s, i) => {
      const cls = i < stepIndex ? 'done' : i === stepIndex ? 'current' : '';
      const iconHtml = i <= stepIndex ? '<i class="bi bi-check"></i>' : '';
      const sub = i <= stepIndex ? fmtDate(i === stepIndex ? order.updatedAt : order.createdAt) : 'កំពុងរង់ចាំ';
      return `<li class="${cls}"><span class="dot">${iconHtml || (i === stepIndex ? `<i class="bi ${s.icon}"></i>` : '')}</span><div class="step-title${i > stepIndex ? ' text-ink-soft' : ''}">${s.title}</div><div class="step-sub">${sub}</div></li>`;
    }).join('');
  }

  function renderOrder(order) {
    document.getElementById('trackResult').classList.remove('d-none');
    document.getElementById('trackNotFound').classList.add('d-none');
    document.getElementById('trackOrderTitle').textContent = `ការបញ្ជាទិញ #${order.id}`;
    document.getElementById('trackStatusChip').textContent = STATUS_LABEL_KM[order.status] || order.status;
    document.getElementById('trackOrderDate').textContent = fmtDate(order.createdAt);
    document.getElementById('trackOrderAddress').textContent = order.address || 'ភ្នំពេញ កម្ពុជា';
    document.getElementById('trackOrderPayment').textContent = order.paymentMethod || '--';
    document.getElementById('trackOrderId').textContent = order.id;
    document.getElementById('trackOrderTotal').textContent = `$${Number(order.total || 0).toFixed(2)}`;
    document.getElementById('trackOrderItems').innerHTML = (order.items || []).map(i => `
      <div class="d-flex gap-2 align-items-center mb-2">
        <span class="stock-chip stock-in" style="min-width:28px;text-align:center;">${i.qty}</span>
        <div class="small flex-grow-1">${i.name} <span class="text-ink-soft">× ${i.qty}</span></div>
        <div class="small fw-semibold">$${(i.price * i.qty).toFixed(2)}</div>
      </div>`).join('') || '<div class="text-ink-soft small">មិនមានទំនិញ</div>';
    renderTimeline(order);

    const cancelWrap = document.getElementById('trackCancelBtnWrap');
    const cancelBtn = document.getElementById('trackCancelBtn');
    if (cancelWrap && cancelBtn) {
      if (order.status === 'pending') {
        cancelWrap.classList.remove('d-none');
        cancelBtn.onclick = () => {
          if (!confirm('តើអ្នកពិតជាចង់លុបចោលការបញ្ជាទិញនេះមែនទេ?')) return;
          SharedStore.updateOrderStatus(order.id, 'cancelled');
          renderOrder(SharedStore.getOrder(order.id));
        };
      } else {
        cancelWrap.classList.add('d-none');
      }
    }

    document.getElementById('trackResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function trackByInput() {
    const raw = document.getElementById('trackOrderInput').value.trim();
    if (!raw || typeof SharedStore === 'undefined') return;
    const order = SharedStore.getOrder(raw) || SharedStore.getOrder(raw.replace(/^#/, ''));
    if (order) {
      renderOrder(order);
    } else {
      document.getElementById('trackResult').classList.add('d-none');
      document.getElementById('trackNotFound').classList.remove('d-none');
    }
  }

  trackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    trackByInput();
  });

  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get('id');
  if (idFromUrl && typeof SharedStore !== 'undefined') {
    document.getElementById('trackOrderInput').value = idFromUrl;
    trackByInput();
  }
}

const purchaseList = document.getElementById('purchaseOrdersList');
if (purchaseList && typeof SharedStore !== 'undefined') {
  const STATUS_BADGE_STYLE = {
    pending: 'background:#FEF3C7;color:#B45309;',
    processing: 'background:#FEF3C7;color:#B45309;',
    shipped: 'background:var(--brand-blue-50,#EEF2FF);color:var(--brand-blue,#4F46E5);',
    delivered: 'background:#DCFCE7;color:#16A34A;',
    cancelled: 'background:#FEE2E2;color:#DC2626;',
  };
  const STATUS_LABEL = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

  function renderPurchases(filter) {
    const all = SharedStore.getOrdersByCustomer(100); // LyHeng Symeng
    const orders = filter === 'all' ? all : all.filter(o => o.status === filter);
    const emptyEl = document.getElementById('purchaseEmpty');

    if (orders.length === 0) {
      purchaseList.innerHTML = '';
      emptyEl.classList.remove('d-none');
      return;
    }
    emptyEl.classList.add('d-none');

    purchaseList.innerHTML = orders.map(o => {
      const firstItem = (o.items || [])[0];
      const itemCount = (o.items || []).reduce((s, i) => s + i.qty, 0);
      const dateStr = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const style = STATUS_BADGE_STYLE[o.status] || '';
      const cancelBtn = o.status === 'pending'
        ? `<button class="btn btn-sm btn-outline-danger cancel-order-btn" data-id="${o.id}">លុបចោល</button>`
        : '';
      return `
      <div class="order-row">
        <img src="${firstItem && firstItem.image ? firstItem.image : 'asset/image/no-image.svg'}" alt="${firstItem ? firstItem.name : 'Order'}">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="fw-semibold">Order #${o.id}</span>
            <span class="badge rounded-pill" style="${style}">${STATUS_LABEL[o.status] || o.status}</span>
          </div>
          <div class="text-ink-soft small">${dateStr} · ${itemCount} item${itemCount === 1 ? '' : 's'}</div>
          <div class="fw-semibold small mt-1">Total: $${Number(o.total || 0).toFixed(2)}</div>
        </div>
        <div class="d-flex flex-column gap-1 align-items-stretch">
          <a href="track-order.html?id=${encodeURIComponent(o.id)}" class="btn btn-sm btn-outline-primary">View Details <i class="bi bi-chevron-right small"></i></a>
          ${cancelBtn}
        </div>
      </div>`;
    }).join('');

    purchaseList.querySelectorAll('.cancel-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('តើអ្នកពិតជាចង់លុបចោលការបញ្ជាទិញនេះមែនទេ?')) return;
        SharedStore.updateOrderStatus(btn.dataset.id, 'cancelled');
        const activeFilter = document.querySelector('#purchaseTabs .tab-pill.active')?.dataset.status || 'all';
        renderPurchases(activeFilter);
      });
    });
  }

  document.getElementById('purchaseTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-pill');
    if (!btn) return;
    document.querySelectorAll('#purchaseTabs .tab-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPurchases(btn.dataset.status);
  });

  renderPurchases('all');
}

const profileForm = document.getElementById('profileForm');
if (profileForm && typeof SharedStore !== 'undefined') {
  const ACCOUNT_CUSTOMER_ID = 100; // LyHeng Symeng

  function loadProfile() {
    const cust = SharedStore.getCustomer(ACCOUNT_CUSTOMER_ID);
    if (!cust) return;
    document.getElementById('profileName').value = cust.name || '';
    document.getElementById('profileEmail').value = cust.email || '';
    document.getElementById('profilePhone').value = cust.phone || '';
    document.getElementById('profileAddress').value = cust.address || '';
    document.getElementById('profileBannerName').textContent = cust.name || '';
    document.getElementById('profileBannerContact').innerHTML =
      `<i class="bi bi-envelope me-1"></i>${cust.email || ''} &nbsp; <i class="bi bi-telephone ms-2 me-1"></i>${cust.phone || ''}`;
  }

  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    SharedStore.upsertCustomer({
      id: ACCOUNT_CUSTOMER_ID,
      name: document.getElementById('profileName').value.trim(),
      email: document.getElementById('profileEmail').value.trim(),
      phone: document.getElementById('profilePhone').value.trim(),
      address: document.getElementById('profileAddress').value.trim(),
    });
    loadProfile();
    const msg = document.getElementById('profileSavedMsg');
    msg.classList.remove('d-none');
    setTimeout(() => msg.classList.add('d-none'), 2000);
  });

  function loadRecentOrders() {
    const orders = SharedStore.getOrdersByCustomer(ACCOUNT_CUSTOMER_ID).slice(0, 5);
    const tbody = document.getElementById('accountRecentOrders');
    const emptyEl = document.getElementById('accountNoOrders');
    if (!tbody) return;
    if (orders.length === 0) {
      tbody.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('d-none');
      return;
    }
    if (emptyEl) emptyEl.classList.add('d-none');
    const STATUS_LABEL_KM = { pending: 'កំពុងរង់ចាំ', processing: 'កំពុងរៀបចំ', shipped: 'កំពុងដឹកជញ្ជូន', delivered: 'បានដឹកជញ្ជូនដល់', cancelled: 'បានលុបចោល' };
    const STATUS_CHIP_CLASS = { delivered: 'stock-in', pending: 'stock-low', processing: 'stock-low', shipped: '', cancelled: 'stock-low' };
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td class="fw-semibold">#${o.id}</td>
        <td>${new Date(o.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
        <td><span class="stock-chip ${STATUS_CHIP_CLASS[o.status] || ''}" ${o.status === 'shipped' ? 'style="background:var(--brand-blue-50); color:var(--brand-blue);"' : ''}>${STATUS_LABEL_KM[o.status] || o.status}</span></td>
        <td>$${Number(o.total || 0).toFixed(2)}</td>
        <td><a href="track-order.html?id=${encodeURIComponent(o.id)}" class="btn btn-sm btn-outline-primary">មើល</a></td>
      </tr>`).join('');
  }

  loadProfile();
  loadRecentOrders();
}

const supportTicketForm = document.getElementById('supportTicketForm');
if (supportTicketForm && typeof SharedStore !== 'undefined') {
  const TICKET_STATUS_LABEL = { open: 'កំពុងរង់ចាំចម្លើយ', resolved: 'បានឆ្លើយតបរួច' };
  const TICKET_STATUS_STYLE = {
    open: 'background:#FEF3C7;color:#B45309;',
    resolved: 'background:#DCFCE7;color:#16A34A;',
  };

  function renderMyTickets() {
    const listEl = document.getElementById('myTicketsList');
    const tickets = SharedStore.getTicketsByCustomer(CURRENT_CUSTOMER_ID);
    if (tickets.length === 0) {
      listEl.innerHTML = '<p class="text-ink-soft small">មិនទាន់មានសំណើឡើយ។</p>';
      return;
    }
    listEl.innerHTML = tickets.map(t => `
      <div class="filter-sidebar mb-3">
        <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
          <div class="fw-semibold">${t.subject}</div>
          <span class="badge rounded-pill" style="${TICKET_STATUS_STYLE[t.status] || ''}">${TICKET_STATUS_LABEL[t.status] || t.status}</span>
        </div>
        <div class="text-ink-soft small mb-2">${t.category} · ${new Date(t.createdAt).toLocaleString('km-KH')}</div>
        <div class="small mb-2">${t.message}</div>
        ${t.reply ? `<div class="p-2 rounded-3" style="background:var(--brand-blue-50,#EEF2FF);">
            <div class="fw-semibold small text-brand mb-1"><i class="bi bi-headset me-1"></i>ចម្លើយពី Staff</div>
            <div class="small">${t.reply}</div>
          </div>` : `<div class="text-ink-soft small fst-italic">Staff មិនទាន់បានឆ្លើយតបនៅឡើយទេ...</div>`}
      </div>`).join('');
  }

  supportTicketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('ticketSubject').value.trim();
    const message = document.getElementById('ticketMessage').value.trim();
    const category = document.getElementById('ticketCategory').value;
    if (!subject || !message) return;

    const cust = SharedStore.getCustomer(CURRENT_CUSTOMER_ID);
    SharedStore.addTicket({
      customerId: CURRENT_CUSTOMER_ID,
      customerName: cust ? cust.name : 'Customer',
      subject, category, message
    });

    supportTicketForm.reset();
    const sentMsg = document.getElementById('ticketSentMsg');
    sentMsg.classList.remove('d-none');
    setTimeout(() => sentMsg.classList.add('d-none'), 3000);
    renderMyTickets();
  });

  renderMyTickets();
}

(function () {
  const badgeEl = document.getElementById('notifBadge');
  if (!badgeEl || typeof SharedStore === 'undefined') return;
  const readIds = JSON.parse(localStorage.getItem('notif_read_' + CURRENT_CUSTOMER_ID) || '[]');
  const orders = SharedStore.getOrdersByCustomer(CURRENT_CUSTOMER_ID);
  const tickets = SharedStore.getTicketsByCustomer(CURRENT_CUSTOMER_ID);
  let unread = 0;
  orders.forEach(o => { if (!readIds.includes('order-' + o.id + '-' + o.status)) unread++; });
  tickets.forEach(t => { if (t.reply && !readIds.includes('ticket-' + t.id)) unread++; });
  if (unread > 0) { badgeEl.textContent = unread; badgeEl.style.display = ''; }
  else { badgeEl.style.display = 'none'; }
})();

const notifList = document.getElementById('notifList');
if (notifList && typeof SharedStore !== 'undefined') {
  const READ_KEY = 'notif_read_' + CURRENT_CUSTOMER_ID;
  function getReadIds() { return JSON.parse(localStorage.getItem(READ_KEY) || '[]'); }
  function markRead(ids) {
    const cur = new Set(getReadIds());
    ids.forEach(id => cur.add(id));
    localStorage.setItem(READ_KEY, JSON.stringify([...cur]));
  }

  const ORDER_STATUS_TEXT = {
    pending: { title: id => `ការបញ្ជាទិញ #${id} ត្រូវបានទទួល`, sub: 'យើងទទួលបានការបញ្ជាទិញរបស់អ្នកហើយ កំពុងរង់ចាំដំណើរការ', icon: 'bi-bag-check', bg: 'var(--warning-bg,#FEF3C7)', fg: '#B45309' },
    processing: { title: id => `ការបញ្ជាទិញ #${id} កំពុងត្រូវបានរៀបចំ`, sub: 'Staff កំពុងវេចខ្ចប់ទំនិញរបស់អ្នក', icon: 'bi-box-seam', bg: 'var(--warning-bg,#FEF3C7)', fg: '#B45309' },
    shipped: { title: id => `ការបញ្ជាទិញ #${id} កំពុងដឹកជញ្ជូន`, sub: 'ទំនិញរបស់អ្នកកំពុងធ្វើដំណើរមកដល់', icon: 'bi-truck', bg: 'var(--brand-blue-50,#EEF2FF)', fg: 'var(--brand-blue,#4F46E5)' },
    delivered: { title: id => `ការបញ្ជាទិញ #${id} បានដឹកជញ្ជូនដល់`, sub: 'អរគុណសម្រាប់ការទិញទំនិញ — សូមផ្តល់ Review!', icon: 'bi-check2-circle', bg: 'var(--success-bg,#DCFCE7)', fg: '#15803D' },
    cancelled: { title: id => `ការបញ្ជាទិញ #${id} ត្រូវបានលុបចោល`, sub: 'ប្រសិនបើនេះជាកំហុស សូមទាក់ទង Staff', icon: 'bi-x-circle', bg: '#FEE2E2', fg: '#DC2626' },
  };

  function buildNotifications() {
    const orders = SharedStore.getOrdersByCustomer(CURRENT_CUSTOMER_ID);
    const tickets = SharedStore.getTicketsByCustomer(CURRENT_CUSTOMER_ID);
    const readIds = getReadIds();
    const items = [];

    orders.forEach(o => {
      const t = ORDER_STATUS_TEXT[o.status];
      if (!t) return;
      const id = 'order-' + o.id + '-' + o.status;
      items.push({
        id, cat: 'orders', icon: t.icon, bg: t.bg, fg: t.fg,
        title: t.title(o.id), sub: t.sub,
        time: o.updatedAt || o.createdAt,
        unread: !readIds.includes(id)
      });
      if (o.paymentMethod) {
        const payId = 'payment-' + o.id;
        items.push({
          id: payId, cat: 'payments', icon: 'bi-credit-card', bg: 'var(--brand-blue-50,#EEF2FF)', fg: 'var(--brand-blue,#4F46E5)',
          title: `ការទូទាត់ប្រាក់ $${Number(o.total || 0).toFixed(2)} បានជោគជ័យ`,
          sub: `វិធីទូទាត់៖ ${o.paymentMethod} — Order #${o.id}`,
          time: o.createdAt, unread: !readIds.includes(payId)
        });
      }
    });

    tickets.forEach(t => {
      if (!t.reply) return;
      const id = 'ticket-' + t.id;
      items.push({
        id, cat: 'system', icon: 'bi-headset', bg: '#F1F5F9', fg: 'var(--gray,#64748B)',
        title: `Staff បានឆ្លើយតបសំណើ "${t.subject}"`, sub: t.reply,
        time: t.updatedAt, unread: !readIds.includes(id)
      });
    });

    items.push({
      id: 'promo-1', cat: 'promotions', icon: 'bi-gift', bg: 'var(--warning-bg,#FEF3C7)', fg: '#B45309',
      title: 'កូដប្រូម៉ូសិនថ្មី៖ SAVE10', sub: 'បញ្ចុះតម្លៃ 10% រាល់ទំនិញនៅចុងសប្តាហ៍នេះ', time: null, unread: false
    });

    return items.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
  }

  function timeAgo(iso) {
    if (!iso) return '';
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'ទើបតែឥឡូវ';
    if (mins < 60) return `${mins} នាទីមុន`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ម៉ោងមុន`;
    return `${Math.floor(hrs / 24)} ថ្ងៃមុន`;
  }

  function renderNotifications() {
    const items = buildNotifications();
    if (items.length === 0) {
      notifList.innerHTML = '<p class="text-ink-soft text-center py-4">មិនទាន់មានការជូនដំណឹងឡើយ។</p>';
      return;
    }
    notifList.innerHTML = items.map(n => `
      <div class="notif-item${n.unread ? ' unread' : ''}" data-cat="${n.cat}" data-id="${n.id}">
        <div class="notif-icon" style="background:${n.bg}; color:${n.fg};"><i class="bi ${n.icon}"></i></div>
        <div class="flex-grow-1"><div class="fw-semibold">${n.title}</div><div class="text-ink-soft small">${n.sub}</div></div>
        <div class="notif-time">${timeAgo(n.time)}</div>
      </div>`).join('');

    const badgeEl = document.getElementById('notifBadge');
    const unreadCount = items.filter(n => n.unread).length;
    if (badgeEl) {
      if (unreadCount > 0) { badgeEl.textContent = unreadCount; badgeEl.style.display = ''; }
      else { badgeEl.style.display = 'none'; }
    }
  }

  const markAllBtn = document.getElementById('markAllRead');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      markRead(buildNotifications().map(n => n.id));
      renderNotifications();
    });
  }
  document.querySelectorAll('.notif-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      notifList.querySelectorAll('.notif-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  renderNotifications();
}