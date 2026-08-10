(function () {
  var STORAGE_KEY = 'iamSidebarScrollTop';

  var desktopNav = document.querySelector('aside.sidebar > ul.nav');
  var mobileNav = document.querySelector('#mobileSidebar .offcanvas-body > ul.nav');

  function restoreScroll(el) {
    if (!el) return;
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved !== null) el.scrollTop = parseInt(saved, 10) || 0;
  }

  function saveScroll(el) {
    if (!el) return;
    sessionStorage.setItem(STORAGE_KEY, el.scrollTop);
  }

  restoreScroll(desktopNav);
  restoreScroll(mobileNav);

  if (desktopNav) desktopNav.addEventListener('scroll', function () { saveScroll(desktopNav); });
  if (mobileNav) mobileNav.addEventListener('scroll', function () { saveScroll(mobileNav); });

  document.querySelectorAll('.sidebar a.nav-link, #mobileSidebar a.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      saveScroll(desktopNav);
      saveScroll(mobileNav);
    });
  });
})();
