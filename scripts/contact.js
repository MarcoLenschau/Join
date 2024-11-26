/**
 * Loads the contact page by rendering the sidebar, header, and contact list,
 * and shows which site is active.
 * 
 * @returns {Promise<void>} This function does not return any value and resolves when the contacts are loaded.
 */
async function loadContact() {
  loadSidebar();
  loadHeader();
  showWhichSiteIsAktiv();
  renderContacts();
}

/**
 * Updates the active site on the board by adding and removing the 'active' and 'no-active' classes.
 * This function marks the 'contacts' section as active and hides the others.
 * 
 * @returns {void} This function does not return any value.
 */
function showWhichSiteIsAktiv() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'no-active');
  addClassToElement('board', 'no-active');
  addClassToElement('contacts', 'active');
}

/**
 * Renders detailed information for a contact based on the provided contact number.
 * It retrieves and displays the contact's name, email, and job title, and renders
 * the relevant content container.
 * 
 * @param {number} numberOfContact - The identifier of the contact for which the information is being rendered.
 * @returns {void} This function does not return any value.
 */
function renderMoreInformationContent(numberOfContact) {
  const contactNameElement = document.getElementById('contact-name-' + numberOfContact);
  const contactEmailElement = document.getElementById('contact-email-' + numberOfContact);
  const jobTitle = checkJobAndColor(numberOfContact);

  renderInfoContainer(numberOfContact);
  renderInfoContent(contactNameElement, contactEmailElement, jobTitle, numberOfContact);
}

/**
 * Displays more information for a selected contact or clears the information
 * if no contact is selected and `isCreateOrUpdate` is false.
 * 
 * @param {number} numberOfContact - The identifier of the contact to render more information for.
 * @param {boolean} isCreateOrUpdate - A flag indicating whether the operation is related to creating or updating a contact.
 * @returns {void} This function does not return any value.
 */
function moreInfomationOfContact(numberOfContact, isCreateOrUpdate) {
  const selectedContactElement = document.querySelector('[data-contact].selected-contact');

  if (!selectedContactElement && !isCreateOrUpdate) {
    document.getElementById('more-information').innerHTML = '';
    return;
  }
  renderMoreInformationContent(numberOfContact);
}

function renderInfoContainer(numberOfContact) {
  const infoDiv = document.getElementById('more-information');
  infoDiv.innerHTML = getMoreInfomationTemplate(numberOfContact);
}

/**
 * Renders the detailed information for a contact, including the name, email, job title,
 * and updates the contact's initials. It also stores the current contact number.
 * 
 * @param {HTMLElement} contactNameElement - The HTML element containing the contact's name.
 * @param {HTMLElement} contactEmailElement - The HTML element containing the contact's email.
 * @param {string} jobTitle - The job title of the contact.
 * @param {number} numberOfContact - The identifier (index) of the contact whose details are being rendered.
 * @returns {void} This function does not return any value.
 */
function renderInfoContent(...elements) {
  const [contactNameElement, contactEmailElement, jobTitle, numberOfContact] = elements;

  document.getElementById(`first-big-letter-${numberOfContact}`).innerHTML = extractTheFirstLetter(
    contactNameElement.innerText.split(' '),
  );
  addClassToElement(`first-big-letter-${numberOfContact}`, jobTitle);
  contactNameElement.innerHTML = contacts[numberOfContact].name;
  contactEmailElement.innerHTML = contacts[numberOfContact].email;
  currentContact = numberOfContact; 
}

/**
 * Reveals the "More Information" section and hides the "More" button.
 */
function getHiddenMoreInformation() {
  document.getElementById('big-content').style = '';
  addClassToElement('more-button-div', 'd_none');
}


/**
 * Displays the list of contacts in the `.contacts-list` element.
 * Clears any existing content and appends a template for each contact.
 * Also checks the job and color for styling or categorization.
 */
function showContactsData() {
  const contactsList = document.querySelector('.contacts-list');

  contactsList.innerHTML = '';

  for (let index = 0; index < contacts.length; index += 1) {
    contactsList.innerHTML += getContactsTemplate(index);
    checkJobAndColor(index);
  }
}


/**
 * Handles the form submission to save or create a contact.
 * 
 * @param {Event} event - The event object from the form submission.
 * @param {string} content - Determines if the operation is 'Add' or 'Update'.
 * @param {number} numberOfContact - The index of the contact to update (if updating).
 */
async function saveAndCreate(event, content, numberOfContact) {
  event.preventDefault();

  if (content === 'Add') {
    addNewContact(defineNewContact());
    organizeContacts();
  } else {
    await updateContact(numberOfContact);
  }

  renderContacts(true);
}

/**
 * Updates a contact's information both locally and in the backend.
 * 
 * @param {number} numberOfContact - The index of the contact to be updated.
 */
async function updateContact(numberOfContact) {
  const contact = contacts[numberOfContact];
  const { id } = contact;
  saveContact(numberOfContact);
  sortContacts();
  showContactsData();
  moreInfomationOfContact(numberOfContact, true);
  organizeContacts();
  await updateDataAtBackend(id, 'contacts', { ...contact, id: undefined });
}

/**
 * Defines a new contact by collecting data from the form fields.
 * 
 * @returns {Object} An object representing the new contact with name, email, phone, and a default role.
 */
function defineNewContact() {
  let userData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    role: 'Tester',
  };
  return userData;
}

/**
 * Adds a new contact to the contacts list, updates the display, and saves the data to the backend.
 * 
 * @param {Object} userData - The contact data to be added. Should contain the name, email, phone, and role.
 */
async function addNewContact(userData) {
  contacts.push(userData);

  sortContacts();
  showContactsData();
  moreInfomationOfContact(contacts.indexOf(userData), true);
  hideAddContactMenu();

  const { name } = await postDataAtBackend(userData, 'contacts');

  contacts.slice(-1);
  contacts.push({ ...userData, id: name });
  sortContacts();
}

/**
 * Saves the updated contact information to the specified contact in the contacts array.
 * 
 * @param {number} numberOfContact - The index of the contact in the `contacts` array to update.
 */

function saveContact(numberOfContact) {
  if (numberOfContact != null) {
    contacts[numberOfContact].name = document.getElementById('name').value;
    contacts[numberOfContact].email = document.getElementById('email').value;
    contacts[numberOfContact].phone = document.getElementById('phone').value;
    hideAddContactMenu();
  }
}

/**
 * Hides the "Add Contact" menu dialog by removing the 'show-modal' class.
 * 
 */
function deleteAndCancel(content) {
  if (content === 'Add') {
    hideAddContactMenu();
  } else {
    hideAddContactMenu();
  }
}

/**
 * Hides the "Add Contact" modal by removing the `show-modal` class.
 * 
 */
function hideAddContactMenu() {
  document.getElementById('add-contact-menu-dialog').classList.remove('show-modal');
}

/**
 * Organizes the contacts by grouping them based on the first letter of their name.
 * 
 */
function organizeContacts() {
  const listContactsElement = document.querySelector('.contacts-list');
  const listOfContacts = Array.from(listContactsElement.children);

  listContactsElement.innerHTML = '';
  listOfContacts.forEach((contactEl) => {
    const firstLetter = contactEl.dataset.firstletter;
    let divGroup = document.querySelector(`[data-firstletter="${firstLetter}"]`);
    if (!divGroup) {
      divGroup = document.createElement('div');
      divGroup.setAttribute('data-firstletter', firstLetter);
      divGroup.innerHTML = `<h3>${firstLetter}</h3>`; // H3 direkt hier hinzufügen
      listContactsElement.appendChild(divGroup);
    }
    divGroup.appendChild(contactEl);
  });
}

/**
 * Sorts the `contacts` array alphabetically by the first letter of each contact's name.
 * 
 */
function sortContacts() {
  contacts.sort((a, b) => {
    const nameA = a.name.charAt(0).toLowerCase();
    const nameB = b.name.charAt(0).toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
}

/**
 * Toggles the selection state of a contact and ensures only one contact is selected at a time.
 * 
 * @param {Event} event - The click event triggered by the user interaction.
 * @param {number} index - The index of the contact in the `contacts` array whose details need to be displayed.
 */
function toggleContactSelect(event, index) {
  const contactElement = event.target.closest('[data-contact]');
  const contactsList = Array.from(document.querySelectorAll('[data-contact]'));

  contactsList.forEach((contact) => {
    const isSelectedContact = contactElement === contact;

    if (isSelectedContact) {
      contact.classList.toggle('selected-contact');
    } else {
      contact.classList.remove('selected-contact');
    }
  });
  moreInfomationOfContact(index); // Kontaktinfo anzeigen
}

function closeSmallMenu(event){
  const moreButtonDiv = event.target.closest(".more-button-div")
  if(moreButtonDiv)return
  document.getElementById('toggleMenu')?.classList.add('d_none');
}

/**
 * Closes the contact modal when the user clicks outside of the modal content.
 * 
 */
function closeContactModal(event) {
  const isTaskMenu = event.target.closest('.add-contact-overlay');
  const modal = event.currentTarget;

  if (!isTaskMenu) modal.classList.remove('show-modal');
}

/**
 * Toggles the visibility of the menu.
*/
function toggleMenu() {
  document.getElementById('toggleMenu')?.classList.toggle('d_none');
}

/**
 * Toggles the visibility of the contact menu.
 * 
 * @param {string} method - The method to apply ('add' or 'remove') to show or hide the menu.
*/
function toggleContactMenu(method) {
  document.querySelector('.big-content').classList[method]('show-modal');
}
