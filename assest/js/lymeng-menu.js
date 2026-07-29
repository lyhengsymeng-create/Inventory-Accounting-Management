
document.addEventListener('DOMContentLoaded', function () {
 
  // Get ALL toggle links on the page (works for both the desktop
  // sidebar and the mobile offcanvas sidebar at the same time —
  // no need for unique ids like Bootstrap Collapse required).
  var toggles = document.querySelectorAll('.nav-toggle');
 
  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (event) {
      // Stop href="javascript:void(0)" from doing anything odd
      event.preventDefault();
 
      // .closest('.menu-item') walks UP the HTML from the clicked
      // link until it finds the parent <li class="menu-item">
      var parentItem = toggle.closest('.nav-item');
 
      if (parentItem) {
        parentItem.classList.toggle('open');
      }
    });
  });
 
});