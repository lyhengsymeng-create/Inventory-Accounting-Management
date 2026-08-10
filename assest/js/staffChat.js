/* ==========================================================
   staffChat.js — Admin ↔ Staff Direct Messages
   Plain in-memory demo data (no localStorage, no server) —
   same pattern as cheatDBAdmin.js / employeeManagement.js in
   this project. This file is the SINGLE source of truth for
   staff contacts + conversation threads used on this page —
   data resets on page reload.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Single centralized data source ---------------- */
  function seedStaff() {
    return [
      {
        id: 'S1', name: 'រឹម ភារុន', position: 'Staff', active: true,
        image: '/assest/image/phearoun_image.jpg',
        messages: [
          { from: 'staff', text: 'លោក តើម៉ោងបើកហាងថ្ងៃស្អែកមានផ្លាស់ប្តូរអ្វីទេ?', at: new Date(Date.now() - 3600e3).toISOString() },
          { from: 'admin', text: 'អត់ទេ នៅដដែល ៨ ព្រឹក។ អរគុណដែលសួរ។', at: new Date(Date.now() - 3500e3).toISOString() }
        ]
      },
      {
        id: 'S2', name: 'វ៉េត ចាន់សារ៉ាក់', position: 'Cashier', active: true,
        image: '/assest/image/DSC_1541 copy.jpg',
        messages: [
          { from: 'staff', text: 'ម៉ាស៊ីនគិតលុយនៅខាងមុខមានបញ្ហាបន្តិច សូមជួយមើល', at: new Date(Date.now() - 1800e3).toISOString() }
        ]
      },
      {
        id: 'S3', name: 'លីហេង សុីម៉េង', position: 'Stock Clerk', active: false,
        image: '/assest/image/meng_image.jpg',
        messages: []
      },
      {
        id: 'S4', name: 'សុខ ពិសី', position: 'Cashier', active: true,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXKt6OpGc7iHjVJSEUr9pV7EyG821ENIwipSvKStOVTQ&s=10',
        messages: [
          { from: 'admin', text: 'សុខ ពិសី​ តើអាចមកធ្វើការវេនល្ងាចថ្ងៃសៅរ៍នេះបានទេ?', at: new Date(Date.now() - 86000e3).toISOString() },
          { from: 'staff', text: 'ចាស បាន​ ហើយខ្ញុំនឹងមកអោយទាន់ម៉ោង', at: new Date(Date.now() - 85800e3).toISOString() }
        ]
      },
      {
        id: 'S5', name: 'សុខ តារា', position: 'Stock Clerk', active: true,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP66xZe_6NzZqJBWm79x8S2MHyt4QklAK-9-jQ-IRAFw&s=10',
        messages: []
      },
      {
        id: 'S6', name: 'ហេង ស៊ីឡុង', position: 'Cashier', active: true,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5gR8rxs27HynIOIU9zUAwqEZdJ8ktrvK22xDCiUj59Q&s=10',
        messages: [
          { from: 'staff', text: 'ថ្ងៃនេះទំនិញចូលច្រើន ត្រូវការជំនួយបន្ថែមម្នាក់ទៀតទេ?', at: new Date(Date.now() - 600e3).toISOString() }
        ]
      }
    ];
  }

  let staff = seedStaff();
  let activeStaffId = null;

  const listEl = document.getElementById('staffContactList');
  const searchInput = document.getElementById('staffSearch');
  const headerEl = document.getElementById('chatHeader');
  const threadEl = document.getElementById('chatThread');
  const chatCardEl = document.getElementById('staffChatCard');
  const backBtn = document.getElementById('chatBackBtn');

  /* Mobile master/detail: opening a chat swaps from the contact list to
     the thread view (see the max-width:767.98px rules in StaffChat.html);
     the back button reverses that. No-op visually on desktop/tablet. */
  backBtn?.addEventListener('click', () => {
    chatCardEl?.classList.remove('chat-mobile-thread-open');
  });

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function lastMessage(s) {
    return s.messages.length ? s.messages[s.messages.length - 1] : null;
  }

  function hasUnread(s) {
    const last = lastMessage(s);
    return !!(last && last.from === 'staff');
  }

  function renderKpis() {
    document.getElementById('kpiTotalChats').textContent = staff.filter(s => s.messages.length > 0).length;
    document.getElementById('kpiUnread').textContent = staff.filter(hasUnread).length;
    document.getElementById('kpiActiveStaff').textContent = staff.filter(s => s.active).length;

    const unread = staff.filter(hasUnread).length;
    const badge = document.getElementById('sidebarChatBadge');
    if (badge) {
      if (unread > 0) { badge.textContent = unread; badge.classList.remove('d-none'); }
      else { badge.classList.add('d-none'); }
    }
  }

  function renderList() {
    renderKpis();

    const q = (searchInput.value || '').trim().toLowerCase();
    const filtered = staff.filter(s => !q || s.name.toLowerCase().includes(q) || s.position.toLowerCase().includes(q));

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="text-center text-secondary small py-4">រកមិនឃើញបុគ្គលិកទេ</div>';
      return;
    }

    listEl.innerHTML = filtered.map(s => {
      const last = lastMessage(s);
      const preview = last ? escapeHtml(last.text).slice(0, 42) + (last.text.length > 42 ? '…' : '') : 'មិនទាន់មានសារ';
      const unread = hasUnread(s);
      return `
        <button type="button" class="chat-contact-item px-3 py-2 d-flex align-items-center gap-2 ${s.id === activeStaffId ? 'active' : ''}" data-staff-id="${s.id}">
          <img src="${s.image}" class="chat-avatar" alt="">
          <div class="flex-grow-1 text-start" style="min-width:0;">
            <div class="d-flex align-items-center justify-content-between">
              <span class="fw-semibold small">${escapeHtml(s.name)}</span>
              ${!s.active ? '<span class="badge bg-secondary-subtle text-secondary rounded-pill" style="font-size:.62rem;">អសកម្ម</span>' : ''}
            </div>
            <div class="text-secondary small text-truncate" style="max-width:100%;">${preview}</div>
          </div>
          ${unread ? '<span class="unread-dot"></span>' : ''}
        </button>
      `;
    }).join('');

    listEl.querySelectorAll('[data-staff-id]').forEach(el => {
      el.addEventListener('click', () => openChat(el.dataset.staffId));
    });
  }

  function openChat(staffId) {
    const s = staff.find(x => x.id === staffId);
    if (!s) return;
    activeStaffId = staffId;
    chatCardEl?.classList.add('chat-mobile-thread-open');

    headerEl.innerHTML = `
      <img src="${s.image}" class="chat-avatar" alt="">
      <div>
        <div class="fw-semibold small">${escapeHtml(s.name)}</div>
        <div class="text-secondary small">${escapeHtml(s.position)} ${s.active ? '· សកម្ម' : '· អសកម្ម'}</div>
      </div>
    `;

    renderThread(s);
    renderList();
  }

  function renderThread(s) {
    if (!s.messages.length) {
      threadEl.innerHTML = '<div class="text-center text-secondary small py-4 km">មិនទាន់មានការសន្ទនាជាមួយបុគ្គលិកនេះទេ</div>';
      return;
    }
    threadEl.innerHTML = s.messages.map(m => `
      <div class="p-2 rounded-3 ${m.from === 'admin' ? 'text-end' : ''}">
        <div class="d-inline-block px-3 py-2 rounded-3 chat-bubble ${m.from === 'admin' ? 'mine' : 'theirs'}">
          <div class="small fw-semibold mb-1">${m.from === 'admin' ? 'អ្នក (Admin)' : escapeHtml(s.name)}</div>
          <div>${escapeHtml(m.text)}</div>
          <div class="small ${m.from === 'admin' ? 'text-white-50' : 'text-secondary'} mt-1">${new Date(m.at).toLocaleTimeString()}</div>
        </div>
      </div>
    `).join('');
    threadEl.scrollTop = threadEl.scrollHeight;
  }

  searchInput.addEventListener('input', renderList);

  renderList();
});
