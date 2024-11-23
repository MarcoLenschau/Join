/**
 * Loads the help page contents, including the sidebar, header, and setting the active page.
 * 
*/
function loadhelp() {
  loadSidebar();
  loadHeader();
  showWhichSiteIsAktiv();
}

/**
 * Sets the correct page as active while marking all other pages as inactive.
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
