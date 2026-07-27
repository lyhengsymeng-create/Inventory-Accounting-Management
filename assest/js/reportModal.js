(function () {
  const LOW_STOCK_THRESHOLD = 5;

  const stockData = [
    { name: "អង្គរ ៥គីឡូ", category: "គ្រឿងទេស", stock: 11 },
    { name: "ប្រេងសា ១លីត្រ", category: "គ្រឿងទេស", stock: 12 },
    { name: "គ្រាកគូឡ្យា កំប៉ុង", category: "ភេសជ្ជៈ", stock: 55 },
    { name: "សាប៊ូកក់សក់", category: "សម្ភារៈ", stock: 8 },
    { name: "ទឹកសុទ្ធ ៦00ml", category: "ភេសជ្ជៈ", stock: 77 },
    { name: "Coca-cola", category: "ភេសជ្ជៈ", stock: 49 },
    { name: "fanta", category: "ភេសជ្ជៈ", stock: 48 },
    { name: "កាហ្វេដប", category: "ភេសជ្ជៈ", stock: 4 },
    { name: "ទឹកក្រូចដប", category: "ភេសជ្ជៈ", stock: 50 },
    { name: "ថង់យួរផ្លាស្ទិក (១គីឡូ)", category: "សម្ភារៈ", stock: 0 },
    { name: "ច្រាសដុសធ្មេញ (កញ្ចប់ ១ថែម១)", category: "សម្ភារៈ", stock: 8 },
    { name: "ម្រេចកំពតម៉ត់ (កំប៉ុងតូច)", category: "គ្រឿងទេស", stock: 2 },
  ];

  function statusFor(stock) {
    if (stock <= 0) return { label: "អស់ស្តុក", css: "format-badge", style: "background:#f8d7da;color:#842029;" };
    if (stock <= LOW_STOCK_THRESHOLD) return { label: "ជិតអស់ស្តុក", css: "format-badge", style: "background:#fff3cd;color:#664d03;" };
    return { label: "មានស្តុក", css: "format-badge", style: "background:#d1e7dd;color:#0f5132;" };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderStockTable(detailHeadEl, detailBodyEl) {
    if (!detailHeadEl || !detailBodyEl) return;
    detailHeadEl.innerHTML = `
      <th>ឈ្មោះទំនិញ</th>
      <th>ប្រភេទ</th>
      <th class="text-end">ស្តុក</th>
      <th>ស្ថានភាព</th>
    `;
    detailBodyEl.innerHTML = stockData
      .map((p) => {
        const s = statusFor(p.stock);
        return `
          <tr>
            <td>${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.category)}</td>
            <td class="text-end">${p.stock}</td>
            <td><span class="${s.css}" style="${s.style}">${s.label}</span></td>
          </tr>`;
      })
      .join("");
  }

  function getLocalizedTitle(key) {
    const map = {
      bestSelling: 'ផលិតផលលក់ដាច់ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(BEST SELLING PRODUCTS)</span>',
      slowMoving: 'ផលិតផលលក់យឺត <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(SLOW MOVING)</span>',
      customer: 'របាយការណ៍អតិថិជន <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(CUSTOMER)</span>',
      supplier: 'របាយការណ៍អ្នកផ្គត់ផ្គង់ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(SUPPLIER)</span>',
      employee: 'របាយការណ៍បុគ្គលិក <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(EMPLOYEE)</span>',
      profit: 'ការវិភាគប្រាក់ចំណេញ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(PROFIT)</span>',
      tax: 'របាយការណ៍ពន្ធ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(TAX)</span>',
      financial: 'របាយការណ៍ហិរញ្ញវត្ថុ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(FINANCIAL)</span>',
      stockValuation: 'តម្លៃស្តុក <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(STOCK VALUATION)</span>',
      daily: 'របាយការណ៍ប្រចាំថ្ងៃ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(DAILY)</span>',
      weekly: 'របាយការណ៍ប្រចាំសប្តាហ៍ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(WEEKLY)</span>',
      monthly: 'របាយការណ៍ប្រចាំខែ <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(MONTHLY)</span>'
    };
    return map[key] || key;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const modalTitleEl = document.getElementById("modalTitle");
    const modalIconEl = document.getElementById("modalIcon");
    const statRowEl = document.getElementById("statRow");
    const detailHeadEl = document.getElementById("detailHead");
    const detailBodyEl = document.getElementById("detailBody");
    const modalDialog = document.querySelector("#reportModal .modal-dialog");
    const modalContentEl = document.querySelector("#reportModal .modal-content");
    const modalBodyEl = document.querySelector("#reportModal .modal-body");
    const modalFooterEl = document.querySelector("#reportModal .modal-footer");
    const modalMetaEl = document.getElementById("modalMeta");

    // Make modal layout flexible and responsive:
    // - full-screen on small devices
    // - content uses flex column so footer stays pinned
    if (modalDialog) modalDialog.classList.add("modal-fullscreen-sm-down");
    if (modalContentEl) modalContentEl.classList.add("d-flex", "flex-column");
    if (modalBodyEl) {
      modalBodyEl.style.flex = "1 1 auto";
      modalBodyEl.style.overflow = "auto";
      modalBodyEl.classList.add("d-flex", "flex-column");
    }
    if (modalFooterEl) modalFooterEl.style.flex = "0 0 auto";

    document.querySelectorAll('[data-bs-target="#reportModal"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const report = btn.getAttribute("data-report") || "";
        const category = btn.getAttribute("data-category") || "";

        if (modalTitleEl) modalTitleEl.innerHTML = getLocalizedTitle(report);

        const iconMap = {
          sales: "bi bi-cart-fill",
          inventory: "bi bi-boxes",
          finance: "bi bi-file-earmark-text-fill",
          hr: "bi bi-person-badge-fill"
        };
        const iconClass = iconMap[category] || "bi bi-bar-chart-line-fill";
        if (modalIconEl) modalIconEl.className = iconClass;

        const showTable = category === "inventory" || report === "stockValuation";

        if (modalDialog) modalDialog.classList.toggle("modal-lg", showTable);

        if (showTable) {
          renderStockTable(detailHeadEl, detailBodyEl);
          if (modalMetaEl) modalMetaEl.textContent = "ស្ថានភាពស្តុកបច្ចុប្បន្ន — ទិន្នន័យសាកល្បង។";
        } else {
          if (detailHeadEl) detailHeadEl.innerHTML = "";
          if (detailBodyEl) detailBodyEl.innerHTML = "<tr><td colspan='4' class='text-center'>ទិន្នន័យមិនមានសម្រាប់របាយការណ៍នេះ។</td></tr>";
          if (modalMetaEl) modalMetaEl.textContent = "នេះជាទិន្នន័យសាកល្បង។ ភ្ជាប់ទៅប្រព័ន្ធខាងក្រោយរបស់អ្នកដើម្បីបង្ហាញរបាយការណ៍ពិត។";
        }
      });
    });
  });
})();
