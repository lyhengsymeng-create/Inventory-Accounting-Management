document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg){
    if(!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

// Unified category list — kept identical to the customer shop (shop.html / script.js)
// so a category picked here always matches a filter on the storefront.
let categories = [
  'Electronics / គ្រឿងអេឡិចត្រូនិច',
  'Fashion / សម្លៀកបំពាក់',
  'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ',
  'Beauty / ផលិតផលថែទាំសម្រស់',
  'Sports / កីឡា',
  'Grocery / គ្រឿងទេស',
  'Beverages / ភេសជ្ជៈ'
];

const STOCK_KEY = 'shopease_stock'; // shared with the Customer shop; declared early so it's in scope everywhere below

let suppliers = [
  'ក្រុមហ៊ុនចែកចាយ ABC',
  'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន',
  'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ'
];

let products = [
  { id: 1,  name: 'កូកា-កូឡា 330ml',      category: 'Beverages / ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.75, quantity: 30, active: true ,brand: 'Coca-Cola', rating: 5, discountPercent: 0 },
  { id: 2,  name: 'Fan Ta 330ml', category: 'Beverages / ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.75, quantity: 30, active: true ,brand: 'Fanta', rating: 4, discountPercent: 0 },
  { id: 3,  name: 'ទឹកសុទ្ធ 500ml',       category: 'Beverages / ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 0.40, quantity: 30, active: true ,brand: 'PureSpring', rating: 4, discountPercent: 0 },
  { id: 4,  name: 'ទឹកក្រូច',            category: 'Beverages / ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.20, quantity: 30, active: true ,brand: 'PureSpring', rating: 4, discountPercent: 10 },
  { id: 5,  name: 'ទឹកផ្លែប៉ោម',         category: 'Beverages / ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.30, quantity: 30, active: true ,brand: 'PureSpring', rating: 4, discountPercent: 0 },

  { id: 6,  name: 'មីកញ្ចប់',            category: 'Grocery / គ្រឿងទេស', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.55, quantity: 30, active: true ,brand: 'Mama', rating: 4, discountPercent: 0 },
  { id: 7,  name: 'នំប៉័ង',              category: 'Grocery / គ្រឿងទេស', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.80, quantity: 30, active: true ,brand: 'FarmFresh', rating: 4, discountPercent: 0 },
  { id: 8,  name: 'នំប៊ីស្គីត',           category: 'Grocery / គ្រឿងទេស', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 1.20, quantity: 30, active: true ,brand: 'FarmFresh', rating: 3, discountPercent: 15 },
  { id: 9,  name: 'ដំឡូងបំពង',           category: 'Grocery / គ្រឿងទេស', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 1.50, quantity: 0, active: false ,brand: 'FarmFresh', rating: 3, discountPercent: 0 },
  { id: 10, name: 'សណ្តែកដីលីង',         category: 'Grocery / គ្រឿងទេស', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 1.00, quantity: 30, active: true ,brand: 'FarmFresh', rating: 4, discountPercent: 0 },

  { id: 11, name: 'អង្ករ 25kg',          category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 20.00, quantity: 30, active: true ,brand: 'Angkor', rating: 5, discountPercent: 0 },
  { id: 12, name: 'ប្រេងឆា 1L',          category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 2.80, quantity: 30, active: true ,brand: 'Chefs', rating: 4, discountPercent: 0 },
  { id: 13, name: 'ទឹកត្រី',             category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.60, quantity: 30, active: true ,brand: 'Khmer', rating: 4, discountPercent: 0 },
  { id: 14, name: 'ទឹកស៊ីអ៊ីវ',          category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.50, quantity: 0, active: false ,brand: 'Khmer', rating: 3, discountPercent: 0 },
  { id: 15, name: 'ស្ករស 1kg',           category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.40, quantity: 30, active: true ,brand: 'Chefs', rating: 4, discountPercent: 5 },

  { id: 16, name: 'អំបិល 1kg',           category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 0.60, quantity: 30, active: true ,brand: 'Chefs', rating: 4, discountPercent: 0 },
  { id: 17, name: 'សាប៊ូបោកខោអាវ',      category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 4.50, quantity: 30, active: true ,brand: 'OMO', rating: 5, discountPercent: 20 },
  { id: 18, name: 'សាប៊ូលាងចាន',         category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 2.30, quantity: 30, active: true ,brand: 'Sunlight', rating: 4, discountPercent: 0 },
  { id: 19, name: 'ក្រដាសអនាម័យ',        category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.80, quantity: 30, active: true ,brand: 'Kleenex', rating: 4, discountPercent: 0 },
  { id: 20, name: 'ថង់សំរាម',            category: 'Home & Living / របស់ប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.20, quantity: 0, active: false ,brand: 'HomeWrap', rating: 3, discountPercent: 0 },

  { id: 21, name: 'សាប៊ូដុសខ្លួន',        category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.50, quantity: 30, active: true ,brand: 'Dove', rating: 5, discountPercent: 0 },
  { id: 22, name: 'សាប៊ូកក់សក់',         category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 3.50, quantity: 30, active: true ,brand: 'Sunsilk', rating: 4, discountPercent: 10 },
  { id: 23, name: 'ថ្នាំដុសធ្មេញ',        category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 2.20, quantity: 30, active: true ,brand: 'Colgate', rating: 5, discountPercent: 0 },
  { id: 24, name: 'ច្រាសដុសធ្មេញ',        category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.00, quantity: 30, active: true ,brand: 'Colgate', rating: 4, discountPercent: 0 },
  { id: 25, name: 'ឡេការពារកម្ដៅថ្ងៃ',    category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 5.50, quantity: 0, active: false ,brand: 'Nivea', rating: 3, discountPercent: 0 },
  { id: 26, name: 'ឡេលាបខ្លួន',          category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 4.80, quantity: 30, active: true ,brand: 'Nivea', rating: 4, discountPercent: 15 },
  { id: 27, name: 'កន្សែងសើម',           category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.70, quantity: 30, active: true ,brand: 'Wet Wipes', rating: 3, discountPercent: 0 },
  { id: 28, name: 'ទឹកអប់',              category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 8.50, quantity: 30, active: true ,brand: 'Dior', rating: 5, discountPercent: 25 },
  { id: 29, name: 'សាប៊ូលាងដៃ',          category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 2.10, quantity: 0, active: false ,brand: 'Dettol', rating: 4, discountPercent: 0 },
  { id: 30, name: 'ទឹកខ្ពុរមាត់',         category: 'Beauty / ផលិតផលថែទាំសម្រស់', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 3.20, quantity: 30, active: true ,brand: 'Listerine', rating: 4, discountPercent: 0 }
];

// ---------- Stock sync (shared with the Customer shop via localStorage) ----------
// key = admin product id, value = current quantity remaining.
// The Customer checkout deducts from this same key when an order is placed.
(function syncStockFromStorage(){
  let stock;
  try { stock = JSON.parse(localStorage.getItem(STOCK_KEY)); } catch(e) { stock = null; }
  if (!stock) {
    stock = {};
    products.forEach(p => { stock[p.id] = p.quantity; });
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
  } else {
    products.forEach(p => { if (stock[p.id] !== undefined) p.quantity = stock[p.id]; });
  }
})();

  let nextId = products.length + 1;

  const tbody = document.getElementById('productTableBody');
  const searchInput = document.getElementById('productSearch');
  const categorySelect = document.getElementById('productCategory');
  const supplierSelect = document.getElementById('productSupplier');
  const brandInput = document.getElementById('productBrand');
  const ratingSelect = document.getElementById('productRating');
  const discountInput = document.getElementById('productDiscount');
  const categoryList = document.getElementById('categoryList');
  const supplierList = document.getElementById('supplierList');

  function fillSelect(select, items){
    select.innerHTML = items.map(i => `<option value="${i}">${i}</option>`).join('');
  }

  function renderCategoryList(){
    categoryList.innerHTML = categories.map((c, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-center px-0">
        <span class="small">${c}</span>
        <button class="btn btn-sm btn-light border rounded-3 text-danger" data-remove-category="${i}"><i class="bi bi-trash"></i></button>
      </li>`).join('');
  }

  function renderSupplierList(){
    supplierList.innerHTML = suppliers.map((s, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-center px-0">
        <span class="small">${s}</span>
        <button class="btn btn-sm btn-light border rounded-3 text-danger" data-remove-supplier="${i}"><i class="bi bi-trash"></i></button>
      </li>`).join('');
  }

  function refreshLookups(){
    fillSelect(categorySelect, categories);
    fillSelect(supplierSelect, suppliers);
    renderCategoryList();
    renderSupplierList();
  }

  function renderKpis(){
    document.getElementById('kpiTotal').textContent = products.length;
    document.getElementById('kpiActive').textContent = products.filter(p => p.active).length;
    document.getElementById('kpiInactive').textContent = products.filter(p => !p.active).length;
    document.getElementById('kpiCategories').textContent = new Set(products.map(p => p.category)).size;
  }

  function renderTable(){
    const query = (searchInput.value || '').trim().toLowerCase();
    const rows = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.supplier.toLowerCase().includes(query) ||
      (p.brand || '').toLowerCase().includes(query)
    );

    tbody.innerHTML = '';
    if(rows.length === 0){
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-secondary py-4">No products found</td></tr>`;
      return;
    }

    rows.forEach(p => {
      const tr = document.createElement('tr');
      const stars = p.rating > 0 ? '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating) : '—';
      const priceHtml = p.discountPercent > 0
        ? `$${p.price.toFixed(2)} <span class="badge rounded-pill bg-danger-subtle text-danger">-${p.discountPercent}%</span>`
        : `$${p.price.toFixed(2)}`;
      tr.innerHTML = `
        <td class="fw-semibold small">${p.name}</td>
        <td><span class="badge rounded-pill bg-secondary-subtle text-secondary">${p.category}</span></td>
        <td class="small text-secondary">${p.brand || '—'}</td>
        <td class="small text-secondary">${p.supplier}</td>
        <td class="small">${priceHtml}</td>
        <td class="small">
          <span class="fw-semibold ${p.quantity === 0 ? 'text-danger' : (p.quantity <= 5 ? 'text-warning' : '')}">${p.quantity}</span>
          ${p.quantity === 0 ? '<span class="badge rounded-pill bg-danger-subtle text-danger ms-1">Out</span>' : (p.quantity <= 5 ? '<span class="badge rounded-pill bg-warning-subtle text-warning ms-1">Low</span>' : '')}
        </td>
        <td class="small text-warning">${stars}</td>
        <td>
          <span class="badge rounded-pill ${p.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
            ${p.active ? 'Selling' : 'Stopped'}
          </span>
        </td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-sm btn-light border rounded-3" data-action="edit" data-id="${p.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-light border rounded-3" data-action="toggle" data-id="${p.id}" title="${p.active ? 'Stop selling' : 'Resume selling'}">
              <i class="bi ${p.active ? 'bi-toggle-on text-success' : 'bi-toggle-off text-secondary'}"></i>
            </button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="delete" data-id="${p.id}" title="Delete"><i class="bi bi-trash-fill"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAll(){
    renderKpis();
    renderTable();
  }

  searchInput.addEventListener('input', renderTable);

  /* ---------------- Add / Edit product modal ---------------- */
  const productModalEl = document.getElementById('productModal');
  const productModal = new bootstrap.Modal(productModalEl);
  const productForm = document.getElementById('productForm');
  const productModalTitle = document.getElementById('productModalTitle');

  document.getElementById('addProductBtn').addEventListener('click', () => {
    productModalTitle.textContent = 'Add Product';
    productForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('productActive').checked = true;
    ratingSelect.value = '0';
    discountInput.value = '';
    refreshLookups();
  });

  document.getElementById('saveProductBtn').addEventListener('click', () => {
    if(!productForm.reportValidity()) return;

    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const category = categorySelect.value;
    const supplier = supplierSelect.value;
    const brand = brandInput.value.trim();
    const rating = parseInt(ratingSelect.value, 10) || 0;
    const discountPercent = parseInt(discountInput.value, 10) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const active = document.getElementById('productActive').checked;

    if(id){
      const p = products.find(x => x.id === Number(id));
      if(p){ Object.assign(p, { name, category, supplier, brand, rating, discountPercent, price, active }); }
      notify('Product updated');
    } else {
      products.push({ id: nextId++, name, category, supplier, brand, rating, discountPercent, price, active });
      notify('Product added');
    }

    productModal.hide();
    renderAll();
  });

  /* ---------------- Row actions ---------------- */
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    const p = products.find(x => x.id === id);
    if(!p) return;

    if(action === 'edit'){
      refreshLookups();
      productModalTitle.textContent = 'Edit Product';
      document.getElementById('productId').value = p.id;
      document.getElementById('productName').value = p.name;
      categorySelect.value = p.category;
      supplierSelect.value = p.supplier;
      brandInput.value = p.brand || '';
      ratingSelect.value = String(p.rating || 0);
      discountInput.value = p.discountPercent || '';
      document.getElementById('productPrice').value = p.price;
      document.getElementById('productActive').checked = p.active;
      productModal.show();

    } else if(action === 'toggle'){
      p.active = !p.active;
      notify(p.active ? `${p.name} is selling again` : `${p.name} stopped`);
      renderAll();

    } else if(action === 'delete'){
      if(confirm(`Delete ${p.name}? This cannot be undone.`)){
        products = products.filter(x => x.id !== id);
        notify(`${p.name} deleted`);
        renderAll();
      }
    }
  });

  /* ---------------- Categories ---------------- */
  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    const input = document.getElementById('newCategoryInput');
    const val = input.value.trim();
    if(!val) return;
    if(!categories.includes(val)) categories.push(val);
    input.value = '';
    refreshLookups();
    notify('Category added');
  });

  categoryList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-remove-category]');
    if(!btn) return;
    categories.splice(Number(btn.dataset.removeCategory), 1);
    refreshLookups();
    notify('Category removed');
  });

  /* ---------------- Suppliers ---------------- */
  document.getElementById('addSupplierBtn').addEventListener('click', () => {
    const input = document.getElementById('newSupplierInput');
    const val = input.value.trim();
    if(!val) return;
    if(!suppliers.includes(val)) suppliers.push(val);
    input.value = '';
    refreshLookups();
    notify('Supplier added');
  });

  supplierList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-remove-supplier]');
    if(!btn) return;
    suppliers.splice(Number(btn.dataset.removeSupplier), 1);
    refreshLookups();
    notify('Supplier removed');
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('You have 3 new notifications'));
  }

  refreshLookups();
  renderAll();

  window.addEventListener('storage', (e) => {
    if (e.key === STOCK_KEY) {
      let stock;
      try { stock = JSON.parse(localStorage.getItem(STOCK_KEY)); } catch(err) { stock = null; }
      if (stock) {
        products.forEach(p => { if (stock[p.id] !== undefined) p.quantity = stock[p.id]; });
        renderAll();
      }
    }
  });
});
