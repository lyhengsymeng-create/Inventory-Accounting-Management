// ============ Report Modal: ស្ថានភាពស្តុក (Stock Status) table ============
// Whenever a "View" button is clicked, this fills the shared #reportModal
// with the report's name. If the report is the Inventory / Stock Status
// report, it also renders a real data table instead of the demo-only note.

(function () {
  const LOW_STOCK_THRESHOLD = 5;

  // Sample stock data (replace with a real API call in production)
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
    if (stock <= 0) return { label: "អស់ស្តុក", css: "format-badge" , style: "background:#f8d7da;color:#842029;" };
    if (stock <= LOW_STOCK_THRESHOLD) return { label: "ជិតអស់ស្តុក", css: "format-badge", style: "background:#fff3cd;color:#664d03;" };
    return { label: "មានស្តុក", css: "format-badge", style: "background:#d1e7dd;color:#0f5132;" };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderStockTable() {
    const tbody = document.getElementById("reportModalTbody");
    if (!tbody) return;
    tbody.innerHTML = stockData
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

  function isInventoryReport(label) {
    return /ស្តុក|inventory/i.test(label || "");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const modalNameEl = document.getElementById("reportModalName");
    const modalNoteEl = document.getElementById("reportModalNote");
    const tableWrap = document.getElementById("reportModalTableWrap");
    const dialog = document.getElementById("reportModalDialog");

    document.querySelectorAll('[data-bs-target="#reportModal"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const label = btn.getAttribute("data-report") || "—";
        if (modalNameEl) modalNameEl.textContent = label;

        const showTable = isInventoryReport(label);

        if (tableWrap) tableWrap.classList.toggle("d-none", !showTable);
        if (dialog) dialog.classList.toggle("modal-lg", showTable);

        if (showTable) {
          renderStockTable();
          if (modalNoteEl) {
            modalNoteEl.innerHTML =
              'ស្ថានភាពស្តុកបច្ចុប្បន្ន — ទិន្នន័យសាកល្បង។<br>Current stock status — demo data shown for illustration.';
          }
        } else if (modalNoteEl) {
          modalNoteEl.innerHTML =
            'នេះជាទិន្នន័យសាកល្បង។ ភ្ជាប់ទៅប្រព័ន្ធខាងក្រោយរបស់អ្នកដើម្បីបង្ហាញរបាយការណ៍ពិត។<br>This is demo data. Connect your backend to render the real report.';
        }
      });
    });
  });
})();
