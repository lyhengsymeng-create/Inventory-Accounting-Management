const REPORTS = {
      bestSelling: {
        title: "ផលិតផលលក់ដាច់",
        sub: "BEST SELLING PRODUCTS",
        icon: "bi-trophy-fill",
        color: " #181a35",
        stats: [
          { icon: "bi-box-seam-fill", color: "var(--bestselling)", value: "18", km: "ផលិតផលកំពូល", en: "Top Products" },
          { icon: "bi-cart-check-fill", color: "var(--sales)", value: "412", km: "ចំនួនលក់សរុប", en: "Units Sold" },
          { icon: "bi-cash-coin", color: "var(--profit)", value: "$5,240", km: "ចំណូលពីផលិតផលកំពូល", en: "Revenue" },
        ],
        headers: ["លេខកូដ", "ឈ្មោះផលិតផល", "ចំនួនលក់", "ចំណូល", "និន្នាការ"],
        rows: [
          ["P-0012", "អង្ករសែនក្រូប ៥គ.ក", "128", "$1,280.00", "កំពុងកើនឡើង"],
          ["P-0034", "ប្រេងឆាមាស ១លីត្រ", "95", "$760.00", "កំពុងកើនឡើង"],
          ["P-0056", "ទឹកសុទ្ធ 500ml (កេស)", "88", "$440.00", "ស្ថិតស្ថេរ"],
          ["P-0078", "ស្ករស ១គ.ក", "66", "$198.00", "ស្ថិតស្ថេរ"],
          ["P-0091", "ទឹកកញ្ចប់ 1.5L", "35", "$105.00", "កំពុងធ្លាក់ចុះ"],
        ],
      },
      slowMoving: {
        title: "ផលិតផលលក់យឺត",
        sub: "SLOW MOVING PRODUCTS",
        icon: "bi-hourglass-split",
      color: " #181a35",
        stats: [
          { icon: "bi-box-seam", color: "var(--slowmoving)", value: "22", km: "ផលិតផលលក់យឺត", en: "Slow Items" },
          { icon: "bi-calendar-x", color: "var(--expense)", value: "45", km: "មិនលក់ក្នុងរយៈពេល (ថ្ងៃ)", en: "Days No Sale" },
          { icon: "bi-cash-stack", color: "var(--ink-500)", value: "$1,860", km: "តម្លៃស្តុកជាប់គាំង", en: "Tied Up Value" },
        ],
        headers: ["លេខកូដ", "ឈ្មោះផលិតផល", "ចំនួនស្តុក", "ចុងក្រោយបានលក់", "ស្ថានភាព"],
        rows: [
          ["P-0140", "ស្ករកែវ ១គ.ក", "48", "22-05-2026", "ជិតអស់"],
          ["P-0155", "ប្រេងអូលីវ ៥០០ml", "30", "10-05-2026", "គ្រប់គ្រាន់"],
          ["P-0163", "ទឹកជ្រលក់ស្ពៃ", "26", "02-05-2026", "គ្រប់គ្រាន់"],
          ["P-0178", "ចាហួយកញ្ចប់", "19", "28-04-2026", "ជិតអស់"],
        ],
      },
      customer: {
        title: "របាយការណ៍អតិថិជន",
        sub: "CUSTOMER REPORT",
        icon: "bi-people-fill",
        color: " #181a35",
        stats: [
          { icon: "bi-person-fill", color: "var(--customer)", value: "186", km: "អតិថិជនសរុប", en: "Total Customers" },
          { icon: "bi-person-plus-fill", color: "var(--inventory)", value: "14", km: "អតិថិជនថ្មី", en: "New Customers" },
          { icon: "bi-cash-coin", color: "var(--profit)", value: "$3,960", km: "ការចំណាយសរុប", en: "Total Spend" },
        ],
        headers: ["ឈ្មោះអតិថិជន", "ចំនួនវិក្កយបត្រ", "ការទិញចុងក្រោយ", "ចំណាយសរុប", "ស្ថានភាព"],
        rows: [
          ["សុខា", "12", "14-07-2026", "$860.00", "បានទូទាត់"],
          ["ដារា", "8", "13-07-2026", "$420.00", "មិនទាន់ទូទាត់"],
          ["សុភា", "20", "12-07-2026", "$1,240.00", "បានទូទាត់"],
          ["វិចិត្រា", "5", "09-07-2026", "$180.00", "បានទូទាត់"],
        ],
      },
      supplier: {
        title: "របាយការណ៍អ្នកផ្គត់ផ្គង់",
        sub: "SUPPLIER REPORT",
        icon: "bi-truck",
        color: " #181a35",
        stats: [
          { icon: "bi-people-fill", color: "var(--supplier)", value: "6", km: "អ្នកផ្គត់ផ្គង់", en: "Suppliers" },
          { icon: "bi-receipt", color: "var(--purchase)", value: "18", km: "ការបញ្ជាទិញ", en: "Purchase Orders" },
          { icon: "bi-cash-stack", color: "var(--expense)", value: "$3,120", km: "ចំណាយសរុប", en: "Total Spent" },
        ],
        headers: ["អ្នកផ្គត់ផ្គង់", "ចំនួនការបញ្ជាទិញ", "ការទិញចុងក្រោយ", "សរុប", "ស្ថានភាព"],
        rows: [
          ["ក្រុមហ៊ុន ម៉េងលី", "7", "10-07-2026", "$960.00", "បានទូទាត់"],
          ["សហករណ៍ស្រូវមាស", "4", "08-07-2026", "$540.00", "មិនទាន់ទូទាត់"],
          ["អ្នកផ្គត់ផ្គង់ភេសជ្ជៈ", "7", "05-07-2026", "$1,620.00", "បានទូទាត់"],
        ],
      },
      employee: {
        title: "របាយការណ៍សមិទ្ធកម្មបុគ្គលិក",
        sub: "EMPLOYEE PERFORMANCE REPORT",
        icon: "bi-person-badge-fill",
        color: " #181a35",
        stats: [
          { icon: "bi-people-fill", color: "var(--employee)", value: "12", km: "បុគ្គលិកសកម្ម", en: "Active Staff" },
          { icon: "bi-cart-check-fill", color: "var(--sales)", value: "96", km: "វិក្កយបត្របានធ្វើ", en: "Invoices Handled" },
          { icon: "bi-cash-coin", color: "var(--profit)", value: "$4,580", km: "ការលក់សរុប", en: "Total Sales" },
        ],
        headers: ["ឈ្មោះបុគ្គលិក", "តួនាទី", "វិក្កយបត្រ", "ការលក់សរុប", "ការវាយតម្លៃ"],
        rows: [
          ["សុគន្ធ", "អ្នកលក់", "34", "$1,640.00", "ល្អប្រសើរ"],
          ["វណ្ណា", "អ្នកលក់", "28", "$1,220.00", "ល្អ"],
          ["ចាន់ថា", "អ្នកគិតលុយ", "34", "$1,720.00", "ល្អប្រសើរ"],
        ],
      },
      profit: {
        title: "ការវិភាគប្រាក់ចំណេញ",
        sub: "PROFIT ANALYSIS",
        icon: "bi-graph-up-arrow",
        color: " #181a35",
        stats: [
          { icon: "bi-graph-up-arrow", color: "var(--sales)", value: "$4,580", km: "ចំណូលសរុប", en: "Total Revenue" },
          { icon: "bi-receipt-cutoff", color: "var(--expense)", value: "$1,940", km: "ចំណាយសរុប", en: "Total Expense" },
          { icon: "bi-piggy-bank-fill", color: "var(--profit)", value: "$2,640", km: "ប្រាក់ចំណេញសុទ្ធ", en: "Net Profit" },
        ],
        headers: ["ខែ", "ចំណូល", "ចំណាយ", "ប្រាក់ចំណេញ"],
        rows: [
          ["កក្កដា 2026", "$4,580.00", "$1,940.00", "$2,640.00"],
          ["មិថុនា 2026", "$3,920.00", "$1,610.00", "$2,310.00"],
          ["ឧសភា 2026", "$4,105.00", "$1,780.00", "$2,325.00"],
        ],
      },
      tax: {
        title: "របាយការណ៍ពន្ធ",
        sub: "TAX REPORT",
        icon: "bi-percent",
        color: " #181a35",
        stats: [
          { icon: "bi-percent", color: "var(--tax)", value: "10%", km: "អត្រាពន្ធ VAT", en: "VAT Rate" },
          { icon: "bi-cash-coin", color: "var(--sales)", value: "$4,580", km: "ចំណូលមុនពន្ធ", en: "Pre-tax Revenue" },
          { icon: "bi-receipt", color: "var(--tax)", value: "$458", km: "ពន្ធសរុប", en: "Total Tax Collected" },
        ],
        headers: ["លេខវិក្កយបត្រ", "ថ្ងៃលក់", "ចំណូលមុនពន្ធ", "ពន្ធ (10%)", "សរុប"],
        rows: [
          ["INV-1001", "14-07-2026", "$78.18", "$7.82", "$86.00"],
          ["INV-1002", "14-07-2026", "$10.91", "$1.09", "$12.00"],
          ["INV-1004", "12-07-2026", "$192.73", "$19.27", "$212.00"],
        ],
      },
      financial: {
        title: "របាយការណ៍ហិរញ្ញវត្ថុ",
        sub: "FINANCIAL STATEMENT",
        icon: "bi-file-earmark-text-fill",
        color: " #181a35",
        stats: [
          { icon: "bi-graph-up-arrow", color: "var(--sales)", value: "$4,580", km: "ចំណូលសរុប", en: "Total Revenue" },
          { icon: "bi-receipt-cutoff", color: "var(--expense)", value: "$1,940", km: "ចំណាយសរុប", en: "Total Expense" },
          { icon: "bi-bank", color: "var(--financial)", value: "$18,420", km: "ទ្រព្យសកម្មសរុប", en: "Total Assets" },
        ],
        headers: ["ធាតុ", "ចំណាត់ថ្នាក់", "ចំនួនទឹកប្រាក់"],
        rows: [
          ["សាច់ប្រាក់ក្នុងដៃ", "ទ្រព្យសកម្ម", "$6,200.00"],
          ["ស្តុកទំនិញ", "ទ្រព្យសកម្ម", "$8,420.00"],
          ["បំណុលអ្នកផ្គត់ផ្គង់", "បំណុល", "$1,860.00"],
          ["ប្រាក់ចំណេញរក្សាទុក", "មូលធន", "$12,760.00"],
        ],
      },
      stockValuation: {
        title: "តម្លៃស្តុក",
        sub: "STOCK VALUATION",
        icon: "bi-boxes",
        ccolor: " #181a35",
        stats: [
          { icon: "bi-boxes", color: "var(--stockval)", value: "312", km: "ចំនួនផលិតផលសរុប", en: "Total Products" },
          { icon: "bi-cash-stack", color: "var(--profit)", value: "$8,420", km: "តម្លៃស្តុកសរុប", en: "Total Stock Value" },
          { icon: "bi-exclamation-triangle-fill", color: "var(--expense)", value: "14", km: "ជិតអស់ស្តុក", en: "Low Stock" },
        ],
        headers: ["លេខកូដ", "ឈ្មោះផលិតផល", "បរិមាណ", "ថ្លៃដើមឯកតា", "តម្លៃសរុប"],
        rows: [
          ["P-0021", "ស្ករ ១គ.ក", "6", "$0.85", "$5.10"],
          ["P-0045", "ប្រេងឆា ១លីត្រ", "42", "$3.20", "$134.40"],
          ["P-0118", "នំបុ័ង", "58", "$0.60", "$34.80"],
        ],
      },
      daily: {
        title: "របាយការណ៍ប្រចាំថ្ងៃ",
        sub: "DAILY REPORT",
        icon: "bi-calendar-day-fill",
        color: " #181a35",
        stats: [
          { icon: "bi-file-earmark-text-fill", color: "var(--sales)", value: "9", km: "ចំនួនវិក្កយបត្រ", en: "Invoices Today" },
          { icon: "bi-cash-coin", color: "var(--profit)", value: "$412.00", km: "ចំណូលថ្ងៃនេះ", en: "Today Revenue" },
          { icon: "bi-receipt-cutoff", color: "var(--expense)", value: "$85.00", km: "ចំណាយថ្ងៃនេះ", en: "Today Expense" },
        ],
        headers: ["ម៉ោង", "លេខវិក្កយបត្រ", "អតិថិជន", "សរុប", "ស្ថានភាព"],
        rows: [
          ["09:20 AM", "INV-1001", "សុខា", "$86.00", "បានទូទាត់"],
          ["11:05 AM", "INV-1002", "អតិថិជនចរណ៍", "$12.00", "បានទូទាត់"],
          ["02:40 PM", "INV-1003", "ដារា", "$100.00", "មិនទាន់ទូទាត់"],
        ],
      },
      weekly: {
        title: "របាយការណ៍ប្រចាំសប្តាហ៍",
        sub: "WEEKLY REPORT",
        icon: "bi-calendar-week-fill",
        color: " #181a35",
        stats: [
          { icon: "bi-file-earmark-text-fill", color: "var(--sales)", value: "30", km: "ចំនួនវិក្កយបត្រ", en: "Invoices This Week" },
          { icon: "bi-cash-coin", color: "var(--profit)", value: "$1,860.00", km: "ចំណូលសប្តាហ៍នេះ", en: "Week Revenue" },
          { icon: "bi-receipt-cutoff", color: "var(--expense)", value: "$620.00", km: "ចំណាយសប្តាហ៍នេះ", en: "Week Expense" },
        ],
        headers: ["ថ្ងៃ", "ចំនួនវិក្កយបត្រ", "ចំណូល", "ចំណាយ"],
        rows: [
          ["ចន្ទ 07/07", "5", "$260.00", "$90.00"],
          ["អង្គារ 08/07", "6", "$310.00", "$70.00"],
          ["ពុធ 09/07", "4", "$210.00", "$85.00"],
          ["ព្រហស្បតិ៍ 10/07", "7", "$380.00", "$120.00"],
          ["សុក្រ 11/07", "8", "$700.00", "$255.00"],
        ],
      },
      monthly: {
        title: "របាយការណ៍ប្រចាំខែ",
        sub: "MONTHLY REPORT",
        icon: "bi-calendar-month-fill",
       color: " #181a35",
        stats: [
          { icon: "bi-file-earmark-text-fill", color: "var(--sales)", value: "124", km: "ចំនួនវិក្កយបត្រ", en: "Invoices This Month" },
          { icon: "bi-cash-coin", color: "var(--profit)", value: "$4,580.00", km: "ចំណូលខែនេះ", en: "Month Revenue" },
          { icon: "bi-receipt-cutoff", color: "var(--expense)", value: "$1,940.00", km: "ចំណាយខែនេះ", en: "Month Expense" },
        ],
        headers: ["សប្តាហ៍", "ចំនួនវិក្កយបត្រ", "ចំណូល", "ចំណាយ"],
        rows: [
          ["សប្តាហ៍ទី 1", "28", "$1,020.00", "$410.00"],
          ["សប្តាហ៍ទី 2", "30", "$1,860.00", "$620.00"],
          ["សប្តាហ៍ទី 3", "33", "$980.00", "$480.00"],
          ["សប្តាហ៍ទី 4", "33", "$720.00", "$430.00"],
        ],
      },
    };

    const RECENT_REPORTS = [
      { name: "ផលិតផលលក់ដាច់", key: "bestSelling", type: "របាយការណ៍ផលិតផល", branch: "សាខាមេ", range: "01/07/2026 - 14/07/2026", by: "So cheat", at: "14/07/2026 ម៉ោង ១០:៤៥ ព្រឹក" },
      { name: "របាយការណ៍អតិថិជន", key: "customer", type: "របាយការណ៍អតិថិជន", branch: "គ្រប់សាខាទាំងអស់", range: "01/07/2026 - 14/07/2026", by: "Run", at: "13/07/2026 ម៉ោង ០៩:៣០ ព្រឹក" },
      { name: "ការវិភាគប្រាក់ចំណេញ", key: "profit", type: "របាយការណ៍ហិរញ្ញវត្ថុ", branch: "សាខាមេ", range: "01/06/2026 - 30/06/2026", by: "Meng", at: "01/07/2026 ម៉ោង ០២:១៥ រសៀល" },
      { name: "របាយការណ៍ពន្ធ", key: "tax", type: "របាយការណ៍ពន្ធ", branch: "សាខាមេ", range: "01/06/2026 - 30/06/2026", by: "Rak", at: "01/07/2026 ម៉ោង ០១:២០ រសៀល" },
      { name: "តម្លៃស្តុក", key: "stockValuation", type: "របាយការណ៍ស្តុក", branch: "គ្រប់សាខាទាំងអស់", range: "30/06/2026", by: "Pi sey", at: "30/06/2026 ម៉ោង ១១:០៥ ព្រឹក" },
    ];

    function renderRecentReports() {
      const body = document.getElementById('recentReportsBody');
      body.innerHTML = RECENT_REPORTS.map((r, i) => `
      <tr>
        <td class="muted">${i + 1}</td>
        <td class="rn">${r.name}</td>
        <td>${r.type}</td>
        <td>${r.branch}</td>
        <td class="muted num">${r.range}</td>
        <td>${r.by}</td>
        <td class="muted num">${r.at}</td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn view" title="មើល" data-view="${r.key}"><i class="bi bi-eye"></i></button>
            <button class="row-action-btn download" title="ទាញយក" data-download="${r.key}"><i class="bi bi-download"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

      body.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', () => openReport(btn.getAttribute('data-view')));
      });
      body.querySelectorAll('[data-download]').forEach(btn => {
        btn.addEventListener('click', () => {
          currentReportKey = btn.getAttribute('data-download');
          document.getElementById('btnExportPdf').click();
        });
      });
    }

    document.getElementById('viewAllReportsLink').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.report-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const modalEl = document.getElementById('reportModal');
    const bsModal = new bootstrap.Modal(modalEl);
    const exportModalEl = document.getElementById('exportModal');
    const bsExportModal = new bootstrap.Modal(exportModalEl);

    let currentReportKey = 'bestSelling';
    let returningFromExport = false;

    function statusPillHtml(val) {
      if (val === "បានទូទាត់") return `<span class="status-pill paid"><i class="bi bi-check-circle-fill"></i> បានទូទាត់</span>`;
      if (val === "មិនទាន់ទូទាត់") return `<span class="status-pill unpaid"><i class="bi bi-x-circle-fill"></i> មិនទាន់ទូទាត់</span>`;
      if (val === "ជិតអស់") return `<span class="status-pill unpaid"><i class="bi bi-exclamation-triangle-fill"></i> ជិតអស់</span>`;
      if (val === "អស់ស្តុក") return `<span class="status-pill unpaid"><i class="bi bi-x-circle-fill"></i> អស់ស្តុក</span>`;
      if (val === "គ្រប់គ្រាន់") return `<span class="status-pill paid"><i class="bi bi-check-circle-fill"></i> គ្រប់គ្រាន់</span>`;
      if (val === "កំពុងកើនឡើង") return `<span class="status-pill paid"><i class="bi bi-arrow-up-circle-fill"></i> កំពុងកើនឡើង</span>`;
      if (val === "កំពុងធ្លាក់ចុះ") return `<span class="status-pill unpaid"><i class="bi bi-arrow-down-circle-fill"></i> កំពុងធ្លាក់ចុះ</span>`;
      if (val === "ស្ថិតស្ថេរ") return `<span class="status-pill paid"><i class="bi bi-dash-circle-fill"></i> ស្ថិតស្ថេរ</span>`;
      if (val === "ល្អប្រសើរ") return `<span class="status-pill paid"><i class="bi bi-star-fill"></i> ល្អប្រសើរ</span>`;
      if (val === "ល្អ") return `<span class="status-pill paid"><i class="bi bi-check-circle-fill"></i> ល្អ</span>`;
      return val;
    }

    const STATUS_VALUES = ["បានទូទាត់", "មិនទាន់ទូទាត់", "ជិតអស់", "អស់ស្តុក", "គ្រប់គ្រាន់", "កំពុងកើនឡើង", "កំពុងធ្លាក់ចុះ", "ស្ថិតស្ថេរ", "ល្អប្រសើរ", "ល្អ"];
    function renderPrintArea(key) {
      const data = REPORTS[key];
      const from = document.getElementById('fromDate').value || '—';
      const to = document.getElementById('toDate').value || '—';

      const statsHtml = data.stats.map(s => `
      <td style="padding:10px 16px; border:1px solid #E7E9F0; text-align:center;">
        <div style="font-size:19px; font-weight:800;">${s.value}</div>
        <div style="font-size:11.5px; color:#555;">${s.km}</div>
      </td>`).join('');

      const rowsHtml = data.rows.map(r => `
      <tr>${r.map((c) => `<td style="padding:8px 12px; border:1px solid #E7E9F0; font-size:12.5px;">${c}</td>`).join('')}</tr>`).join('');

      document.getElementById('printArea').innerHTML = `
      <div style="font-family:'Noto Sans Khmer',sans-serif; color:#131A2C; padding:24px;">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #131A2C; padding-bottom:12px; margin-bottom:16px;">
          <div>
            <div style="font-size:18px; font-weight:800;">${data.title} <span style="font-size:12px; font-weight:600; color:#666;">(${data.sub})</span></div>
            <div style="font-size:12px; color:#666; margin-top:4px;">រយៈពេល៖ ${from} — ${to}</div>
          </div>
          <div style="font-size:12px; color:#666; text-align:right;">
            <div style="font-weight:700; color:#131A2C;">វិបុលភាព</div>
            <div>បង្កើតនៅ ${new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>
        <table style="border-collapse:collapse; width:100%; margin-bottom:18px;"><tr>${statsHtml}</tr></table>
        <table style="border-collapse:collapse; width:100%;">
          <thead><tr>${data.headers.map(h => `<th style="padding:8px 12px; border:1px solid #E7E9F0; background:#F3F5FA; font-size:11.5px; text-align:left;">${h}</th>`).join('')}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
    }

    function showToast(msg) {
      const t = document.getElementById('toastLite');
      document.getElementById('toastMsg').textContent = msg;
      t.classList.add('show');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => t.classList.remove('show'), 2600);
    }

    function openReport(key) {
      const data = REPORTS[key];
      if (!data) return;
      currentReportKey = key;

      document.getElementById('modalHeader').style.background = `linear-gradient(120deg, ${data.color})`;
      document.getElementById('modalIcon').className = 'bi ' + data.icon;
      document.getElementById('modalTitle').innerHTML = `${data.title} <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(${data.sub})</span>`;

      const statRow = document.getElementById('statRow');
      statRow.innerHTML = data.stats.map(s => `
      <div class="col-sm-4">
        <div class="stat-card">
          <div class="stat-ic" style="background:${s.color}22; color:${s.color}"><i class="bi ${s.icon}"></i></div>
          <div class="stat-value num">${s.value}</div>
          <div class="stat-label-km">${s.km}</div>
          <div class="stat-label-en">${s.en}</div>
        </div>
      </div>
    `).join('');

      document.getElementById('detailHead').innerHTML = data.headers.map(h => `<th>${h}</th>`).join('');
      document.getElementById('detailBody').innerHTML = data.rows.map(r => {
        const cells = r.map((c, i) => {
          const isStatus = (i === r.length - 1) && STATUS_VALUES.includes(c);
          return `<td class="${/^\$|^\d+$/.test(c) ? 'num' : ''}">${isStatus ? statusPillHtml(c) : c}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');

      renderPrintArea(key);
      bsModal.show();
    }

    document.querySelectorAll('[data-report]').forEach(el => {
      el.addEventListener('click', () => openReport(el.getAttribute('data-report')));
    });

    renderRecentReports();
    document.getElementById('fromDate').addEventListener('change', () => renderPrintArea(currentReportKey));
    document.getElementById('toDate').addEventListener('change', () => renderPrintArea(currentReportKey));

    // ---- Filter bar: Report Type dropdown filters visible cards by category ----
    document.getElementById('filterReportType').addEventListener('change', (e) => {
      const val = e.target.value;
      document.querySelectorAll('.report-card, .quick-report-card').forEach(card => {
        const cat = card.getAttribute('data-category');
        card.style.display = (val === 'all' || cat === val) ? '' : 'none';
      });
    });

    // ---- Top filter-bar date range: keep the modal's from/to dates in sync too ----
    document.getElementById('filterFromDate').addEventListener('change', (e) => {
      document.getElementById('fromDate').value = e.target.value;
      renderPrintArea(currentReportKey);
    });
    document.getElementById('filterToDate').addEventListener('change', (e) => {
      document.getElementById('toDate').value = e.target.value;
      renderPrintArea(currentReportKey);
    });

    document.getElementById('btnResetFilter').addEventListener('click', () => {
      document.getElementById('filterReportType').value = 'all';
      document.getElementById('filterBranch').selectedIndex = 0;
      document.getElementById('filterFromDate').value = '2026-07-01';
      document.getElementById('filterToDate').value = '2026-07-14';
      document.querySelectorAll('.report-card, .quick-report-card').forEach(card => card.style.display = '');
      showToast('បានកំណត់តម្រងឡើងវិញ');
    });

    document.getElementById('btnExportAll').addEventListener('click', () => {
      showToast('កំពុងរៀបចំនាំចេញរបាយការណ៍ទាំងអស់');
    });

    // ---- Print button -> open export options modal ----
    document.getElementById('printTriggerBtn').addEventListener('click', () => {
      renderPrintArea(currentReportKey);
      returningFromExport = true;
      modalEl.addEventListener('hidden.bs.modal', function onHidden() {
        modalEl.removeEventListener('hidden.bs.modal', onHidden);
        bsExportModal.show();
      });
      bsModal.hide();
    });
    exportModalEl.addEventListener('hidden.bs.modal', () => {
      if (returningFromExport) {
        returningFromExport = false;
        bsModal.show();
      }
    });
    document.getElementById('btnPreview').addEventListener('click', () => {
    });

    document.getElementById('btnPrintNow').addEventListener('click', () => {
    });

    document.getElementById('btnExportPdf').addEventListener('click', () => {
    });

    document.getElementById('btnExportExcel').addEventListener('click', () => {
    });

    document.getElementById('btnSendEmail').addEventListener('click', () => {
    });
  
  (function () {
    window.addEventListener('error', function (e) {
      console.error('[Report Debug] Script error:', e.message, 'at', e.filename + ':' + e.lineno);
    });
    document.addEventListener('click', function (e) {
      const card = e.target.closest('[data-report]');
      if (!card) return;

      const key = card.getAttribute('data-report');
      if (typeof window.openReport === 'function') {
        try {
          window.openReport(key);
          return;
        } catch (err) {
          console.error('[Report Debug] openReport(key) threw:', err);
        }
      }
      const modalNode = document.getElementById('reportModal');
      if (modalNode && window.bootstrap) {
        console.warn('[Report Debug] Falling back to raw modal show for key:', key);
        const fallbackModal = bootstrap.Modal.getOrCreateInstance(modalNode);
        fallbackModal.show();
      } else {
        console.error('[Report Debug] Could not find #reportModal or bootstrap is not loaded.');
      }
    });

    console.log('[Report Debug] Fallback handler attached. Click a report card and check console for errors.');
  })();