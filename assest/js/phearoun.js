document.querySelectorAll('.sidebar .nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
   
    this.classList.add('active');

    const targetTab = this.getAttribute('data-tab');
    const activeContent = document.getElementById(`tab-${targetTab}`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
    
    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) {
      pageTitle.innerText = this.textContent.trim();
    }
  });
});
let cart = [];
let nextInvoiceId = 1; 
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 }); 
  }
  
  renderCart();
}

function renderCart() {
  const wrapper = document.getElementById('cart-items-wrapper');
  const emptyMsg = document.getElementById('cart-empty-msg');
  const discountInput = document.getElementById('pay-discount');
  const discountEl = document.getElementById('summary-discount');
  const totalEl = document.getElementById('summary-total');

  if (cart.length === 0) {
    wrapper.innerHTML = `<p class="text-muted small text-center my-3" id="cart-empty-msg">មិនទាន់មានទំនិញ</p>`;
    document.getElementById('summary-subtotal').textContent = "$0.00";
    if (discountEl) discountEl.textContent = "-$0.00";
    totalEl.textContent = "$0.00";
    updateSplitPayHint(0);
    return;
  }

  let subtotal = 0;

  wrapper.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    return `
      <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light-subtle style-desc font-khmer" style="font-size: 0.85rem;">
        <div>
          <div class="fw-bold text-dark">${item.name}</div>
          <small class="text-muted">${item.quantity} x $${item.price.toFixed(2)}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="fw-bold text-dark">$${itemTotal.toFixed(2)}</span>
          <button class="btn btn-sm btn-light py-0 px-1 border-0 text-danger" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-circle-minus"></i></button>
        </div>
      </div>
    `;
  }).join('');


  let discount = discountInput ? parseFloat(discountInput.value) || 0 : 0;
  if (discount < 0) discount = 0;
  if (discount > subtotal) discount = subtotal;

  const total = subtotal - discount;

  document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  updateSplitPayHint(total);
}

function onPayMethodChange() {
  const select = document.getElementById('pay-method-select');
  const wrap = document.getElementById('split-pay-wrap');
  if (!select || !wrap) return;

  if (select.value === 'ចម្រុះ') {
    wrap.classList.remove('d-none');
  } else {
    wrap.classList.add('d-none');
  }
  renderCart();
}

function updateSplitPayHint(total) {
  const select = document.getElementById('pay-method-select');
  const hint = document.getElementById('split-pay-hint');
  if (!select || !hint || select.value !== 'ចម្រុះ') {
    if (hint) hint.textContent = '';
    return;
  }
  const cash = parseFloat(document.getElementById('split-cash-amount')?.value) || 0;
  const aba = parseFloat(document.getElementById('split-aba-amount')?.value) || 0;
  const remaining = total - (cash + aba);
  if (Math.abs(remaining) < 0.01) {
    hint.className = 'text-success';
    hint.textContent = 'គ្រប់ចំនួនហើយ ✓';
  } else if (remaining > 0) {
    hint.className = 'text-danger';
    hint.textContent = `នៅខ្វះ $${remaining.toFixed(2)}`;
  } else {
    hint.className = 'text-danger';
    hint.textContent = `លើសចំនួន $${Math.abs(remaining).toFixed(2)}`;
  }
}

function removeFromCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function handleCheckout() {
  if (cart.length === 0) {
    showPosToast("កន្ត្រកទទេ! សូមជ្រើសរើសទំនិញសិន");
    return;
  }

  for (const item of cart) {
    const card = document.querySelector(`#productGrid .product-card[data-pid="${item.id}"]`);
    if (!card) continue;
    const stockEl = card.querySelectorAll('.card-body p')[1];
    if (!stockEl) continue;
    const stockMatch = stockEl.textContent.replace(/[^0-9]/g, '');
    const stock = parseInt(stockMatch, 10);
    if (!isNaN(stock) && item.quantity > stock) {
      showPosToast(`ស្តុក "${item.name}" នៅសល់ត្រឹមតែ ${stock} ប៉ុណ្ណោះ! សូមកែចំនួនក្នុងកន្ត្រក។`);
      return;
    }
  }

  const paymentSelect = document.getElementById('pay-method-select');
  const totalPrice = document.getElementById('summary-total').textContent;


  if (paymentSelect && paymentSelect.value === 'ចម្រុះ') {
    const total = parseFloat(totalPrice.replace('$', '')) || 0;
    const cash = parseFloat(document.getElementById('split-cash-amount')?.value) || 0;
    const aba = parseFloat(document.getElementById('split-aba-amount')?.value) || 0;
    if (Math.abs(total - (cash + aba)) >= 0.01) {
      showPosToast("សាច់ប្រាក់ + ABA ត្រូវតែបូកគ្នាស្មើនឹងសរុប!");
      return;
    }
  }

  openQrPaymentModal(totalPrice);
}

function openQrPaymentModal(totalPrice) {
  const modal = document.getElementById('qrPaymentModal');
  const totalEl = document.getElementById('qrPaymentTotal');
  if (!modal || !totalEl) return;

  totalEl.textContent = totalPrice;
  modal.classList.add('open');
}

function closeQrPaymentModal() {
  const modal = document.getElementById('qrPaymentModal');
  if (modal) modal.classList.remove('open');
}

function openReceiptModal(invoice, cartSnapshot, subtotalAmount) {
  const modal = document.getElementById('receiptModal');
  if (!modal) return;

  document.getElementById('receiptInvoiceId').textContent = `#${String(invoice.id).padStart(5, '0')}`;
  document.getElementById('receiptDate').textContent = invoice.date;
  document.getElementById('receiptTime').textContent = invoice.time;
  document.getElementById('receiptCashier').textContent = document.getElementById('acc-info-name')?.textContent || '--';
  document.getElementById('receiptCustomer').textContent = invoice.customer;
  document.getElementById('receiptPaymentMethod').textContent = invoice.payment_method;

  document.getElementById('receiptItemsBody').innerHTML = cartSnapshot.map(i => `
    <tr>
      <td class="py-1">${i.name}</td>
      <td class="text-end py-1">${i.quantity}</td>
      <td class="text-end py-1">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join('');

  document.getElementById('receiptSubtotal').textContent = `$${subtotalAmount.toFixed(2)}`;
  document.getElementById('receiptDiscount').textContent = `-$${(invoice.discount || 0).toFixed(2)}`;
  document.getElementById('receiptTotal').textContent = invoice.total_price;

  modal.classList.add('open');
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) modal.classList.remove('open');
}

function printReceipt() {
  window.print();
}


function confirmQrPayment() {
  if (cart.length === 0) {
    closeQrPaymentModal();
    return;
  }

  
  const customerSelect = document.getElementById('pay-customer');
  const customerName = customerSelect.options[customerSelect.selectedIndex].text;
  const customerId = customerSelect.value ? parseInt(customerSelect.value) : null;
  const paymentSelect = document.getElementById('pay-method-select');
  let paymentMethod = paymentSelect ? paymentSelect.value : '';
  const totalPrice = document.getElementById('summary-total').textContent;
  const totalAmount = parseFloat(totalPrice.replace('$', '')) || 0;
  const discountInput = document.getElementById('pay-discount');
  const discountAmount = discountInput ? (parseFloat(discountInput.value) || 0) : 0;

  
  if (paymentMethod === 'ចម្រុះ') {
    const cash = parseFloat(document.getElementById('split-cash-amount')?.value) || 0;
    const aba = parseFloat(document.getElementById('split-aba-amount')?.value) || 0;
    paymentMethod = `ចម្រុះ (សាច់ប្រាក់ $${cash.toFixed(2)} + ABA $${aba.toFixed(2)})`;
  }


  const itemsSummary = cart.map(i => `${i.name} (x${i.quantity})`).join(', ');


  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toISOString().slice(0, 10);


  const cartSnapshot = cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }));
  const subtotalAmount = cartSnapshot.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const newInvoice = {
    id: nextInvoiceId++,
    item_name: itemsSummary,
    items: cart.map(i => ({ pid: i.id, name: i.name, quantity: i.quantity })),
    customer: customerName === "ភ្ញៀវទូទៅ" ? "ភ្ញៀវទូទៅ" : customerName,
    customerId: customerId,
    payment_method: paymentMethod,
    total_price: totalPrice,
    discount: discountAmount,
    pointsEarned: (customerId && customerName !== "ភ្ញៀវទូទៅ") ? Math.floor(totalAmount) : 0,
    time: timeStr,
    date: dateStr,
    voided: false
  };


  if (typeof currentSales !== 'undefined') {
    currentSales.unshift(newInvoice); 
    if (typeof renderReportTable === 'function') {
      renderReportTable(currentSales); 
    }
  }

 
  if (customerId && typeof customers !== 'undefined') {
    const cust = customers.find(c => c.id === customerId);
    if (cust) {
      cust.points = (cust.points || 0) + Math.floor(totalAmount);
      if (typeof renderCustomers === 'function') renderCustomers();
    }
  }

  closeQrPaymentModal();


  openReceiptModal(newInvoice, cartSnapshot, subtotalAmount);

  clearCart(); 

  const discountEl2 = document.getElementById('pay-discount');
  if (discountEl2) discountEl2.value = 0;
  const cashEl = document.getElementById('split-cash-amount');
  const abaEl = document.getElementById('split-aba-amount');
  if (cashEl) cashEl.value = '';
  if (abaEl) abaEl.value = '';
  const splitWrap = document.getElementById('split-pay-wrap');
  if (splitWrap) splitWrap.classList.add('d-none');
  if (paymentSelect) paymentSelect.value = 'សាច់ប្រាក់';

  showPosToast("លក់ដោយជោគជ័យ! 🎉", 2500);
}

// customers
  let customers = [
    { id: 1, name: "រឹម​ ភារុន", phone: "096 555 123", email: "roun@mail.com", address: "ភ្នំពេញ", hasDebt: true, points: 24 },
    { id: 2, name: "វ៉េត សុជាតិ", phone: "012 888 999", email: "cheak@mail.com", address: "សៀមរាប", hasDebt: false, points: 8 },
    { id: 3, name: "ចាន់​ សារ៉ាក់", phone: "088 777 666", email: "rak@mail.com", address: "បាត់ដំបង", hasDebt: false, points: 0 },
    { id: 4, name: "លីហេង ស៊ីម៉េង", phone: "088 777 666", email: "meng@mail.com", address: "បាត់ដំបង", hasDebt: false, points: 15 },
    { id: 5, name: "វិទូ", phone: "088 777 888", email: "tu@mail.com", address: "ភ្នំពេញ", hasDebt: false, points: 15 },
    { id: 6, name: "រឹម​ វីរះ", phone: "088 777 999", email: "vireak@mail.com", address: "ភ្នំពេញ", hasDebt: false, points: 15 },
    { id: 7, name: "មករា", phone: "088 777 111", email: "makera@mail.com", address: "ភ្នំពេញ", hasDebt: false, points: 15 },
    { id: 8, name: "ចាន់ មិនា", phone: "088 777 222", email: "mine@mail.com", address: "ភ្នំពេញ", hasDebt: false, points: 15 },
    { id: 9, name: "សុ​ ផល", phone: "088 777 444", email: "pol@mail.com", address: "ភ្នំពេញ", hasDebt: false, points: 15 }
  ];

  
  function populatePosCustomerSelect() {
    const select = document.getElementById('pay-customer');
    if (!select) return;
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  }
  populatePosCustomerSelect();
  function renderCustomers(data = customers) {
    const grid = document.getElementById('custGrid');
    if(data.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-muted py-5 font-khmer italic fs-7">មិនមានទិន្នន័យអតិថិជនឡើយ។</div>`;
      return;
    }

    grid.innerHTML = data.map(c => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 border border-1 border-light-subtle rounded-3 shadow-sm hover-shadow transition bg-white p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="d-flex align-items-center gap-2">
              <div class="avatar bg-opacity-10 bg-success text-success rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:36px; height:36px; background-color: #e8f5e9;">
                ${c.name.charAt(0)}
              </div>
              <div>
                <h6 class="mb-0 fw-bold text-dark font-khmer">${c.name}</h6>
                <small class="text-muted" style="font-size: 11px;">ID: #CUST-${c.id}</small>
              </div>
            </div>
            ${c.hasDebt ? '<span class="badge border rounded-pill bg-light text-muted rounded-pill font-khmer" style="font-size:10px; padding: 4px 8px;">ធម្មតា</span>' : '<span class="badge bg-light text-muted border rounded-pill font-khmer" style="font-size:10px; padding: 4px 8px;">ធម្មតា</span>'}
          </div>
          
          <div class="customer-info my-2 py-2 border-top border-bottom border-light-subtle" style="font-size: 0.85rem;">
            <div class="text-secondary mb-1"><i class="fa-solid fa-phone me-1 text-muted w-20"></i> ${c.phone || '---'}</div>
            <div class="text-secondary mb-1"><i class="fa-solid fa-envelope me-1 text-muted w-20"></i> ${c.email || '---'}</div>
            <div class="text-secondary"><i class="fa-solid fa-location-dot me-1 text-muted w-20"></i> ${c.address || '---'}</div>
          </div>

          <div class="d-flex align-items-center gap-1 mb-2">
            <i class="fa-solid fa-star text-warning" style="font-size:11px;"></i>
            <span class="fw-semibold font-khmer" style="font-size:12px;">ពិន្ទុសមាជិក៖ ${c.points || 0} pts</span>
          </div>

          <div class="d-flex justify-content-end gap-1 mt-2">
            <button class="btn btn-light btn-sm text-success border-0 rounded-2" onclick="viewCustomerHistory(${c.id})" title="ប្រវត្តិទិញ">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </button>
            <button class="btn btn-light btn-sm text-primary border-0 rounded-2" onclick="editCust(${c.id})" data-bs-toggle="modal" data-bs-target="#custModal" title="កែប្រែ">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-light btn-sm text-danger border-0 rounded-2" onclick="deleteCust(${c.id})" title="លុប">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function openCustModal() {
    document.getElementById('custModalTitle').textContent = "បន្ថែមអតិថិជនថ្មី";
    document.getElementById('custId').value = "";
    document.getElementById('custName').value = "";
    document.getElementById('custPhone').value = "";
    document.getElementById('custEmail').value = "";
    document.getElementById('custAddress').value = "";
    document.getElementById('custDebt').checked = false;
  }
function saveCust() {
  const id = document.getElementById('custId').value;
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const hasDebt = document.getElementById('custDebt').checked;

  if (!name) {
    alert("សូមបំពេញឈ្មោះអតិថិជន!");
    return;
  }

  if (id) {
 
    const index = customers.findIndex(c => c.id == id);
    if (index !== -1) {
      const existingPoints = customers[index].points || 0;
      customers[index] = { id: Number(id), name, phone, email, address, hasDebt, points: existingPoints };
    }
  } else {
   
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    customers.push({ id: newId, name, phone, email, address, hasDebt, points: 0 });
  }

  renderCustomers(); 

  const modalEl = document.getElementById('custModal');
  

  const closeBtn = modalEl.querySelector('.btn-close') || modalEl.querySelector('[data-bs-dismiss="modal"]');
  if (closeBtn) {
    closeBtn.click();
  } else {
    
    modalEl.classList.remove('show');
    modalEl.style.display = 'none';
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}
 
  function editCust(id) {
    const c = customers.find(cust => cust.id === id);
    if (!c) return;

    document.getElementById('custModalTitle').textContent = "កែប្រែព័ត៌មានអតិថិជន";
    document.getElementById('custId').value = c.id;
    document.getElementById('custName').value = c.name;
    document.getElementById('custPhone').value = c.phone;
    document.getElementById('custEmail').value = c.email;
    document.getElementById('custAddress').value = c.address;
    document.getElementById('custDebt').checked = c.hasDebt;
  }


  function deleteCust(id) {
    if (confirm("តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?")) {
      customers = customers.filter(c => c.id !== id);
      renderCustomers();
    }
  }

  function searchCustomers() {
    const val = document.getElementById('custSearch').value.toLowerCase();
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(val) || 
      c.phone.includes(val)
    );
    renderCustomers(filtered);
  }


  function normalizeName(str) {
    return (str || '').replace(/\s+/g, '').toLowerCase();
  }

  function viewCustomerHistory(id) {
    const c = customers.find(cust => cust.id === id);
    if (!c) return;

    document.getElementById('custHistoryTitle').textContent = `ប្រវត្តិទិញ — ${c.name}`;
    const tbody = document.getElementById('custHistoryTbody');
    const target = normalizeName(c.name);

    const matches = (typeof currentSales !== 'undefined' ? currentSales : []).filter(s => {
      const n = normalizeName(s.customer);
      return n === target || n.includes(target) || target.includes(n);
    });

    if (matches.length === 0) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="4" class="text-center text-muted font-khmer py-3">មិនទាន់មានប្រវត្តិទិញសម្រាប់អតិថិជននេះទេ។</td></tr>`;
    } else {
      tbody.innerHTML = matches.map(s => `
        <tr>
          <td class="font-khmer">${s.item_name}</td>
          <td class="font-khmer">${s.payment_method}</td>
          <td class="fw-bold">${s.total_price}</td>
          <td>${s.time}</td>
        </tr>
      `).join('');
    }

    const modalEl = document.getElementById('custHistoryModal');
    if (window.bootstrap && window.bootstrap.Modal) {
      window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    } else {
      modalEl.classList.add('show');
      modalEl.style.display = 'block';
    }
  }

  renderCustomers();
    
        const currentSales = [
        { item_name: "កាហ្វេទឹកដោះគោទឹកកក", customer: "រឹម​ ភារុន", payment_method: "ABA", total_price: "$2.50", time: "08:30 AM", date: "2026-07-25" },
        { item_name: "តែបៃតងក្រូចឆ្មា", customer: "វ៉៉េង សុជាតិ", payment_method: "សាច់ប្រាក់", total_price: "$1.75", time: "09:15 AM", date: "2026-07-25" },
        { item_name: "នំខេកសូកូឡា", customer: "វ់េត ចាន់សារ៉ាក់", payment_method: "ABA", total_price: "$4.00", time: "10:00 AM", date: "2026-07-24" },
        { item_name: "ទឹកក្រូចដប", customer: "លី ហេងស៊ីម៉េង", payment_method: "វីង", total_price: "$3.50", time: "11:20 AM", date: "2026-07-24" },
        { item_name: "នំខេកសូកូឡា", customer: "ឃួន​ សុភាក់", payment_method: "ABA", total_price: "$8.50", time: "12:20 AM", date: "2026-07-23" },
        { item_name: "ទឹកក្រូចដប", customer: "វង់ វិទូ", payment_method: "AC", total_price: "$50", time: "1:20 AM", date: "2026-07-23" },
        { item_name: "កាហ្វេទឹកដោះគោទឹកកក", customer: "សយ សុខណា", payment_method: "សាច់ប្រាក់", total_price: "$70", time: "10:20 AM", date: "2026-07-22" },
        { item_name: "ពោត ", customer: "វេង វណ្ណនា", payment_method: "ABA", total_price: "$10.50", time: "4:20 AM", date: "2026-07-21" },
        { item_name: "ទឹកប្រេងឆា", customer: "សុខ ជា", payment_method: "AC", total_price: "$13.50", time: "1:20 AM", date: "2026-07-21" }
        ];

        function renderReportTable(sales = []) {
        const tbody = document.getElementById('reports-sales-tbody');
        document.getElementById('report-today-sales').textContent = sales.length;
        window.__currentReportRows = sales; // used by CSV export

        if (sales.length === 0) {
            tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5 text-muted fs-7 italic font-khmer">
                មិនទាន់មានការលក់នៅឡើយទេ
                </td>
            </tr>
            `;
            return;
        }

        tbody.innerHTML = sales.map((item, index) => `
            <tr class="font-khmer ${item.voided ? 'opacity-50' : ''}">
            <td class="text-center text-muted">${index + 1}</td>
            <td class="fw-bold text-dark" style="${item.voided ? 'text-decoration:line-through;' : ''}">${item.item_name}</td>
            <td class="text-secondary">${item.customer || 'ពោត'}</td>
            <td>
                <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1" style="font-size: 11px;">
                ${item.payment_method}
                </span>
            </td>
            <td class="fw-bold text-dark">${item.total_price}</td>
            <td class="text-muted fs-7">${item.date || '—'}</td>
            <td class="text-muted fs-7">${item.time}</td>
            <td class="text-center">
                ${item.voided
                  ? '<span class="badge bg-danger-subtle text-danger border border-danger-subtle" style="font-size:10px;">បានលុបចោល</span>'
                  : (item.id != null ? `<button class="btn btn-outline-danger btn-sm py-0 px-2" style="font-size:11px;" onclick="voidSale(${item.id})" title="Void/Refund"><i class="fa-solid fa-rotate-left"></i> Void</button>` : '')}
            </td>
            </tr>
        `).join('');
        }

       
        function filterReportsByDate() {
          const fromEl = document.getElementById('report-date-from');
          const toEl = document.getElementById('report-date-to');
          const from = fromEl && fromEl.value ? fromEl.value : null;
          const to = toEl && toEl.value ? toEl.value : null;

          let filtered = currentSales;
          if (from) filtered = filtered.filter(s => s.date >= from);
          if (to) filtered = filtered.filter(s => s.date <= to);

          renderReportTable(filtered);
        }

        function resetReportsFilter() {
          const fromEl = document.getElementById('report-date-from');
          const toEl = document.getElementById('report-date-to');
          if (fromEl) fromEl.value = '';
          if (toEl) toEl.value = '';
          renderReportTable(currentSales);
        }

        // ============ នាំចេញ CSV (Export) ============
        function exportReportsCSV() {
          const rows = window.__currentReportRows || currentSales;
          if (!rows.length) {
            alert('គ្មានទិន្នន័យសម្រាប់នាំចេញទេ។');
            return;
          }
          const header = ['#', 'មុខទំនិញ', 'អតិថិជន', 'ការទូទាត់', 'សរុប', 'កាលបរិច្ឆេទ', 'ពេលវេលា', 'ស្ថានភាព'];
          const escapeCsv = (val) => `"${String(val).replace(/"/g, '""')}"`;
          const lines = [header.map(escapeCsv).join(',')];
          rows.forEach((r, i) => {
            lines.push([i + 1, r.item_name, r.customer || '', r.payment_method, r.total_price, r.date || '', r.time, r.voided ? 'បានលុបចោល' : 'ធម្មតា']
              .map(escapeCsv).join(','));
          });
          const csvContent = '\uFEFF' + lines.join('\r\n'); // BOM for correct Khmer text in Excel
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }

       
        function voidSale(invoiceId) {
          if (typeof currentSales === 'undefined') return;
          const invoice = currentSales.find(s => s.id === invoiceId);
          if (!invoice || invoice.voided) return;

          const ok = confirm(
            `តើអ្នកចង់លុបចោលការលក់នេះមែនទេ?\n\nមុខទំនិញ: ${invoice.item_name}\nសរុប: ${invoice.total_price}\n\nស្តុកទំនិញនឹងត្រូវបានត្រឡប់មកវិញ។`
          );
          if (!ok) return;

          invoice.voided = true;

          
          if (Array.isArray(invoice.items)) {
            invoice.items.forEach(it => {
              const card = document.querySelector(`#productGrid .product-card[data-pid="${it.pid}"]`);
              if (card) {
                const stockEl = card.querySelectorAll('.card-body p')[1];
                if (stockEl) {
                  const match = stockEl.textContent.match(/[\d.]+/);
                  const currentStock = match ? parseFloat(match[0]) : 0;
                  const newStock = currentStock + it.quantity;
                  stockEl.textContent = stockEl.textContent.replace(/[\d.]+/, String(newStock));
                }
              }

              if (typeof products !== 'undefined') {
                const prod = products.find(p => p.name === it.name);
                if (prod) prod.stock += it.quantity;
              }

              if (typeof logStockMovement === 'function') {
                logStockMovement(it.name, 'in', it.quantity);
              }
            });
          }

          
          if (invoice.customerId && invoice.pointsEarned && typeof customers !== 'undefined') {
            const cust = customers.find(c => c.id === invoice.customerId);
            if (cust) {
              cust.points = Math.max(0, (cust.points || 0) - invoice.pointsEarned);
              if (typeof renderCustomers === 'function') renderCustomers();
            }
          }

          renderReportTable(window.__currentReportRows || currentSales);
          showPosToast('បានលុបចោលការលក់ ហើយស្តុកត្រូវបានត្រឡប់មកវិញ ↩️');
        }

        renderReportTable(currentSales);
      const tabTitles = {
        Dashboard: 'Dashboard',
        pos:       'លក់ទំនិញ',
        products:  'ផលិតផល',
        inventory: 'ស្ថានភាពស្តុក',
        customers: 'អតិថិជន',
        reports:   'របាយការណ៍',
        communication: 'ទំនាក់ទំនង',
        attendance: 'វត្តមាន',
        history:   'ប្រវត្តិលក់',
        account:   'គណនីខ្ញុំ'
      };

      document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const tabName = link.dataset.tab;

          
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');

         
          document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
          const target = document.getElementById('tab-' + tabName);
          if (target) target.classList.add('active');

        
          const pageTitle = document.getElementById('pageTitle');
          if (pageTitle) pageTitle.textContent = tabTitles[tabName] || '';
        });
      });


      const filterCat = document.getElementById('filterCat');
      const searchBox = document.getElementById('searchBox');
      const productCards = document.querySelectorAll('#productGrid .product-card');

      function applyPosFilter() {
      const selectedCat = filterCat.value;
      const keyword = searchBox.value.trim().toLowerCase();

      productCards.forEach(card => {
        const matchesCategory = selectedCat === 'all' || card.dataset.category === selectedCat;
        const nameEl = card.querySelector('.card-body h5');                        // ← បន្ថែម
        const productName = nameEl ? nameEl.textContent.trim().toLowerCase() : ''; // ← បន្ថែម
        const matchesSearch = productName.includes(keyword);                       // ← ប្តូរ
        card.classList.toggle('d-none', !(matchesCategory && matchesSearch));
      });
    }

      filterCat.addEventListener('change', applyPosFilter);
      searchBox.addEventListener('input', applyPosFilter);

     
      productCards.forEach((card, index) => {
        
        if (!card.dataset.pid) {
          card.dataset.pid = 'pos-' + index;
        }

        card.addEventListener('click', () => {
          const nameEl = card.querySelector('.card-body h5');
          const priceEl = card.querySelector('.card-body p');
          const stockEl = card.querySelectorAll('.card-body p')[1];

          if (!nameEl || !priceEl) return;

          const name = nameEl.textContent.trim();

          
          const priceMatch = priceEl.textContent.replace(/[^0-9.]/g, '');
          const price = parseFloat(priceMatch) || 0;

        
          if (stockEl) {
            const stockMatch = stockEl.textContent.replace(/[^0-9]/g, '');
            const stock = parseInt(stockMatch, 10);
            if (!isNaN(stock)) {
              if (stock <= 0) {
                showPosToast(`${name} អស់ស្តុក!`);
                return;
              }
              const existingItem = cart.find(i => i.id === card.dataset.pid);
              const qtyInCart = existingItem ? existingItem.quantity : 0;
              if (qtyInCart + 1 > stock) {
                showPosToast(`ស្តុក "${name}" នៅសល់ត្រឹមតែ ${stock} ប៉ុណ្ណោះ!`);
                return;
              }
            }
          }

          addToCart(card.dataset.pid, name, price);
          showPosToast(`បានបន្ថែម "${name}" ចូលកន្ត្រក`);

          
          const cartPanel = document.getElementById('cartPanel');
          if (cartPanel) {
            cartPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            cartPanel.classList.add('cart-highlight');
            setTimeout(() => cartPanel.classList.remove('cart-highlight'), 600);
          }
        });
      });

      function showPosToast(message, duration = 1500) {
        const toastEl = document.getElementById('posToast');
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('show');
        clearTimeout(showPosToast._t);
        showPosToast._t = setTimeout(() => toastEl.classList.remove('show'), duration);
      }
    
      let products = [
        { id: 1, name: "អង្គរ ៥គីឡូ",       category: "គ្រឿងទេស",   price: 6.50, stock: 11 },
        { id: 2, name: "ប្រេងសា ១លីត្រ",     category: "គ្រឿងទេស",   price: 3.20, stock: 12 },
        { id: 3, name: "គ្រាកគូឡ្យា កំប៉ុង",  category: "ភេសជ្ជៈ", price: 0.75, stock: 55 },
        { id: 4, name: "សាប៊ូកក់សក់",       category: "សម្ភារៈ",     price: 1.00, stock: 8  },
        { id: 5, name: "ទឹកសុទ្ធ ៦00ml",     category: "ភេសជ្ជៈ", price: 0.30, stock: 77 },
        { id: 6, name: "Coca-cola",               category: "ភេសជ្ជៈ", price: 2.50, stock: 49 },
        { id: 7, name: "fanta",              category: "ភេសជ្ជៈ", price: 2.30, stock: 48 },
        { id: 1, name: "កូកាកូឡា (Coca-Cola)", category: "ភេសជ្ជៈ", price: 0.60, stock: 120 },
        { id: 2, name: "PION", category: "ភេសជ្ជៈ", price: 0.70, stock: 85 },
        { id: 3, name: "កាហ្វេដប", category: "ភេសជ្ជៈ", price: 1.20, stock: 4 }, // ស្តុកទាប
        { id: 4, name: "ទឹកក្រូចដប", category: "ភេសជ្ជៈ", price: 2.50, stock: 50 },
        { id: 5, name: "ទឹកស៊ីអ៊ីវ", category: "គ្រឿងទេស", price: 1.50, stock: 100 },
        // --- ភេសជ្ជៈថែមថ្មីទាំង ១០ មុខ ---
        { id: 5, name: "តែបៃតង អូអ៊ិឈិ (Oishi)", category: "ភេសជ្ជៈ", price: 0.75, stock: 90 },
        { id: 6, name: "ពៅកម្លាំង វើក (WURKZ)", category: "ភេសជ្ជៈ", price: 0.65, stock: 150 },
        { id: 7, name: "ទឹកបរិសុទ្ធ វីតាល់ (Vital) ៥០០ml", category: "ភេសជ្ជៈ", price: 0.25, stock: 250 },
        { id: 8, name: "ការ៉ាបាវ (Carabao)", category: "ភេសជ្ជៈ", price: 0.70, stock: 5 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 9, name: "ស្តីងក្រហម (Sting)", category: "ភេសជ្ជៈ", price: 0.70, stock: 110 },
        { id: 10, name: "ទឹកដោះគោជូរ ឌីឡាក់ (Delight)", category: "ភេសជ្ជៈ", price: 0.50, stock: 65 },
        { id: 11, name: "តែក្រូចឆ្មា ហ្វ្រូស (Iced Tea)", category: "ភេសជ្ជៈ", price: 0.80, stock: 3 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 12, name: "ទឹកផ្លែឈើ ជូស៊ី (Juice)", category: "ភេសជ្ជៈ", price: 1.00, stock: 45 },
        { id: 13, name: "ប៉ិបស៊ី (Pepsi)", category: "ភេសជ្ជៈ", price: 0.60, stock: 135 },
        { id: 14, name: "ទឹកដោះគោ កំប៉ុង BEAR BRAND", category: "ភេសជ្ជៈ", price: 0.85, stock: 70 },

        // --- គ្រឿងទេសផ្សេងៗ ---
        { id: 15, name: "ទឹកស៊ីអ៊ីវ", category: "គ្រឿងទេស", price: 1.50, stock: 100 },
        { id: 15, name: "ទឹកស៊ីអ៊ីវ ម៉ាកស៊ុបភើគីតឆេន", category: "គ្រឿងទេស", price: 1.50, stock: 100 },
        { id: 16, name: "អំបិលអុីយ៉ូដ ១កញ្ចប់", category: "គ្រឿងទេស", price: 0.25, stock: 300 },
        { id: 17, name: "ទឹកត្រី ផ្ការំដួល", category: "គ្រឿងទេស", price: 1.80, stock: 80 },
        { id: 18, name: "ប៊ីចេង រូបភ្នំ (៥០០ក្រាម)", category: "គ្រឿងទេស", price: 1.25, stock: 6 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 19, name: "ស្ករសធម្មជាតិ (១គីឡូ)", category: "គ្រឿងទេស", price: 1.10, stock: 95 },
        { id: 20, name: "ម្សៅស៊ុបខ្នរ (Knorr) ប្រអប់ធំ", category: "គ្រឿងទេស", price: 2.30, stock: 40 },
        { id: 21, name: "ប្រេងខ្យង ម៉ាកក្បាលតោ", category: "គ្រឿងទេស", price: 2.10, stock: 75 },
        { id: 22, name: "ម្រេចកំពតម៉ត់ (កំប៉ុងតូច)", category: "គ្រឿងទេស", price: 3.50, stock: 2 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 23, name: "ទឹកប៉េងប៉ោះ ម៉ាករ៉ូសា (Roza)", category: "គ្រឿងទេស", price: 1.40, stock: 55 },
        { id: 24, name: "ទឹកម្ទេសហិរ ម៉ាកឆេហ្វ (Chef)", category: "គ្រឿងទេស", price: 1.35, stock: 60 },
        { id: 25, name: "ម្សៅការី (កញ្ចប់តូច)", category: "គ្រឿងទេស", price: 0.40, stock: 120 },
        // ================= សម្ភារៈ (ថែមថ្មី ១០ មុខ) =================
        { id: 26, name: "សាប៊ូដុសខ្លួន Lux (ដុំ)", category: "សម្ភារៈ", price: 0.85, stock: 90 },
        { id: 27, name: "សាប៊ូកក់សក់ Sunsilk (ដបមធ្យម)", category: "សម្ភារៈ", price: 2.75, stock: 45 },
        { id: 28, name: "ថ្នាំដុសធ្មេញ Colgate ប្រអប់ធំ", category: "សម្ភារៈ", price: 1.90, stock: 60 },
        { id: 29, name: "ច្រាសដុសធ្មេញ (កញ្ចប់ ១ថែម១)", category: "សម្ភារៈ", price: 1.20, stock: 8 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 30, name: "សាប៊ូលាងចាន សាន់ឡាយ (Sunlight)", category: "សម្ភារៈ", price: 1.10, stock: 110 },
        { id: 31, name: "ម្សៅសាប៊ូបោកខោអាវ វីហ្សូ (Viso) ៥០០ក្រាម", category: "សម្ភារៈ", price: 1.40, stock: 75 },
        { id: 32, name: "ក្រដាសអនាម័យ (ប៉េក ១០ដុំ)", category: "សម្ភារៈ", price: 2.20, stock: 35 },
        { id: 33, name: "ថង់យួរផ្លាស្ទិក (១គីឡូ)", category: "សម្ភារៈ", price: 1.50, stock: 4 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 34, name: "ទឹកជូតការ៉ូ ម៉ាកក្លីន (Clean)", category: "សម្ភារៈ", price: 2.60, stock: 50 },
        { id: 35, name: "អេប៉ុងលាងចាន (កញ្ចប់ ៥បន្ទះ)", category: "សម្ភារៈ", price: 0.60, stock: 140 }
];

      
      let nextId = products.length + 1;

      const LOW_STOCK_THRESHOLD = 5;

      let state = {
        category: 'all',
        search: '',
        editingId: null,
        deletingId: null
      };

      const tbody = document.getElementById('productsTbody');
      const searchInput = document.getElementById('searchInput');
      const categoryTabs = document.getElementById('categoryTabs');

      function render() {
        let list = products.filter(p => {
          const matchesCat = state.category === 'all' || p.category === state.category;
          const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase());
          return matchesCat && matchesSearch;
        });

        tbody.innerHTML = '';

        if (list.length === 0) {
          tbody.innerHTML = `<tr class="empty-row"><td colspan="7">មិនមានផលិតផលត្រូវនឹងលក្ខខណ្ឌនេះទេ</td></tr>`;
          return;
        }

        list.forEach((p, idx) => {
          const isLow = p.stock <= LOW_STOCK_THRESHOLD;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><div class="prod-thumb"><i class="fa-regular fa-image"></i></div></td>
            <td>${idx + 1}</td>
            <td class="prod-name">${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.category)}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td><span class="badge-stock ${isLow ? 'badge-low' : ''}">${isLow ? 'ស្តុកទាប' : 'គ្រប់គ្រាន់'}</span></td>
          `;
          tbody.appendChild(tr);
        });

        renderLowStockAlert();
      }

     
      const REORDER_POINT_MULTIPLIER = 5; 

      function renderLowStockAlert() {
        const grid = document.getElementById('lowStockAlertGrid');
        const countLabel = document.getElementById('lowStockCountLabel');
        if (!grid || !countLabel) return;

        const lowItems = products
          .filter(p => p.stock <= LOW_STOCK_THRESHOLD * 3) 
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 4);

        countLabel.textContent = `${lowItems.length} ធាតុត្រូវការជាបន្ទាន់`;

        if (lowItems.length === 0) {
          grid.innerHTML = `<div class="col-12 text-center text-muted small km py-3">គ្មានផលិតផលជិតអស់ស្តុកនាពេលនេះទេ 🎉</div>`;
          return;
        }

        grid.innerHTML = lowItems.map(p => {
          const reorderPoint = LOW_STOCK_THRESHOLD * REORDER_POINT_MULTIPLIER;
          const isCritical = p.stock <= LOW_STOCK_THRESHOLD;
          const pct = Math.max(4, Math.min(100, Math.round((p.stock / reorderPoint) * 100)));
          const badgeClass = isCritical ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning';
          const barClass = isCritical ? 'bg-danger' : 'bg-warning';
          const numClass = isCritical ? 'text-danger' : 'text-warning';
          const label = isCritical ? 'Critical' : 'Low';
          return `
            <div class="col-md-6 col-xl-3">
              <div class="border rounded-3 p-3 h-100">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="km fw-semibold small">${escapeHtml(p.name)}</div>
                  <span class="badge ${badgeClass} rounded-pill">${label}</span>
                </div>
                <div class="progress mb-1" style="height:6px;">
                  <div class="progress-bar ${barClass}" style="width:${pct}%"></div>
                </div>
                <div class="km text-secondary small">នៅសល់ <b class="${numClass}">${p.stock}</b> ឯកតា · ចំណុចបញ្ជាទិញ ${reorderPoint}</div>
              </div>
            </div>`;
        }).join('');
      }

      function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      // category tabs
      categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.category = btn.dataset.cat;
        render();
      });

      // search
      searchInput.addEventListener('input', (e) => {
        state.search = e.target.value;
        render();
      });

      // add / edit modal
      const productModal = document.getElementById('productModal');
      const productModalTitle = document.getElementById('productModalTitle');
      const fName = document.getElementById('fName');
      const fCategory = document.getElementById('fCategory');
      const fPrice = document.getElementById('fPrice');
      const fStock = document.getElementById('fStock');

      const openAddBtnEl = document.getElementById('openAddBtn');
      if (openAddBtnEl) openAddBtnEl.addEventListener('click', () => openProductModal(null));
      document.getElementById('cancelProductBtn').addEventListener('click', () => closeProductModal());

      function openProductModal(id) {
        state.editingId = id;
        if (id) {
          const p = products.find(p => p.id === id);
          productModalTitle.textContent = 'កែប្រែផលិតផល';
          fName.value = p.name;
          fCategory.value = p.category;
          fPrice.value = p.price;
          fStock.value = p.stock;
        } else {
          productModalTitle.textContent = 'បន្ថែមផលិតផល';
          fName.value = '';
          fCategory.value = 'គ្រឿងទេស';
          fPrice.value = '';
          fStock.value = '';
        }
        productModal.classList.add('open');
      }

      function closeProductModal() {
        productModal.classList.remove('open');
        state.editingId = null;
      }

      // QR payment modal buttons
      const qrCancelBtn = document.getElementById('cancelQrPaymentBtn');
      const qrConfirmBtn = document.getElementById('confirmQrPaymentBtn');
      if (qrCancelBtn) qrCancelBtn.addEventListener('click', () => closeQrPaymentModal());
      if (qrConfirmBtn) qrConfirmBtn.addEventListener('click', () => confirmQrPayment());

      // Receipt modal buttons
      const closeReceiptBtn = document.getElementById('closeReceiptBtn');
      const printReceiptBtn = document.getElementById('printReceiptBtn');
      if (closeReceiptBtn) closeReceiptBtn.addEventListener('click', () => closeReceiptModal());
      if (printReceiptBtn) printReceiptBtn.addEventListener('click', () => printReceipt());

      document.getElementById('saveProductBtn').addEventListener('click', () => {
        const name = fName.value.trim();
        const category = fCategory.value;
        const price = parseFloat(fPrice.value) || 0;
        const stock = parseInt(fStock.value) || 0;

        if (!name) {
          fName.focus();
          return;
        }

        if (state.editingId) {
          const p = products.find(p => p.id === state.editingId);
          p.name = name; p.category = category; p.price = price; p.stock = stock;
        } else {
          products.push({ id: nextId++, name, category, price, stock });
        }

        closeProductModal();
        render();
      });

      // delete modal
      const deleteModal = document.getElementById('deleteModal');
      const deleteProductName = document.getElementById('deleteProductName');

      document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        deleteModal.classList.remove('open');
        state.deletingId = null;
      });

      document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        products = products.filter(p => p.id !== state.deletingId);
        deleteModal.classList.remove('open');
        state.deletingId = null;
        render();
      });

      // row action delegation
      tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === 'edit') {
          openProductModal(id);
        } else if (action === 'delete') {
          const p = products.find(p => p.id === id);
          state.deletingId = id;
          deleteProductName.textContent = p ? p.name : '';
          deleteModal.classList.add('open');
        } else if (action === 'addstock') {
          const p = products.find(p => p.id === id);
          const qty = prompt('បញ្ចូលចំនួនស្តុកបន្ថែមសម្រាប់ "' + p.name + '"', '1');
          if (qty !== null) {
            const n = parseInt(qty);
            if (!isNaN(n) && n > 0) {
              p.stock += n;
              logStockMovement(p.name, 'in', n);
              render();
            }
          }
        } else if (action === 'removestock') {
          const p = products.find(p => p.id === id);
          const qty = prompt('បញ្ចូលចំនួនស្តុកត្រូវដកសម្រាប់ "' + p.name + '"', '1');
          if (qty !== null) {
            const n = parseInt(qty);
            if (!isNaN(n) && n > 0) {
              if (n > p.stock) {
                alert('ចំនួនត្រូវដកលើសពីស្តុកនៅសល់ (' + p.stock + ')។');
                return;
              }
              p.stock -= n;
              logStockMovement(p.name, 'out', n);
              render();
            }
          }
        }
      });

      render();


      
  
      let stockHistory = [
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "គ្រាកគូឡ្យា កំប៉ុង", type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "សាប៊ូកក់សក់",     type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "fanta",            type: "out", qty: 2, time: "30/06/2026 14:38" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "សាប៊ូកក់សក់",     type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "koka",              type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 2, time: "30/06/2026 14:00" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 3, time: "30/06/2026 14:00" },
        { product: "គ្រាកគូឡ្យា កំប៉ុង", type: "out", qty: 3, time: "30/06/2026 14:00" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 7, time: "30/06/2026 14:00" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 4, time: "30/06/2026 14:00" },
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 9, time: "30/06/2026 14:00" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 1, time: "30/06/2026 14:00" },
        { product: "គ្រាកគូឡ្យា កំប៉ុង", type: "out", qty: 1, time: "30/06/2026 14:00" },
        { product: "សាប៊ូកក់សក់",     type: "out", qty: 4, time: "30/06/2026 14:00" },
      ];

      // ឈ្មោះបុគ្គលិកដែលកំពុងចូលប្រើប្រាស់ប្រព័ន្ធ (ត្រូវគ្នានឹងផ្ទាំង "គណនីខ្ញុំ")
      const CURRENT_STAFF_NAME = document.getElementById('acc-info-name')
        ? document.getElementById('acc-info-name').textContent.trim()
        : 'បុគ្គលិក';

      // កត់ត្រាព្រឹត្តិការណ៍ស្តុកចូល/ចេញ ព្រមទាំងឈ្មោះបុគ្គលិកដែលធ្វើសកម្មភាព (audit trail)
      function logStockMovement(productName, type, qty) {
        const now = new Date();
        const time = now.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        stockHistory.unshift({ product: productName, type, qty, time, staff: CURRENT_STAFF_NAME });
        renderInventory();
      }

      const inventorySearchInput = document.getElementById('inventorySearchInput');
      const inventoryTbody = document.getElementById('inventoryTbody');
      const stockHistoryTbody = document.getElementById('stockHistoryTbody');

      function renderInventory() {
        const keyword = (inventorySearchInput ? inventorySearchInput.value : '').trim().toLowerCase();
        const list = products.filter(p => p.name.toLowerCase().includes(keyword));
 
        inventoryTbody.innerHTML = '';
 
        if (list.length === 0) {
          inventoryTbody.innerHTML = `<tr class="empty-row"><td colspan="5">មិនមានផលិតផលត្រូវនឹងលក្ខខណ្ឌនេះទេ</td></tr>`;
        } else {
          list.forEach(p => {
            const isLow = p.stock <= LOW_STOCK_THRESHOLD;
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="prod-name">${escapeHtml(p.name)}</td>
              <td>${escapeHtml(p.category)}</td>
              <td>$${p.price.toFixed(2)}</td>
              <td>${p.stock}</td>
              <td><span class="badge-stock ${isLow ? 'badge-low' : ''}">${isLow ? 'ស្តុកទាប' : 'គ្រប់គ្រាន់'}</span></td>
            `;
            inventoryTbody.appendChild(tr);
          });
        }
 
        renderStockHistory();
      }
 
      function renderStockHistory() {
        stockHistoryTbody.innerHTML = '';
 
        if (stockHistory.length === 0) {
          stockHistoryTbody.innerHTML = `<tr class="empty-row"><td colspan="4">មិនទាន់មានប្រវត្តិផ្លាស់ប្តូរស្តុកទេ</td></tr>`;
          return;
        }
 
        stockHistory.forEach(h => {
          const tr = document.createElement('tr');
          const typeLabel = h.type === 'out' ? 'ចេញ' : 'ចូល';
          const typeClass = h.type === 'out' ? 'move-out' : 'move-in';
          tr.innerHTML = `
            <td class="prod-name">${escapeHtml(h.product)}</td>
            <td class="${typeClass}">${typeLabel}</td>
            <td>${h.qty}</td>
            <td>${escapeHtml(h.staff || '—')}</td>
            <td>${escapeHtml(h.time)}</td>
          `;
          stockHistoryTbody.appendChild(tr);
        });
      }
 
      if (inventorySearchInput) {
        inventorySearchInput.addEventListener('input', renderInventory);
      }
 
      renderInventory();
   
  

  function updateProfile() {
    const nameVal = document.getElementById('edit-acc-name').value.trim();
    const emailVal = document.getElementById('edit-acc-email').value.trim();

    if (!nameVal || !emailVal) {
      alert("សូមបំពេញឈ្មោះ និងអ៊ីមែលឱ្យបានត្រឹមត្រូវ!");
      return;
    }

    // ធ្វើបច្ចុប្បន្នភាពអក្សរនៅលើកាតខាងឆ្វេងភ្លាមៗ (Real-time)
    document.getElementById('acc-info-name').textContent = nameVal;
    document.getElementById('acc-info-email').textContent = emailVal;
    const nameDisplay = document.getElementById('acc-info-name-display');
    const emailDisplay = document.getElementById('acc-info-email-display');
    if (nameDisplay) nameDisplay.textContent = nameVal;
    if (emailDisplay) emailDisplay.textContent = emailVal;
    const topbarProfileName = document.getElementById('topbarProfileName');
    if (topbarProfileName) topbarProfileName.textContent = nameVal;

    alert("រក្សាទុកព័ត៌មានផ្ទាល់ខ្លួនជោគជ័យ!");
  }

  // ២. អនុគមន៍រក្សាទុកការប្តូរពាក្យសម្ងាត់
  function changePassword() {
    const current = document.getElementById('pass-current').value;
    const newPass = document.getElementById('pass-new').value;
    const confirmPass = document.getElementById('pass-confirm').value;

    if (!current || !newPass || !confirmPass) {
      alert("សូមបំពេញប្រអប់ពាក្យសម្ងាត់ឱ្យបានគ្រប់គ្រាន់!");
      return;
    }

    if (newPass !== confirmPass) {
      alert("ពាក្យសម្ងាត់ថ្មី និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នានោះទេ!");
      return;
    }

    alert("ផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ!");
    
    // សម្អាតប្រអប់ក្រោយពេលប្តូររួច
    document.getElementById('pass-current').value = "";
    document.getElementById('pass-new').value = "";
    document.getElementById('pass-confirm').value = "";
  }

  // ៣. អនុគមន៍សម្រាប់ ចុចមើល/លាក់ ពាក្យសម្ងាត់ (Eye Icon)
  function togglePass(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = "password";
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }


  
      (function () {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const closeBtn = document.getElementById('sidebarCloseBtn');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar || !toggleBtn || !backdrop) return;

        function openSidebar() {
          sidebar.classList.add('sidebar-open');
          backdrop.classList.add('show');
        }
        function closeSidebar() {
          sidebar.classList.remove('sidebar-open');
          backdrop.classList.remove('show');
        }

        toggleBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        backdrop.addEventListener('click', closeSidebar);

        
        sidebar.querySelectorAll('.nav-link[data-tab]').forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth < 992) closeSidebar();
          });
        });

       
        window.addEventListener('resize', () => {
          if (window.innerWidth >= 992) closeSidebar();
        });
      })();


  document.getElementById('logoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = "../../../index.html";
});


  
  const STAFF_STORAGE_PREFIX = 'iam_staff_';
  window.STAFF_STORAGE_PREFIX = STAFF_STORAGE_PREFIX;

  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(STAFF_STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('localStorage read failed for', key, e);
      return fallback;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(STAFF_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage save failed for', key, e);
    }
  }

  let commHistory = loadFromStorage('commHistory', []);

  const commTypeLabels = {
    message: 'សារទូទៅ',
    support: 'សំណើគាំទ្រ',
    issue:   'រាយការណ៍បញ្ហា'
  };
  const commTypeBadgeClass = {
    message: 'bg-primary-subtle text-primary',
    support: 'bg-warning-subtle text-warning-emphasis',
    issue:   'bg-danger-subtle text-danger'
  };

  const announcements = [
    {
      title: 'កាលវិភាគចែកវេនប្រចាំខែក្រោយ',
      body: 'សូមបុគ្គលិកទាំងអស់ពិនិត្យកាលវិភាគវេនប្រចាំខែក្រោយ ដែលនឹងបិទផ្សាយនៅចុងសប្តាហ៍នេះ។',
      date: '20-Jul-2026'
    },
    {
      title: 'ការធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធលក់ទំនិញ',
      body: 'ប្រព័ន្ធលក់ទំនិញ (POS) ត្រូវបានធ្វើបច្ចុប្បន្នភាព បន្ថែមមុខងារទូទាត់តាម QR Code។ សូមធ្វើតេស្តប្រើប្រាស់ ហើយរាយការណ៍បញ្ហាមកអ្នកគ្រប់គ្រងបើមាន។',
      date: '16-Jul-2026'
    },
    {
      title: 'ការប្រកួតប្រជែងលក់ប្រចាំខែ',
      body: 'បុគ្គលិកលក់បានច្រើនបំផុតប្រចាំខែនេះ នឹងទទួលបានប្រាក់រង្វាន់! សូមខិតខំបន្ថែម។',
      date: '10-Jul-2026'
    }
  ];

  function renderCommHistory() {
    const list = document.getElementById('commHistoryList');
    if (!list) return;

    if (commHistory.length === 0) {
      list.innerHTML = `<p class="text-muted small text-center py-3">មិនទាន់មានសារត្រូវបានផ្ញើទេ</p>`;
      return;
    }

    list.innerHTML = commHistory.map(item => `
      <div class="border-bottom border-light-subtle py-2">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <span class="badge ${commTypeBadgeClass[item.type]} px-2 py-1" style="font-size:10px;">${item.typeLabel}</span>
          <span class="text-muted" style="font-size:11px;">${item.time}</span>
        </div>
        <div class="text-dark" style="font-size:.85rem;">${item.content}</div>
      </div>
    `).join('');
  }

  function renderAnnouncements() {
    const list = document.getElementById('announcementList');
    if (!list) return;

    list.innerHTML = announcements.map(a => `
      <div class="border-bottom border-light-subtle py-2 mb-1">
        <div class="d-flex justify-content-between align-items-start">
          <div class="fw-bold text-dark" style="font-size:.9rem;">${a.title}</div>
          <span class="text-muted flex-shrink-0 ms-2" style="font-size:11px;">${a.date}</span>
        </div>
        <div class="text-secondary mt-1" style="font-size:.83rem;">${a.body}</div>
      </div>
    `).join('');
  }

  function sendCommMessage() {
    const typeSelect = document.getElementById('comm-type');
    const contentBox = document.getElementById('comm-content');
    const content = contentBox.value.trim();

    if (!content) {
      showPosToast('សូមបញ្ចូលខ្លឹមសារជាមុនសិន');
      return;
    }

    const type = typeSelect.value;
    const now = new Date();

    commHistory.unshift({
      type,
      typeLabel: commTypeLabels[type],
      content,
      time: now.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    });

    contentBox.value = '';
    saveToStorage('commHistory', commHistory);
    renderCommHistory();
    showPosToast('បានផ្ញើសារទៅអ្នកគ្រប់គ្រងដោយជោគជ័យ! 📨');
  }


  let attendanceState = loadFromStorage('attendanceState', { checkedIn: false, checkInTime: null });

  let attendanceHistory = loadFromStorage('attendanceHistory', [
    { date: '19-Jul-2026', in: '08:02', out: '17:05', hours: '9ម៉ោង 03នាទី' },
    { date: '18-Jul-2026', in: '07:58', out: '17:00', hours: '9ម៉ោង 02នាទី' },
    { date: '17-Jul-2026', in: '08:10', out: '16:55', hours: '8ម៉ោង 45នាទី' }
  ]);

  let leaveRequests = loadFromStorage('leaveRequests', []);

  const workSchedule = [
    { day: 'ច័ន្ទ',     in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'អង្គារ',    in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'ពុធ',       in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'ព្រហស្បតិ៍', in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'សុក្រ',     in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'សៅរ៍',      in: '08:00', out: '12:00', status: 'ព្រឹកតែម្តង' },
    { day: 'អាទិត្យ',   in: '-', out: '-', status: 'ថ្ងៃឈប់សម្រាក' }
  ];

  function renderWorkSchedule() {
    const tbody = document.getElementById('workScheduleTbody');
    if (!tbody) return;
    tbody.innerHTML = workSchedule.map(s => `
      <tr>
        <td class="fw-semibold text-dark">${s.day}</td>
        <td>${s.in}</td>
        <td>${s.out}</td>
        <td>${s.status}</td>
      </tr>
    `).join('');
  }

  function renderAttendanceHistory() {
    const tbody = document.getElementById('attendanceHistoryTbody');
    if (!tbody) return;

    if (attendanceHistory.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">មិនទាន់មានប្រវត្តិវត្តមានទេ</td></tr>`;
      return;
    }

    tbody.innerHTML = attendanceHistory.map(r => `
      <tr>
        <td>${r.date}</td>
        <td>${r.in}</td>
        <td>${r.out}</td>
        <td>${r.hours}</td>
      </tr>
    `).join('');
  }

  function renderLeaveRequests() {
    const list = document.getElementById('leaveRequestList');
    if (!list) return;

    if (leaveRequests.length === 0) {
      list.innerHTML = `<p class="text-muted small text-center py-2">មិនទាន់មានសំណើសុំច្បាប់ទេ</p>`;
      return;
    }

    list.innerHTML = leaveRequests.map(r => `
      <div class="border-bottom border-light-subtle py-2">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <span class="fw-semibold text-dark" style="font-size:.85rem;">${r.start} → ${r.end}</span>
          <span class="badge ${r.status === 'បានអនុម័ត' ? 'bg-success-subtle text-success-emphasis' : r.status === 'បានបដិសេធ' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-warning-subtle text-warning-emphasis'} px-2 py-1" style="font-size:10px;">${r.status}</span>
        </div>
        <div class="text-secondary" style="font-size:.8rem;">${r.reason}</div>
      </div>
    `).join('');
  }

  function updateAttendanceUI() {
    const label = document.getElementById('att-status-label');
    const btn = document.getElementById('attCheckBtn');
    if (!label || !btn) return;

    if (attendanceState.checkedIn) {
      label.textContent = `កំពុងធ្វើការ (ចូលម៉ោង ${attendanceState.checkInTime})`;
      btn.innerHTML = `<i class="fa-solid fa-right-from-bracket me-1"></i>ចេញពីការងារ (Check Out)`;
      btn.classList.remove('btn-moss');
      btn.classList.add('btn-danger');
    } else {
      label.textContent = 'មិនទាន់ចូលធ្វើការ';
      btn.innerHTML = `<i class="fa-solid fa-right-to-bracket me-1"></i>ចូលធ្វើការ (Check In)`;
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-moss');
    }
  }

  function toggleAttendance() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    if (!attendanceState.checkedIn) {
      attendanceState.checkedIn = true;
      attendanceState.checkInTime = timeStr;
      saveToStorage('attendanceState', attendanceState);
      updateAttendanceUI();
      showPosToast('បានចូលធ្វើការ! មានថ្ងៃធ្វើការល្អ 👋');
    } else {
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      attendanceHistory.unshift({
        date: dateStr,
        in: attendanceState.checkInTime,
        out: timeStr,
        hours: '—'
      });
      attendanceState.checkedIn = false;
      attendanceState.checkInTime = null;
      saveToStorage('attendanceState', attendanceState);
      saveToStorage('attendanceHistory', attendanceHistory);
      updateAttendanceUI();
      renderAttendanceHistory();
      showPosToast('បានចេញពីការងារ! អរគុណសម្រាប់ថ្ងៃនេះ 🙏');
    }
  }

  function submitLeaveRequest() {
    const startInput = document.getElementById('leave-start');
    const endInput = document.getElementById('leave-end');
    const reasonInput = document.getElementById('leave-reason');

    const start = startInput.value;
    const end = endInput.value;
    const reason = reasonInput.value.trim();

    if (!start || !end || !reason) {
      showPosToast('សូមបំពេញកាលបរិច្ឆេទ និងមូលហេតុឲ្យគ្រប់');
      return;
    }

    const staffName = document.getElementById('acc-info-name')?.textContent || 'បុគ្គលិក';
    leaveRequests.unshift({
      id: Date.now(),
      staff: staffName,
      start, end, reason,
      status: 'កំពុងរង់ចាំអនុម័ត',
      submittedAt: new Date().toISOString()
    });
    saveToStorage('leaveRequests', leaveRequests);

    startInput.value = '';
    endInput.value = '';
    reasonInput.value = '';

    renderLeaveRequests();
    showPosToast('បានដាក់សំណើសុំច្បាប់រួចរាល់! 📋');
  }

  // Initialize Communication & Attendance panels
  renderCommHistory();
  renderAnnouncements();
  renderWorkSchedule();
  renderAttendanceHistory();
  renderLeaveRequests();
  updateAttendanceUI();

  const attCurrentDateEl = document.getElementById('att-current-date');
  if (attCurrentDateEl) {
    attCurrentDateEl.textContent = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }



      (function () {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const closeBtn = document.getElementById('sidebarCloseBtn');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar || !toggleBtn || !backdrop) return;

        function openSidebar() {
          sidebar.classList.add('sidebar-open');
          backdrop.classList.add('show');
        }
        function closeSidebar() {
          sidebar.classList.remove('sidebar-open');
          backdrop.classList.remove('show');
        }

        toggleBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        backdrop.addEventListener('click', closeSidebar);

        // Close the mobile drawer automatically after picking a menu item
        sidebar.querySelectorAll('.nav-link[data-tab]').forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth < 992) closeSidebar();
          });
        });

       
        window.addEventListener('resize', () => {
          if (window.innerWidth >= 992) closeSidebar();
        });
      })();

      // ============ Topbar: ស្វែងរក / ការជូនដំណឹង / ប្រូហ្វាល ============
      (function () {
        function switchToTab(tabKey) {
          const link = document.querySelector(`.sidebar .nav-link[data-tab="${tabKey}"]`);
          if (link) link.click();
        }

        function closeAllTopbarPopups(except) {
          ['topbarSearchBox', 'topbarNotifDropdown'].forEach(id => {
            if (id === except) return;
            const el = document.getElementById(id);
            if (el) el.classList.add('d-none');
          });
        }

        // ---------- ស្វែងរកផលិតផល (Search) ----------
        const searchBtn = document.getElementById('topbarSearchBtn');
        const searchBox = document.getElementById('topbarSearchBox');
        const searchInput = document.getElementById('topbarSearchInput');

        if (searchBtn && searchBox && searchInput) {
          searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllTopbarPopups('topbarSearchBox');
            searchBox.classList.toggle('d-none');
            if (!searchBox.classList.contains('d-none')) searchInput.focus();
          });

          searchInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const keyword = searchInput.value.trim();
            if (!keyword) return;

           
            switchToTab('products');
            const posSearchBox = document.getElementById('searchBox');
            if (posSearchBox) {
              posSearchBox.value = keyword;
              posSearchBox.dispatchEvent(new Event('input'));
            }
            searchBox.classList.add('d-none');
            searchInput.value = '';
          });
        }

        
        const bellBtn = document.getElementById('topbarBellBtn');
        const bellCount = document.getElementById('topbarBellCount');
        const notifDropdown = document.getElementById('topbarNotifDropdown');
        const notifList = document.getElementById('topbarNotifList');

        function renderTopbarNotifications() {
          if (!bellCount || !notifList || typeof products === 'undefined') return;

          const lowItems = products
            .filter(p => p.stock <= LOW_STOCK_THRESHOLD * 3)
            .sort((a, b) => a.stock - b.stock);

          if (lowItems.length === 0) {
            bellCount.classList.add('d-none');
            notifList.innerHTML = `<div class="text-muted small text-center py-3">គ្មានការជូនដំណឹងថ្មីទេ 🎉</div>`;
            return;
          }

          bellCount.textContent = lowItems.length;
          bellCount.classList.remove('d-none');

          notifList.innerHTML = lowItems.slice(0, 8).map(p => {
            const isCritical = p.stock <= LOW_STOCK_THRESHOLD;
            return `
              <div class="d-flex align-items-start gap-2 py-2 border-bottom border-light-subtle" style="font-size:0.82rem;">
                <i class="fa-solid ${isCritical ? 'fa-triangle-exclamation text-danger' : 'fa-circle-exclamation text-warning'} mt-1"></i>
                <div>
                  <div class="fw-semibold text-dark">${p.name}</div>
                  <div class="text-muted">នៅសល់ត្រឹមតែ ${p.stock} ឯកតា</div>
                </div>
              </div>`;
          }).join('');
        }

        if (bellBtn && notifDropdown) {
          bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllTopbarPopups('topbarNotifDropdown');
            renderTopbarNotifications();
            notifDropdown.classList.toggle('d-none');
          });
        }

        
        renderTopbarNotifications();

        
        const profilePill = document.getElementById('topbarProfilePill');
        if (profilePill) {
          profilePill.addEventListener('click', () => switchToTab('account'));
        }

        
        const topbarProfileName = document.getElementById('topbarProfileName');
        const accInfoName = document.getElementById('acc-info-name');
        if (topbarProfileName && accInfoName) {
          topbarProfileName.textContent = accInfoName.textContent;
        }

        
        document.addEventListener('click', () => closeAllTopbarPopups());
      })();

      
      (function () {
        const tabButtons = document.querySelectorAll('#inventoryNavTabs [data-tab-target]');
        if (tabButtons.length === 0) return;

        tabButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab-target');
            const card = btn.closest('.card');
            if (!card) return;

            tabButtons.forEach(b => {
              b.classList.toggle('active', b === btn);
              b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
            });

            card.querySelectorAll('.tab-pane').forEach(pane => {
              pane.classList.toggle('d-none', pane.id !== targetId);
            });
          });
        });
      })();