/**
 * Loads the necessary components for displaying the legal notice page, including the sidebar,
 * header, and sets the correct active page (legal notice).
 * 
 * @returns {void} This function does not return any value.
 */
function loadLegalNotice() {
  loadSidebar();
  loadHeader();
  showWhichSiteIsAktiv();
}

/**
 * Sets the active page by adding the 'no-active' class to all pages and removing
 * it from the currently active page (in this case, 'contacts').
 * 
 * @returns {void} This function does not return any value.
 */
function showWhichSiteIsAktiv() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'no-active');
  addClassToElement('board', 'no-active');
  addClassToElement('contacts', 'no-active');
}

/**
 * Navigates the user to the previous page in the browser history.
 * This is equivalent to clicking the browser's "Back" button.
 * 
 * @returns {void} This function does not return any value.
 */
function goBack() {
  window.history.back(); // Navigiert zur vorherigen Seite in der Browser-Historie
}