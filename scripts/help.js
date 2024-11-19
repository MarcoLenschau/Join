function loadhelp() {
  loadSidebar();
  loadHeader();
  showWhichSiteIsAktiv();
}

function showWhichSiteIsAktiv() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'no-active');
  addClassToElement('board', 'no-active');
  addClassToElement('contacts', 'no-active');
}

function goBack() {
  window.history.back(); // Navigiert zur vorherigen Seite in der Browser-Historie
}
