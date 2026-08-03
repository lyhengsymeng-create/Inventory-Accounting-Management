(function (global) {

  const KEYS = {
    purchaseOrders:   'iam_purchaseOrders',
    purchaseRequests: 'iam_purchaseRequests',
    purchaseReturns:  'iam_purchaseReturns'
  };

  /* ---------------- Default demo data (first run only) ---------------- */
  const DEFAULTS = {
    purchaseOrders: [
      { id: 1, supplier: 'ក្រុមហ៊ុនចែកចាយ ABC',        date: '2026-07-03', expected: '2026-07-10', total: 640.00, status: 'បានទទួល',
        items: [ { name: 'ថង់វេចខ្ចប់ប្លាស្ទិក', qty: 8000, price: 0.08 } ] },
      { id: 2, supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', date: '2026-07-12', expected: '2026-07-18', total: 320.50, status: 'បានអនុម័ត',
        items: [ { name: 'ថង់ក្រដាស', qty: 500, price: 0.35 }, { name: 'ខ្សែកាវបិទ', qty: 300, price: 0.45 } ] },
      { id: 3, supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ',    date: '2026-07-20', expected: '2026-07-27', total: 890.00, status: 'រង់ចាំការអនុម័ត',
        items: [ { name: 'ប្រអប់វេចខ្ចប់', qty: 400, price: 1.50 }, { name: 'ស្លាកបិទផលិតផល', qty: 1000, price: 0.29 } ] },
      { id: 4, supplier: 'ក្រុមហ៊ុនចែកចាយ ABC',        date: '2026-07-24', expected: '2026-07-30', total: 210.75, status: 'រង់ចាំការអនុម័ត',
        items: [ { name: 'ម៉ាស៊ីនបោះពុម្ពបង្កាន់ដៃ', qty: 3, price: 45.25 }, { name: 'ក្រដាសបង្កាន់ដៃ', qty: 15, price: 5.00 } ] }
    ],
    purchaseRequests: [
      { id: 1, item: 'ថង់វេចខ្ចប់ប្លាស្ទិក', qty: 500, requester: 'សុគន្ធ', urgency: 'Normal', status: 'កំពុងបើក' },
      { id: 2, item: 'ម៉ាស៊ីនបោះពុម្ពបង្កាន់ដៃ', qty: 2,  requester: 'ដារ៉ា',   urgency: 'Urgent', status: 'កំពុងបើក' }
    ],
    purchaseReturns: [
      { id: 1, poId: 1, item: 'ថង់វេចខ្ចប់ប្លាស្ទិក', qty: 200, price: 0.08, reason: 'ខូចខាតកំឡុងពេលដឹកជញ្ជូន', status: 'រង់ចាំ' }
    ]
  };

  function load(name) {
    const raw = localStorage.getItem(KEYS[name]);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* corrupt data, fall through to reseed */ }
    }
    const seeded = JSON.parse(JSON.stringify(DEFAULTS[name]));
    localStorage.setItem(KEYS[name], JSON.stringify(seeded));
    return seeded;
  }

  function save(name, data) {
    localStorage.setItem(KEYS[name], JSON.stringify(data));
  }

  function nextId(records) {
    return records.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
  }

  global.PurchaseStore = {
    getPurchaseOrders:   () => load('purchaseOrders'),
    savePurchaseOrders:  (data) => save('purchaseOrders', data),

    getPurchaseRequests:  () => load('purchaseRequests'),
    savePurchaseRequests: (data) => save('purchaseRequests', data),

    getPurchaseReturns:  () => load('purchaseReturns'),
    savePurchaseReturns: (data) => save('purchaseReturns', data),

    nextId
  };

})(window);
