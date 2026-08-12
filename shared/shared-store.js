(function (global) {
  "use strict";

  const KEYS = {
    customers: "shared_customers",
    products: "shared_products",
    orders: "shared_orders",
    carts: "shared_carts",
    tickets: "shared_tickets",
    productsVersion: "shared_products_version",
  };

  // The product-catalog "version" is now computed automatically from the
  // contents of seedProducts() itself (see hashProducts below) — so editing,
  // adding, or deleting any product automatically invalidates old cached
  // data in every browser. No manual version bump needed anymore.

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
      
    }
  }
  function nextId(list) {
    return list.length ? Math.max(...list.map((x) => Number(x.id) || 0)) + 1 : 1;
  }
  // Simple deterministic string hash (djb2) used to detect when seedProducts()
  // has changed, so cached localStorage data auto-refreshes without needing
  // a manually-maintained version number.
  function hashProducts(list) {
    const str = JSON.stringify(list);
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
    }
    return String(hash);
  }
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
      { id: 1, name: "អង្គរ ៥គីឡូ", cat: "grocery", brand: "Local", price: 6.5, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "jasmine_rice", image: "asset/image/jasmine-rice.jpg", isNew: false, dealPct: null, stockLeft: 11 },
      { id: 1, name: "Moniter", cat: "electronics", brand: "Local", price: 30, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "computer", image: "asset/image/computer.png", isNew: false, dealPct: null, stockLeft: 30 },
      { id: 2, name: "ប្រេងសា ១លីត្រ", cat: "grocery", brand: "Local", price: 3.2, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "cooking_oil", image: "asset/image/cooking-oil.jpg", isNew: false, dealPct: null, stockLeft: 12 },
      { id: 3, name: "គ្រាកគូឡ្យា កំប៉ុង", cat: "beverages", brand: "Local", price: 0.75, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "coca_2", image: "asset/image/coca-2.jpg", isNew: false, dealPct: null, stockLeft: 55 },
      { id: 4, name: "សាប៊ូកក់សក់", cat: "beauty", brand: "Local", price: 1.0, old: null, rating: 4, reviews: 0, stock: "low", badge: null, img: "សាប៊ូកក់សក់", image: "asset/image/សាប៊ូកក់សក់.jpg", isNew: false, dealPct: null, stockLeft: 8 },
      { id: 5, name: "ទឹកសុទ្ធ ៦00ml", cat: "beverages", brand: "Local", price: 0.3, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "Water", image: "asset/image/Water.jpg", isNew: false, dealPct: null, stockLeft: 77 },
      { id: 6, name: "Coca-Cola", cat: "beverages", brand: "Coca-Cola", price: 2.5, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "coca_2", image: "asset/image/coca-2.jpg", isNew: false, dealPct: null, stockLeft: 49 },
      { id: 7, name: "Fanta", cat: "beverages", brand: "Fanta", price: 2.3, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "Fanta", image: "asset/image/Fanta.webp", isNew: false, dealPct: null, stockLeft: 48 },
      { id: 8, name: "កូកាកូឡា (Coca-Cola)", cat: "beverages", brand: "Coca-Cola", price: 0.6, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "coca_2", image: "asset/image/coca-2.jpg", isNew: false, dealPct: null, stockLeft: 120 },
      // { id: 9, name: "PION", cat: "beverages", brand: "PION", price: 0.7, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: null, image: null, isNew: false, dealPct: null, stockLeft: 85 },
      { id: 10, name: "កាហ្វេដប", cat: "beverages", brand: "Local", price: 1.2, old: null, rating: 4, reviews: 0, stock: "low", badge: null, img: "កាហ្វេដប", image: "asset/image/កាហ្វេដប.jpg", isNew: false, dealPct: null, stockLeft: 4 },
      { id: 11, name: "ទឹកក្រូចដប", cat: "beverages", brand: "Local", price: 2.5, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "iced_orange_juice", image: "asset/image/iced-orange-juice.webp", isNew: false, dealPct: null, stockLeft: 50 },
      { id: 12, name: "ទឹកស៊ីអ៊ីវ", cat: "grocery", brand: "Local", price: 1.5, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "soy_sauce", image: "asset/image/soy-sauce.jpg", isNew: false, dealPct: null, stockLeft: 100 },
      { id: 13, name: "តែបៃតង អូអ៊ិឈិ (Oishi)", cat: "beverages", brand: "Oishi", price: 0.75, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "តែបៃតង អូអ៊ិឈិ (Oishi)", image: "asset/image/តែបៃតង អូអ៊ិឈិ (Oishi).jpg", isNew: false, dealPct: null, stockLeft: 90 },
      { id: 14, name: "ពៅកម្លាំង វើក (WURKZ)", cat: "beverages", brand: "WURKZ", price: 0.65, old: null, rating: 4, reviews: 0, stock: "in", badge: "NEW", img: "wurkz_energy_drink", image: "asset/image/wurkz-energy-drink.jpg", isNew: false, dealPct: null, stockLeft: 150 },
      { id: 15, name: "ទឹកបរិសុទ្ធ វីតាល់ (Vital) ៥០០ml", cat: "beverages", brand: "Vital", price: 0.25, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "Water", image: "asset/image/Water.jpg", isNew: false, dealPct: null, stockLeft: 250 },
      { id: 16, name: "ការ៉ាបាវ (Carabao)", cat: "beverages", brand: "Carabao", price: 0.7, old: null, rating: 4, reviews: 0, stock: "low", badge: "NEW", img: "vikingz_energy_drink", image: "asset/image/vikingz-energy-drink.jpg", isNew: false, dealPct: null, stockLeft: 5 },
      { id: 17, name: "ស្តីងក្រហម (Sting)", cat: "beverages", brand: "Sting", price: 0.7, old: null, rating: 4, reviews: 0, stock: "in", badge: "NEW", img: "icy_cool_energy_drink", image: "asset/image/icy-cool-energy-drink.webp", isNew: false, dealPct: null, stockLeft: 110 },
      { id: 18, name: "ទឹកដោះគោជូរ ឌីឡាក់ (Delight)", cat: "beverages", brand: "Delight", price: 0.5, old: null, rating: 4, reviews: 0, stock: "in", badge: "NEW", img: "dahs_energy_drink", image: "asset/image/dahs-energy-drink.jpg", isNew: false, dealPct: null, stockLeft: 65 },
      { id: 19, name: "តែក្រូចឆ្មា ហ្វ្រូស (Iced Tea)", cat: "beverages", brand: "Fruso", price: 0.8, old: null, rating: 4, reviews: 0, stock: "low", badge: "NEW", img: "exprez_strawberry_drink", image: "asset/image/exprez-strawberry-drink.jpg", isNew: false, dealPct: null, stockLeft: 3 },
      { id: 20, name: "ទឹកផ្លែឈើ ជូស៊ី (Juice)", cat: "beverages", brand: "Juicy", price: 1.0, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "iced_orange_juice", image: "asset/image/iced-orange-juice.webp", isNew: false, dealPct: null, stockLeft: 45 },
      { id: 21, name: "ប៉ិបស៊ី (Pepsi)", cat: "beverages", brand: "Pepsi", price: 0.6, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ប៉ិបស៊ី (Pepsi)", image: "asset/image/ប៉ិបស៊ី (Pepsi).jpg", isNew: false, dealPct: null, stockLeft: 135 },
      { id: 22, name: "ទឹកដោះគោ កំប៉ុង BEAR BRAND", cat: "beverages", brand: "Bear Brand", price: 0.85, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ទឹកដោះគោ កំប៉ុង BEAR BRAND", image: "asset/image/ទឹកដោះគោ កំប៉ុង BEAR BRAND.jpeg", isNew: false, dealPct: null, stockLeft: 70 },
      // { id: 23, name: "ទឹកស៊ីអ៊ីវ ម៉ាកស៊ុបភើគីតឆេន", cat: "grocery", brand: "Local", price: 1.5, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "soy_sauce", image: "asset/image/soy-sauce.jpg", isNew: false, dealPct: null, stockLeft: 100 },
      { id: 24, name: "អំបិលអុីយ៉ូដ ១កញ្ចប់", cat: "grocery", brand: "Local", price: 0.25, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "iodized_salt", image: "asset/image/iodized-salt.jpg", isNew: false, dealPct: null, stockLeft: 300 },
      { id: 25, name: "ទឹកត្រី ផ្ការំដួល", cat: "grocery", brand: "Local", price: 1.8, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "canned_fish", image: "asset/image/canned-fish.jpg", isNew: false, dealPct: null, stockLeft: 80 },
      { id: 26, name: "ប៊ីចេង រូបភ្នំ (500g)", cat: "grocery", brand: "Local", price: 1.25, old: null, rating: 4, reviews: 0, stock: "low", badge: null, img: "ប៊ីចេង រូបភ្នំ (500g)", image: "asset/image/ប៊ីចេង រូបភ្នំ.jpg", isNew: false, dealPct: null, stockLeft: 6 },
      { id: 27, name: "ស្ករសធម្មជាតិ (១គីឡូ)", cat: "grocery", brand: "Local", price: 1.1, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "white_sugar", image: "asset/image/white-sugar.jpg", isNew: false, dealPct: null, stockLeft: 95 },
      { id: 28, name: "ម្សៅស៊ុបខ្នរ (Knorr) ប្រអប់ធំ", cat: "grocery", brand: "Knorr", price: 2.3, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ម្សៅស៊ុបខ្នរ (Knorr) ប្រអប់ធំ", image: "asset/image/ម្សៅស៊ុបខ្នរ (Knorr) ប្រអប់ធំ.jpg", isNew: false, dealPct: null, stockLeft: 40 },
      { id: 29, name: "ប្រេងខ្យង ម៉ាកក្បាលតោ", cat: "grocery", brand: "Local", price: 2.1, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ប្រេងខ្យង ម៉ាកក្បាលតោ", image: "asset/image/ប្រេងខ្យង ម៉ាកក្បាលតោ.jpg", isNew: false, dealPct: null, stockLeft: 75 },
      { id: 30, name: "ម្រេចកំពតម៉ត់ (កំប៉ុងតូច)", cat: "grocery", brand: "Local", price: 3.5, old: null, rating: 4, reviews: 0, stock: "low", badge: null, img: "ម្រេចកំពតម៉ត់ (កំប៉ុងតូច)", image: "asset/image/ម្រេចកំពតម៉ត់ (កំប៉ុងតូច).jpg", isNew: false, dealPct: null, stockLeft: 2 },
      { id: 31, name: "ទឹកប៉េងប៉ោះ ម៉ាករ៉ូសា (Roza)", cat: "grocery", brand: "Roza", price: 1.4, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ទឹកប៉េងប៉ោះ ម៉ាករ៉ូសា (Roza)", image: "asset/image/ទឹកប៉េងប៉ោះ ម៉ាករ៉ូសា (Roza).jpg", isNew: false, dealPct: null, stockLeft: 55 },
      { id: 32, name: "ទឹកម្ទេសហិរ ម៉ាកឆេហ្វ (Chef)", cat: "grocery", brand: "Chef's", price: 1.35, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ទឹកម្ទេសហិរ ម៉ាកឆេហ្វ (Chef)", image: "asset/image/ទឹកម្ទេសហិរ ម៉ាកឆេហ្វ (Chef).jpg", isNew: false, dealPct: null, stockLeft: 60 },
      { id: 33, name: "ម្សៅការី (កញ្ចប់តូច)", cat: "grocery", brand: "Local", price: 0.4, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ម្សៅការី (កញ្ចប់តូច)", image: "asset/image/ម្សៅការី (កញ្ចប់តូច).jpg", isNew: false, dealPct: null, stockLeft: 120 },
      { id: 34, name: "សាប៊ូដុសខ្លួន Lux (ដុំ)", cat: "beauty", brand: "Lux", price: 0.85, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "សាប៊ូដុសខ្លួន Lux (ដុំ)", image: "asset/image/សាប៊ូដុសខ្លួន Lux (ដុំ).jpg", isNew: false, dealPct: null, stockLeft: 90 },
      { id: 35, name: "សាប៊ូកក់សក់ Sunsilk (ដបមធ្យម)", cat: "beauty", brand: "Sunsilk", price: 2.75, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "សាប៊ូកក់សក់ Sunsilk (ដបមធ្យម)", image: "asset/image/សាប៊ូកក់សក់ Sunsilk (ដបមធ្យម).jpg", isNew: false, dealPct: null, stockLeft: 45 },
      { id: 36, name: "ថ្នាំដុសធ្មេញ Colgate ប្រអប់ធំ", cat: "beauty", brand: "Colgate", price: 1.9, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ថ្នាំដុសធ្មេញ Colgate ប្រអប់ធំ", image: "asset/image/ថ្នាំដុសធ្មេញ Colgate ប្រអប់ធំ.webp", isNew: false, dealPct: null, stockLeft: 60 },
      { id: 37, name: "ច្រាសដុសធ្មេញ (កញ្ចប់ ១ថែម១)", cat: "beauty", brand: "Local", price: 1.2, old: null, rating: 4, reviews: 0, stock: "low", badge: null, img: "ច្រាសដុសធ្មេញ (កញ្ចប់ ១ថែម១)", image: "asset/image/ច្រាសដុសធ្មេញ (កញ្ចប់ ១ថែម១).jpg", isNew: false, dealPct: null, stockLeft: 8 },
      { id: 38, name: "សាប៊ូលាងចាន សាន់ឡាយ (Sunlight)", cat: "home", brand: "Sunlight", price: 1.1, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "សាប៊ូលាងចាន សាន់ឡាយ (Sunlight)", image: "asset/image/សាប៊ូលាងចាន សាន់ឡាយ (Sunlight).jpg", isNew: false, dealPct: null, stockLeft: 110 },
      { id: 39, name: "ម្សៅសាប៊ូបោកខោអាវ វីហ្សូ (Viso) ៥០០ក្រាម", cat: "home", brand: "Viso", price: 1.4, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ម្សៅសាប៊ូបោកខោអាវ វីហ្សូ (Viso) ៥០០ក្រាម", image: "asset/image/ម្សៅសាប៊ូបោកខោអាវ វីហ្សូ (Viso) ៥០០ក្រាម.jpg", isNew: false, dealPct: null, stockLeft: 75 },
      { id: 40, name: "ក្រដាសអនាម័យ (ប៉េក ១០ដុំ)", cat: "home", brand: "Local", price: 2.2, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ក្រដាសអនាម័យ (ប៉េក ១០ដុំ)", image: "asset/image/ក្រដាសអនាម័យ (ប៉េក ១០ដុំ).jpg", isNew: false, dealPct: null, stockLeft: 35 },
      { id: 41, name: "ថង់យួរផ្លាស្ទិក (១គីឡូ)", cat: "home", brand: "Local", price: 1.5, old: null, rating: 4, reviews: 0, stock: "low", badge: null, img: "ថង់យួរផ្លាស្ទិក (១គីឡូ)", image: "asset/image/ថង់យួរផ្លាស្ទិក (១គីឡូ).jpg", isNew: false, dealPct: null, stockLeft: 4 },
      { id: 42, name: "ទឹកជូតការ៉ូ ម៉ាកក្លីន (Clean)", cat: "home", brand: "Clean", price: 2.6, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "ទឹកជូតការ៉ូ ម៉ាកក្លីន (Clean)", image: "asset/image/ទឹកជូតការ៉ូ ម៉ាកក្លីន (Clean).jpg", isNew: false, dealPct: null, stockLeft: 50 },
      { id: 43, name: "អេប៉ុងលាងចាន (កញ្ចប់ ៥បន្ទះ)", cat: "home", brand: "Local", price: 0.6, old: null, rating: 4, reviews: 0, stock: "in", badge: null, img: "អេប៉ុងលាងចាន (កញ្ចប់ ៥បន្ទះ)", image: "asset/image/អេប៉ុងលាងចាន (កញ្ចប់ ៥បន្ទះ).jpg", isNew: false, dealPct: null, stockLeft: 140 }
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
    const currentVersion = hashProducts(seedProducts());
    const savedVersion = read(KEYS.productsVersion, null);
    let list = read(KEYS.products, null);
    if (!list || savedVersion !== currentVersion) {
      list = seedProducts();
      write(KEYS.products, list);
      write(KEYS.productsVersion, currentVersion);
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
