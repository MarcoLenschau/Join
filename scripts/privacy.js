/**
 * Loads the page content for the Privacy Policy, including the sidebar and header.
 * 
 */
function loadPrivavyPolicy() {
  loadSidebar();
  loadHeader();
  showWhichSiteIsAktiv();
}


/**
 * Sets all relevant pages as "inactive" and ensures that only the current page is active.
 * 
 */
function showWhichSiteIsAktiv() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'no-active');
  addClassToElement('board', 'no-active');
  addClassToElement('contacts', 'no-active');
}


/**
 * Navigates to the previous page in the browser history.
 * 
 */
function goBack() {
  window.history.back(); // Navigiert zur vorherigen Seite in der Browser-Historie
}
