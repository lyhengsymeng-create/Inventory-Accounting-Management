/* ============================================================
   SharedStore — localStorage-based shared "database"
   Connects the Staff/Admin app (Inventory-Accounting-Manage)
   with the Customer storefront (/customer).

   Load this file BEFORE any page-specific script (script.js,
   customerManagement.js, phearoun.js, etc). It must be served
   from a local web server with the project root as document
   root so the absolute path /shared/shared-store.js resolves
   the same way from both the root app and /customer pages.
   ============================================================ */
(function (global) {
  "use strict";

  const KEYS = {
    customers: "shared_customers",
    products: "shared_products",
    orders: "shared_orders",
    carts: "shared_carts",
    tickets: "shared_tickets",
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage full / unavailable — fail silently */
    }
  }
  function nextId(list) {
    return list.length ? Math.max(...list.map((x) => Number(x.id) || 0)) + 1 : 1;
  }

  /* ---------------- seed data ---------------- */

  function seedCustomers() {
    return [
      { id: 1, name: "សុខា", phone: "012 345 678", email: "sokha@gmail.com", address: "Phnom Penh", orders: 3, spent: 86.0, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 2, name: "ដារា", phone: "098 765 432", email: "dara@gmail.com", address: "Siem Reap", orders: 2, spent: 100.0, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 3, name: "ស្រីនាង", phone: "070 123 456", email: "sreyneang@gmail.com", address: "Battambang", orders: 4, spent: 143.5, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 4, name: "វិសាល", phone: "011 222 333", email: "visal@gmail.com", address: "Phnom Penh", orders: 2, spent: 50.5, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 5, name: "ចាន់ថា", phone: "086 555 999", email: "chantha@gmail.com", address: "Kandal", orders: 1, spent: 32.0, active: false, hasDebt: false, points: 0, source: "staff" },
      { id: 6, name: "មាលី", phone: "077 888 111", email: "malis@gmail.com", address: "Phnom Penh", orders: 5, spent: 210.0, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 7, name: "ពិសិដ្ឋ", phone: "093 444 222", email: "piseth@gmail.com", address: "Kampong Cham", orders: 3, spent: 75.5, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 8, name: "រតនា", phone: "015 666 777", email: "reatana@gmail.com", address: "Phnom Penh", orders: 6, spent: 320.0, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 9, name: "សុភា", phone: "096 333 555", email: "sophea@gmail.com", address: "Siem Reap", orders: 2, spent: 95.0, active: false, hasDebt: false, points: 0, source: "staff" },
      { id: 10, name: "វណ្ណា", phone: "069 111 999", email: "vanna@gmail.com", address: "Phnom Penh", orders: 4, spent: 180.5, active: true, hasDebt: false, points: 0, source: "staff" },
      { id: 11, name: "Walk-in", phone: "-", email: "", address: "", orders: 12, spent: 480.5, active: true, hasDebt: false, points: 0, source: "staff" },
      /* storefront account — links to customer2 login (LyHeng Symeng) */
      { id: 100, name: "LyHeng Symeng", phone: "+855 71 25 83 802", email: "lyheng.symeng@email.com", address: "ភ្នំពេញ កម្ពុជា", orders: 0, spent: 0, active: true, hasDebt: false, points: 0, source: "online" },
    ];
  }

  function seedProducts() {
    return [
      { id: 1, name: "Wireless Headphones", cat: "electronics", brand: "Sony", price: 59.99, old: 79.99, rating: 5, reviews: 128, stock: "in", badge: "SALE", img: "headphones", image: "https://kfourgroup.com.kh/wp-content/uploads/2024/01/JBLT770NC-BLK.webp", isNew: false, dealPct: 25, stockLeft: 62 },
      { id: 2, name: "Smart Watch Series 5", cat: "electronics", brand: "Apple", price: 129.99, old: null, rating: 4, reviews: 89, stock: "in", badge: "NEW", img: "smartwatch", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3BqE121r3vujeCt-B6E11Pac8Ily1CfFUmqqCCoPx_w&s=10", isNew: true, dealPct: null, stockLeft: 40 },
      { id: 3, name: "Travel Backpack", cat: "fashion", brand: "Nike", price: 39.99, old: 49.99, rating: 4, reviews: 56, stock: "low", badge: "SALE", img: "backpack", image: "https://nakie.co/cdn/shop/files/MBA_-_BACKPACK_TRAVEL_-_River_Blue.png?v=1783678535&width=1150", isNew: false, dealPct: 20, stockLeft: 8 },
      { id: 4, name: "Digital Camera", cat: "electronics", brand: "Canon", price: 499.99, old: 599.99, rating: 5, reviews: 35, stock: "in", badge: "SALE", img: "camera", image: "https://pyxis.nymag.com/v1/imgs/dfb/03c/bbf932df3accf8c09ebbbae70a438f45d4-2----.2x.h473.w710.jpg", isNew: false, dealPct: 17, stockLeft: 40 },
      { id: 5, name: "Classic Sunglasses", cat: "fashion", brand: "Adidas", price: 19.99, old: 29.99, rating: 4, reviews: 64, stock: "in", badge: "SALE", img: "sunglasses", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtQCutaCHhDrcIZoae7OAlN-a6WBkuSkKb4_QqF2WXbHbPXhe2_kIwFQE&s=10", isNew: false, dealPct: 33, stockLeft: 70 },
      { id: 6, name: "Blender Machine", cat: "home", brand: "Philips", price: 29.99, old: null, rating: 4, reviews: 41, stock: "in", badge: null, img: "blender", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGN0gWnYprgq29FIKd7wvsxJo8MWsB0OutqphxCrez5OihrScLL4BkGl8&s=10", isNew: false, dealPct: null, stockLeft: 20 },
      { id: 7, name: "Men's Cotton T-Shirt", cat: "fashion", brand: "Puma", price: 15.99, old: null, rating: 4, reviews: 88, stock: "in", badge: "NEW", img: "tshirt", image: null, isNew: true, dealPct: null, stockLeft: 25 },
      { id: 8, name: "Casual Sneakers", cat: "sports", brand: "Nike", price: 49.99, old: 64.99, rating: 5, reviews: 72, stock: "in", badge: "SALE", img: "sneakers", image: null, isNew: false, dealPct: 23, stockLeft: 55 },
      { id: 9, name: "Perfume Bottle", cat: "beauty", brand: "Dior", price: 34.99, old: null, rating: 5, reviews: 72, stock: "low", badge: null, img: "perfume", image: null, isNew: false, dealPct: null, stockLeft: 5 },
      { id: 10, name: "LED Desk Lamp", cat: "home", brand: "Philips", price: 25.99, old: null, rating: 4, reviews: 30, stock: "in", badge: "NEW", img: "desklamp", image: null, isNew: true, dealPct: null, stockLeft: 18 },
      { id: 11, name: "Yoga Mat Pro", cat: "sports", brand: "Adidas", price: 22.99, old: 27.99, rating: 4, reviews: 45, stock: "in", badge: "SALE", img: "yogamat", image: null, isNew: false, dealPct: 18, stockLeft: 33 },
      { id: 12, name: "Facial Skincare Set", cat: "beauty", brand: "LG", price: 44.99, old: null, rating: 5, reviews: 97, stock: "in", badge: "NEW", img: "skincare", image: null, isNew: true, dealPct: null, stockLeft: 21 },
      { id: 13, name: "Bluetooth Speaker", cat: "electronics", brand: "Sony", price: 49.99, old: 69.99, rating: 4, reviews: 61, stock: "in", badge: "SALE", img: "speaker", image: null, isNew: false, dealPct: 29, stockLeft: 47 },
      { id: 14, name: "Running Shoes", cat: "sports", brand: "Puma", price: 39.99, old: 54.99, rating: 5, reviews: 110, stock: "in", badge: "SALE", img: "runningshoes", image: null, isNew: false, dealPct: 27, stockLeft: 19 },
      { id: 15, name: "Leather Handbag", cat: "fashion", brand: "Dior", price: 79.99, old: null, rating: 4, reviews: 24, stock: "in", badge: "NEW", img: "handbag", image: "https://static.zara.net/assets/public/9af0/16c4/dded4fe39b29/7f3be61d451c/13328720700-a1/13328720700-a1.jpg?ts=1775050184369&w=792&f=auto", isNew: true, dealPct: null, stockLeft: 30 },
      { id: 16, name: "Smart Blender Pro", cat: "home", brand: "Philips", price: 59.99, old: 74.99, rating: 4, reviews: 18, stock: "low", badge: "SALE", img: "blender", image: null, isNew: false, dealPct: 20, stockLeft: 6 },
      { id: 17, name: "Exprez Strawberry Energy Drink", cat: "beverages", brand: "Exprez", price: 1.25, old: null, rating: 5, reviews: 14, stock: "in", badge: "NEW", img: "energy-drink", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqexWiw89QYk9VDbCFbe68FTOoM958AUSglPu7W51udgI-_25PtEsj2wU&s=10", isNew: true, dealPct: null, stockLeft: 120 },
      { id: 18, name: "Mineral Water Bottle 500ml", cat: "beverages", brand: "PureSpring", price: 0.75, old: null, rating: 4, reviews: 32, stock: "in", badge: null, img: "water-bottle", image: "https://d3nhsn9xe1wma5.cloudfront.net/product/1669601348028", isNew: false, dealPct: null, stockLeft: 200 },
      { id: 19, name: "Aluminum Foil Roll", cat: "home", brand: "HomeWrap", price: 3.49, old: 4.29, rating: 4, reviews: 21, stock: "in", badge: "SALE", img: "aluminum-foil", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp-BdCjkhRWOIvmTEAlY1u4Aa_dSK5ZGAA1e7AKtliCA2NqTuu_8LjdsT5&s=10", isNew: false, dealPct: 19, stockLeft: 44 },
      { id: 20, name: "Canned Fish in Tomato Sauce", cat: "grocery", brand: "Khmer", price: 1.99, old: null, rating: 5, reviews: 9, stock: "in", badge: "NEW", img: "canned-fish", image: "assets/products/canned-fish.png", isNew: true, dealPct: null, stockLeft: 60 },
      { id: 21, name: "Rice Bran Cooking Oil 1L", cat: "grocery", brand: "Chef's", price: 4.5, old: 5.25, rating: 5, reviews: 27, stock: "in", badge: "SALE", img: "cooking-oil", image: "assets/products/cooking-oil.png", isNew: false, dealPct: 14, stockLeft: 38 },
      { id: 22, name: "Roasted Peanuts (500g)", cat: "grocery", brand: "FarmFresh", price: 2.25, old: null, rating: 4, reviews: 16, stock: "in", badge: null, img: "peanuts", image: "assets/products/peanuts.png", isNew: false, dealPct: null, stockLeft: 50 },
      { id: 23, name: "Digital Air Fryer 6.5L", cat: "home", brand: "Lecko", price: 69.99, old: 89.99, rating: 5, reviews: 53, stock: "in", badge: "SALE", img: "air-fryer", image: "assets/products/air-fryer.png", isNew: false, dealPct: 22, stockLeft: 17 },
      { id: 24, name: "Cream Crewneck Sweatshirt", cat: "fashion", brand: "Puma", price: 28.99, old: null, rating: 4, reviews: 11, stock: "in", badge: "NEW", img: "sweatshirt", image: "assets/products/sweatshirt.png", isNew: true, dealPct: null, stockLeft: 26 },
      { id: 25, name: "Men's Denim Jacket", cat: "fashion", brand: "Nike", price: 54.99, old: 69.99, rating: 5, reviews: 38, stock: "in", badge: "SALE", img: "denim-jacket", image: "assets/products/denim-jacket.png", isNew: false, dealPct: 21, stockLeft: 25 },
      { id: 26, name: "Stand Mixer", cat: "home", brand: "Philips", price: 149.99, old: 179.99, rating: 5, reviews: 44, stock: "in", badge: "SALE", img: "stand-mixer", image: "assets/products/stand-mixer.png", isNew: false, dealPct: 17, stockLeft: 12 },
    ];
  }

  function seedOrders() {
    return [];
  }

  /* ---------------- internal getters (lazy-seed on first read) ---------------- */

  function _customers() {
    let list = read(KEYS.customers, null);
    if (!list) {
      list = seedCustomers();
      write(KEYS.customers, list);
    }
    return list;
  }
  function _products() {
    let list = read(KEYS.products, null);
    if (!list) {
      list = seedProducts();
      write(KEYS.products, list);
    }
    return list;
  }
  function _orders() {
    return read(KEYS.orders, seedOrders());
  }
  /* carts are stored as { [customerId]: [{ id, qty }] } */
  function _carts() {
    return read(KEYS.carts, {});
  }
  function _tickets() {
    return read(KEYS.tickets, []);
  }

  /* ---------------- public API ---------------- */

  const SharedStore = {
    /* ---- Customers ---- */
    getCustomers() {
      return _customers();
    },
    getCustomer(id) {
      return _customers().find((c) => Number(c.id) === Number(id)) || null;
    },
    upsertCustomer(customer) {
      const list = _customers();
      const idx = list.findIndex((c) => Number(c.id) === Number(customer.id));
      if (idx >= 0) {
        list[idx] = Object.assign({}, list[idx], customer);
      } else {
        customer.id = customer.id != null ? customer.id : nextId(list);
        list.push(customer);
      }
      write(KEYS.customers, list);
      return customer;
    },
    deleteCustomer(id) {
      const list = _customers().filter((c) => Number(c.id) !== Number(id));
      write(KEYS.customers, list);
    },

    /* ---- Products ---- */
    getProducts() {
      return _products();
    },
    getProduct(id) {
      return _products().find((p) => Number(p.id) === Number(id)) || null;
    },
    saveProducts(list) {
      write(KEYS.products, list);
    },
    decrementStock(id, qty) {
      const list = _products();
      const p = list.find((x) => Number(x.id) === Number(id));
      if (p && typeof p.stockLeft === "number") {
        p.stockLeft = Math.max(0, p.stockLeft - qty);
        p.stock = p.stockLeft === 0 ? "out" : p.stockLeft <= 10 ? "low" : "in";
        write(KEYS.products, list);
      }
      return p;
    },

    /* ---- Orders ---- */
    getOrders() {
      return _orders();
    },
    getOrder(id) {
      return _orders().find((o) => String(o.id) === String(id)) || null;
    },
    getOrdersByCustomer(customerId) {
      return _orders()
        .filter((o) => Number(o.customerId) === Number(customerId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    /**
     * order = { customerId, customerName, items: [{id,name,price,qty}], total, source: 'online'|'pos', paymentMethod, address }
     */
    addOrder(order) {
      const list = _orders();
      const id = order.id || "ORD-" + Date.now();
      const now = new Date();
      const record = Object.assign(
        {
          id,
          status: "pending",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        order
      );
      list.unshift(record);
      write(KEYS.orders, list);

      // decrement stock for every item in the order
      (record.items || []).forEach((it) => {
        SharedStore.decrementStock(it.id, it.qty || 1);
      });

      // keep the customer's order count / spend in sync
      if (record.customerId != null) {
        const cust = SharedStore.getCustomer(record.customerId);
        if (cust) {
          cust.orders = (cust.orders || 0) + 1;
          cust.spent = (cust.spent || 0) + (Number(record.total) || 0);
          SharedStore.upsertCustomer(cust);
        }
      }
      return record;
    },
    updateOrderStatus(id, status) {
      const list = _orders();
      const o = list.find((x) => String(x.id) === String(id));
      if (o) {
        o.status = status;
        o.updatedAt = new Date().toISOString();
        write(KEYS.orders, list);
      }
      return o;
    },

    /* ---- cross-tab sync ---- */
    onChange(callback) {
      window.addEventListener("storage", (e) => {
        if (Object.values(KEYS).includes(e.key)) callback(e);
      });
    },

    /* ---- Cart (per customer) ----
       Real, persisted cart used by cart.html + "Add to Cart" buttons across
       the storefront — replaces the old badge-only counter so items survive
       navigation/reload and only clear on a real checkout. */
    getCart(customerId) {
      const carts = _carts();
      const lines = carts[customerId] || [];
      // hydrate each line with live product data (price/name/stock may have changed)
      return lines
        .map((line) => {
          const product = SharedStore.getProduct(line.id);
          if (!product) return null;
          return { id: product.id, name: product.name, price: product.price, image: product.image, img: product.img, qty: line.qty };
        })
        .filter(Boolean);
    },
    getCartCount(customerId) {
      const carts = _carts();
      return (carts[customerId] || []).reduce((sum, l) => sum + (l.qty || 0), 0);
    },
    addToCart(customerId, productId, qty) {
      qty = qty || 1;
      const carts = _carts();
      const lines = carts[customerId] || [];
      const existing = lines.find((l) => Number(l.id) === Number(productId));
      if (existing) {
        existing.qty += qty;
      } else {
        lines.push({ id: Number(productId), qty });
      }
      carts[customerId] = lines;
      write(KEYS.carts, carts);
      return SharedStore.getCart(customerId);
    },
    updateCartQty(customerId, productId, qty) {
      const carts = _carts();
      const lines = carts[customerId] || [];
      const line = lines.find((l) => Number(l.id) === Number(productId));
      if (line) {
        line.qty = Math.max(1, qty);
        carts[customerId] = lines;
        write(KEYS.carts, carts);
      }
      return SharedStore.getCart(customerId);
    },
    removeFromCart(customerId, productId) {
      const carts = _carts();
      carts[customerId] = (carts[customerId] || []).filter((l) => Number(l.id) !== Number(productId));
      write(KEYS.carts, carts);
      return SharedStore.getCart(customerId);
    },
    clearCart(customerId) {
      const carts = _carts();
      carts[customerId] = [];
      write(KEYS.carts, carts);
    },

    /* ---- Support Tickets (Customer <-> Staff communication) ---- */
    getTickets() {
      return _tickets().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    getTicket(id) {
      return _tickets().find((t) => String(t.id) === String(id)) || null;
    },
    getTicketsByCustomer(customerId) {
      return SharedStore.getTickets().filter((t) => Number(t.customerId) === Number(customerId));
    },
    /**
     * ticket = { customerId, customerName, subject, category, message }
     */
    addTicket(ticket) {
      const list = _tickets();
      const now = new Date().toISOString();
      const record = Object.assign(
        {
          id: "TCK-" + Date.now(),
          status: "open", // open -> resolved
          createdAt: now,
          updatedAt: now,
          reply: null,
        },
        ticket
      );
      list.unshift(record);
      write(KEYS.tickets, list);
      return record;
    },
    replyTicket(id, replyMessage) {
      const list = _tickets();
      const t = list.find((x) => String(x.id) === String(id));
      if (t) {
        t.reply = replyMessage;
        t.status = "resolved";
        t.updatedAt = new Date().toISOString();
        write(KEYS.tickets, list);
      }
      return t;
    },
    updateTicketStatus(id, status) {
      const list = _tickets();
      const t = list.find((x) => String(x.id) === String(id));
      if (t) {
        t.status = status;
        t.updatedAt = new Date().toISOString();
        write(KEYS.tickets, list);
      }
      return t;
    },
  };

  global.SharedStore = SharedStore;
})(window);
