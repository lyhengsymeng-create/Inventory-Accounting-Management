(function () {
  var STORAGE_KEY = 'ims-theme-v2';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore (e.g. privacy mode) */
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  var sunIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="4"></circle>' +
    '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>' +
    '</svg>';

  var moonIcon =
    '<svg viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' +
    '</svg>';

  function updateButtonIcon(btn, theme) {
    btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    btn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
    btn.title = btn.getAttribute('aria-label');
  }

  function createToggleButton() {
    if (document.querySelector('.theme-toggle-btn')) return;

    var btn = document.createElement('button');
    btn.type = 'button';

    // Prefer placing the toggle inline in the topbar, right next to the
    // profile pill (matches the search / bell icon buttons already there).
    // Falls back to a fixed floating button on pages without that topbar.
    var profilePill = document.getElementById('topbarProfilePill');
    if (profilePill && profilePill.parentNode) {
      btn.className = 'theme-toggle-btn theme-toggle-btn--inline no-invert';
      profilePill.parentNode.insertBefore(btn, profilePill);
    } else {
      btn.className = 'theme-toggle-btn theme-toggle-btn--floating no-invert';
      document.body.appendChild(btn);
    }

    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    updateButtonIcon(btn, current);

    btn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
      updateButtonIcon(btn, next);
    });
  }

  // Apply the saved theme as early as possible (this file is also safe
  // to load at the end of <body> since applyTheme() is cheap/instant).
  var stored = getStoredTheme();
  if (stored === 'dark') {
    applyTheme('dark');
  }

  // Keep every open tab in sync if the user toggles theme elsewhere.
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      applyTheme(e.newValue);
      var btn = document.querySelector('.theme-toggle-btn');
      if (btn) updateButtonIcon(btn, e.newValue === 'dark' ? 'dark' : 'light');
    }
  });

  if (document.body) {
    createToggleButton();
  } else {
    document.addEventListener('DOMContentLoaded', createToggleButton);
  }
})();