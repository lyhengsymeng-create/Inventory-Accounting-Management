/* ==========================================================
   sidebar-accordion.js
   Makes the sidebar submenus (Attendance, Purchase, Accounting…)
   behave like an accordion: opening one closes any other submenu
   that was open in the same menu, so the sidebar stays short and
   clean instead of growing with every group expanded at once.
   ========================================================== */
(function () {
  function setupAccordion(menuRoot) {
    if (!menuRoot) return;
    var toggles = menuRoot.querySelectorAll(':scope > li > a.submenu-toggle');

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var targetSel = toggle.getAttribute('data-bs-target');
        toggles.forEach(function (other) {
          if (other === toggle) return;
          var otherTargetSel = other.getAttribute('data-bs-target');
          if (!otherTargetSel || otherTargetSel === targetSel) return;
          var otherPanel = menuRoot.querySelector(otherTargetSel);
          if (otherPanel && otherPanel.classList.contains('show')) {
            var collapse = bootstrap.Collapse.getOrCreateInstance(otherPanel, { toggle: false });
            collapse.hide();
          }
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupAccordion(document.getElementById('sidebarMenu'));
    setupAccordion(document.getElementById('sidebarMenuOff'));
  });
})();
