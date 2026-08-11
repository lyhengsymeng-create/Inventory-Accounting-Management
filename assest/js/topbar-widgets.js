/* ==========================================================
   topbar-widgets.js
   Wires up the shared topbar: ស្វែងរក (search) box, ការជូនដំណឹង
   (notifications) dropdown, and ប្រូហ្វាល (profile) pill.
   Shared across every Admin page.
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  function closeAllTopbarPopups(except) {
    ['topbarSearchBox', 'topbarNotifDropdown'].forEach(id => {
      if (id === except) return;
      const el = document.getElementById(id);
      if (el) el.classList.add('d-none');
    });
  }

  // ---------- ស្វែងរក (Search) ----------
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
      searchBox.classList.add('d-none');
      searchInput.value = '';
    });
  }

  // ---------- ការជូនដំណឹង (Notifications) ----------
  const bellBtn = document.getElementById('topbarBellBtn');
  const notifDropdown = document.getElementById('topbarNotifDropdown');
  const notifList = document.getElementById('topbarNotifList');

  if (bellBtn && notifDropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllTopbarPopups('topbarNotifDropdown');
      if (notifList && !notifList.dataset.rendered) {
        notifList.innerHTML = '<div class="text-muted small text-center py-3">គ្មានការជូនដំណឹងថ្មីទេ 🎉</div>';
        notifList.dataset.rendered = '1';
      }
      notifDropdown.classList.toggle('d-none');
    });
  }

  // ---------- ប្រូហ្វាល (Profile) ----------
  const profilePill = document.getElementById('topbarProfilePill');
  if (profilePill) {
    profilePill.addEventListener('click', () => {
      window.location.href = 'Settings.html';
    });
  }

  // ---------- Close popups when clicking outside ----------
  document.addEventListener('click', () => closeAllTopbarPopups());
});
