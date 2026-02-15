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

/**
 * Updates the "more-information" container with details about a contact.
 *
 * @param {number} numberOfContact - The number that identifies which contact to show.
 */
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
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  let imgElement = document.querySelector(".person-icon");
  let imgSrc = imgElement.src;  
  let url = new URL(imgSrc);    
  let path = url.pathname;   
  if (path != '/assets/icon/person-light.png') {
    const img = document.querySelector('.person-icon').src;
    return { name,email, phone, img: img, role: 'Tester' };
  } else { return { name,email, phone, role: 'Tester' }; }
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
    console.log(contacts[numberOfContact].img);
    contacts[numberOfContact].name = document.getElementById('name').value;
    contacts[numberOfContact].email = document.getElementById('email').value;
    contacts[numberOfContact].phone = document.getElementById('phone').value;
    // Image handling is done separately by updateContactImageIfNeeded()
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
 * Organizes contact elements in the DOM by grouping them according to their first letter.
 *
 * This function retrieves all contact elements from the contacts list, clears the list,
 * and re-appends each contact into a div group based on its first letter using `createDivGroup`.
 */
function organizeContacts() {
  const listContactsElement = document.querySelector('.contacts-list');
  const listOfContacts = Array.from(listContactsElement.children);
  listContactsElement.innerHTML = '';
  listOfContacts.forEach((contactEl) => {
    createDivGroup(contactEl, listContactsElement);
  });
}

/**
 * Creates or retrieves a div group for a contact based on the first letter of the contact's name.
 *
 * If a div group for the given first letter does not exist, it creates a new one,
 * sets the appropriate data attribute, adds a heading, and appends it to the contact list.
 * The contact element is then appended to the corresponding div group.
 *
 * @param {HTMLElement} contactEl - The contact element to be added to the grouped div.
 */
function createDivGroup(contactEl, listContactsElement) {
  const firstLetter = contactEl.dataset.firstletter;
  let divGroup = document.querySelector(`[data-firstletter="${firstLetter}"]`);
  if (!divGroup) {
    divGroup = document.createElement('div');
    divGroup.setAttribute('data-firstletter', firstLetter);
    divGroup.innerHTML = `<h3>${firstLetter}</h3>`; // H3 direkt hier hinzufügen
    listContactsElement.appendChild(divGroup);
  }
  divGroup.appendChild(contactEl);
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
  moreInfomationOfContact(index);
}

/**
 * Closes the small menu if the user clicks outside the menu button area.
 *
 * @param {Event} event - The event triggered by the user's click.
 */
function closeSmallMenu(event){
  const moreButtonDiv = event.target.closest(".more-button-div");
  if (moreButtonDiv) return;
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

/**
 * Adds a user image if it is not already shown multiple times.
 *
 * @param {number} numberOfContact - The number that identifies the user.
 * @param {string} [dialog=""] - Optional text or dialog to include with the user image.
 */
function userImgDefine(numberOfContact, dialog="") {
  createUserImage(numberOfContact, dialog);
}

/**
 * Creates an image picker for a user and handles image selection.
 *
 * This function creates an image input element, listens for a file selection,
 * and processes the chosen image. It validates the file format, updates the
 * user’s contact image, and optionally displays an error message if the format
 * is not supported.
 *
 * @param {number} numberOfContact - The index or ID of the contact associated with the image.
 * @param {Object} dialog - A dialog object (used for handling UI updates or confirmations).
 */
function createUserImage(numberOfContact, dialog) {
  const imagepicker = createImagePicker(numberOfContact);
  imagepicker.addEventListener("change", () => {
    const image = imagepicker.files;
    document.querySelector(".person-icon").classList.remove("person-icon-without-picture");
    imagepickerDefine.push(numberOfContact);
    if (image.length > 0 && checkFormatOfFile(image[0])) {
      checkIsDialog(image, numberOfContact, dialog);
    } else if(!checkFormatOfFile(image[0])) {
      showErrorMessage();
    }
  },{ once: true });
}

/**
 * Creates or retrieves an image input element from the DOM.
 *
 * Depending on whether a specific contact number is provided, this function
 * returns either the default image picker element or a contact-specific one.
 *
 * @param {number|null} numberOfContact - The ID or index of the contact. If null, the default image picker is used.
 * @returns {HTMLInputElement} The image input element from the DOM.
 */
function createImagePicker(numberOfContact) {
  let imagepicker;
  if (numberOfContact === null) {
    imagepicker = document.getElementById("imagepicker");
  } else {
    imagepicker = document.getElementById("imagepicker" + numberOfContact);
  }
  return imagepicker;
}

/**
 * Decides whether to show the image in a dialog or directly for the contact.
 *
 * @param {FileList} image - The image files selected by the user.
 * @param {number} numberOfContact - The number that identifies the user.
 * @param {string} dialog - If not empty, the image will be shown in a dialog.
 */
function checkIsDialog(image, numberOfContact, dialog) {
  if (dialog !== "") {
    userImageDialog(image);
  } else {
    userImageCreate(image, numberOfContact);
  }
}

/**
 * Checks if the image input has already been used for this contact.
 * Prevents adding the same image picker multiple times.
 *
 * @param {number} numberOfContact - The number that identifies the user.
 * @returns {boolean} True if image picker for this user already exists, otherwise false.
 */
function blockMultiplySameUser(numberOfContact) {
  return imagepickerDefine.includes(numberOfContact);
}

/**
 * Compresses the image and adds it to the user’s contact.
 * Also updates the contact in the backend.
 *
 * @param {FileList} file - The image file selected by the user.
 * @param {number} numberOfContact - The number that identifies the user.
 */
async function userImageCreate(file, numberOfContact) {
  const base64 = await compressImage(file[0]);
  const userObj = { ...contacts[numberOfContact], img: base64 };
  contacts[numberOfContact] = userObj;
  checkIfImg(base64, numberOfContact);
  if (numberOfContact != null) {
    await updateDataAtBackend(contacts[numberOfContact].id, "/contacts", userObj);
  }
}

/**
 * Checks if the contact has an image element and updates it with the provided base64 image.
 * If not, it updates a dialog person icon image if present.
 *
 * @param {string} base64 - The base64-encoded image string.
 * @param {number} numberOfContact - The index of the contact.
 */
function checkIfImg(base64, numberOfContact) {
  let firstLetter, bigLetter;
  firstLetter = document.getElementById("first-letter-" + numberOfContact);
  if (document.getElementById("first-big-letter-" + numberOfContact)) {
    changeBigLetterToPicture(firstLetter, bigLetter, numberOfContact, base64);
  } else if (document.querySelector(".person-icon")) {
    document.querySelector(".person-icon").src = base64;
  }
}

/**
 * Replaces the big and small letter representations with images for a specific contact.
 * If the element is already an <img>, it simply updates the source.
 * Otherwise, it creates and appends new image elements.
 *
 * @param {HTMLElement} firstLetter - The element representing the small contact letter.
 * @param {HTMLElement} bigLetter - The element representing the big contact letter.
 * @param {number} numberOfContact - The index of the contact.
 * @param {string} base64 - The base64-encoded image string.
 */
function changeBigLetterToPicture(firstLetter, bigLetter, numberOfContact, base64) {
  bigLetter = document.getElementById("first-big-letter-" + numberOfContact);
  if (bigLetter.tagName.toLowerCase() === "img") {
    bigLetter.src = base64;
    firstLetter.src = base64;
  } else {
    createImage(base64, firstLetter, "profile-picture-list");
    createImage(base64, bigLetter, "profile-picture-span");
  }
}

/**
 * Creates an <img> element with the given base64 string and appends it to a given element.
 *
 * @param {string} base64 - The base64-encoded image string.
 * @param {HTMLElement} letter - The container element to append the image to.
 * @param {string} group - A CSS class to assign to the image (e.g., for styling).
 */
function createImage(base64, letter, group) {
  const img = document.createElement("img");
  img.src = base64;
  img.classList.add(group);
  letter.appendChild(img);
  letter.classList.add("transparent");
}

/**
 * Compresses the image and shows it in a contact dialog preview.
 *
 * @param {FileList} file - The image file selected by the user.
 */
async function userImageDialog(file) {
  const imageContainer = document.querySelector(".person-icon");
  document.querySelector(".add-contact-img-div").classList.add("no-padding");
  const base64 = await compressImage(file[0]);
  imageContainer.src = base64;
  imageContainer.classList.add("profile-picture");  
}

/**
 * Adds an event listener to the file input for editing a user's profile image.
 * When a file is selected, it compresses the image and updates the user's displayed profile picture.
 *
 * @param {number} numberOfContact - The index of the contact whose image is being edited.
 */
function userImageEdit(numberOfContact) {
  const editpicker = document.getElementById("editpicker" + numberOfContact);
  editpicker.addEventListener("change", async() => {
    if (!contacts[numberOfContact].img) {
      document.querySelector(".contact-initials").classList.add("hidden");
      document.querySelector(".add-contact-img-div").classList.remove("no-profile-picture");
    }
    const imageContainer = document.querySelector(".profile-picture-span");
    const base64 = await compressImage(editpicker.files[0]);
    imageContainer.classList.remove("hidden");
    imageContainer.src = base64;
  });
}