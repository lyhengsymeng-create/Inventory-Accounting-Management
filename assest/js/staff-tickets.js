document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('ticketsList');
  const emptyEl = document.getElementById('ticketsEmpty');
  const badge = document.getElementById('sidebarTicketsBadge');
  const sidebarLink = document.querySelector('.sidebar .nav-link[data-tab="tickets"]');

  if (!listEl || typeof SharedStore === 'undefined') return;

  if (sidebarLink) sidebarLink.addEventListener('click', renderStaffTickets);

  function renderStaffTickets() {
    const tickets = SharedStore.getTickets();
    const openCount = tickets.filter(t => t.status === 'open').length;

    if (badge) {
      if (openCount > 0) { badge.textContent = openCount; badge.style.display = ''; }
      else { badge.style.display = 'none'; }
    }

    if (tickets.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('d-none');
      return;
    }
    emptyEl.classList.add('d-none');

    listEl.innerHTML = tickets.map(t => {
      const statusBadge = t.status === 'open'
        ? '<span class="badge bg-warning-subtle text-warning-emphasis rounded-pill">កំពុងរង់ចាំ</span>'
        : '<span class="badge bg-success-subtle text-success rounded-pill">បានឆ្លើយតបរួច</span>';
      const replyBlock = t.reply
        ? `<div class="p-2 rounded-3 mb-2" style="background:#EEF2FF;">
             <div class="fw-semibold small text-primary mb-1"><i class="fa-solid fa-headset me-1"></i>ចម្លើយរបស់ Staff</div>
             <div class="small">${t.reply}</div>
           </div>`
        : '';
      const replyForm = t.status === 'open'
        ? `<div class="input-group input-group-sm mt-2">
             <input type="text" class="form-control" placeholder="សរសេរចម្លើយទៅអតិថិជន..." id="reply-input-${t.id}">
             <button class="btn btn-moss" onclick="StaffTickets.reply('${t.id}')"><i class="fa-solid fa-paper-plane"></i></button>
           </div>`
        : `<button class="btn btn-light btn-sm border rounded-2 mt-2" onclick="StaffTickets.reopen('${t.id}')">បើកឡើងវិញ</button>`;

      return `
      <div class="card border-0 shadow-sm rounded-3 p-3 mb-3">
        <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
          <div>
            <div class="fw-bold">${t.subject}</div>
            <div class="text-muted small">${t.customerName} · ${t.category} · ${new Date(t.createdAt).toLocaleString('km-KH')}</div>
          </div>
          ${statusBadge}
        </div>
        <div class="small mb-2">${t.message}</div>
        ${replyBlock}
        ${replyForm}
      </div>`;
    }).join('');
  }

  window.renderStaffTickets = renderStaffTickets;
  window.StaffTickets = {
    reply(id) {
      const input = document.getElementById('reply-input-' + id);
      if (!input || !input.value.trim()) return;
      SharedStore.replyTicket(id, input.value.trim());
      renderStaffTickets();
    },
    reopen(id) {
      SharedStore.updateTicketStatus(id, 'open');
      renderStaffTickets();
    }
  };

  renderStaffTickets();
  SharedStore.onChange(() => renderStaffTickets());
});
