let currentContact = null;

async function loadContact() {
  loadSidebar();
  loadHeader();
  showWhichSiteIsAktiv();
  renderContacts();
  // setTimeout(() => {
  //   document.getElementById('load-animation').style = 'width: 0;';
  // }, 500);
}

function showWhichSiteIsAktiv() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'no-active');
  addClassToElement('board', 'no-active');
  addClassToElement('contacts', 'active');
}

function moreInfomationOfContact(numberOfContact, isEditMode) {
  if (currentContact === numberOfContact && !isEditMode) return;

  const contactNameElement = document.getElementById('contact-name-' + numberOfContact);
  const contactEmailElement = document.getElementById('contact-email-' + numberOfContact);
  const jobTitle = checkJobAndColor(numberOfContact);
  document.getElementById('big-content').style = ' padding: 30px;';
  document.getElementById('more-information').innerHTML = getMoreInfomationTemplate(numberOfContact);
  document.getElementById('more-button-div').classList.remove('d_none');
  document.getElementById('first-big-letter-' + numberOfContact).innerHTML = extractTheFirstLetter(
    contactNameElement.innerText.split(' ')
  );
  addClassToElement('first-big-letter-' + numberOfContact, jobTitle);

  if (isEditMode) {
    contactNameElement.innerHTML = contacts[numberOfContact].name;
    contactEmailElement.innerHTML = contacts[numberOfContact].email;
  }

  currentContact = numberOfContact;
}

function getHiddenMoreInformation() {
  document.getElementById('big-content').style = '';
  addClassToElement('more-button-div', 'd_none');
}

function showContactsData() {
  const contactsList = document.querySelector('.contacts-list');

  contactsList.innerHTML = '';

  for (let index = 0; index < contacts.length; index++) {
    contactsList.innerHTML += getContactsTemplate(index);
    checkJobAndColor(index);
  }
}

async function saveAndCreate(event, content, numberOfContact) {
  event.preventDefault();

  if (content === 'Add') {
    addNewContact(defineNewContact());
    organizeContacts();
  } else {
    const contact = contacts[numberOfContact];
    const id = contact.id;
    saveContact(numberOfContact);
    showContactsData();
    moreInfomationOfContact(numberOfContact, true);
    organizeContacts();
    await updateDataAtBackend(id, 'contacts', { ...contact, id: undefined });
  }
  renderContacts(true);
}

function defineNewContact() {
  let userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    role: 'Tester',
  };
  return userData;
}

async function addNewContact(userData) {
  contacts.push(userData);

  let numberOfNewContact = contacts.length - 1;

  sortContacts();

  showContactsData();
  hideAddContactMenu();

  const { name } = await postDataAtBackend(contacts[numberOfNewContact], 'contacts');

  contacts.splice(numberOfNewContact, 1, { ...userData, id: name });
}

function saveContact(numberOfContact) {
  if (numberOfContact != null) {
    contacts[numberOfContact].name = document.getElementById('name').value;
    contacts[numberOfContact].email = document.getElementById('email').value;
    contacts[numberOfContact].phone = document.getElementById('phone').value;
    hideAddContactMenu();
  }
}

function hideAddContactMenu() {
  document.getElementById('add-contact-menu').classList.add('d_none');
}

function deleteAndCancel(content) {
  if (content === 'Add') {
    hideAddContactMenu();
  } else {
    hideAddContactMenu();
  }
}

function organizeContacts() {
  const listContactsElement = document.querySelector('.contacts-list');
  const listOfContacts = Array.from(listContactsElement.children);

  listContactsElement.innerHTML = ''; // Alle Kontakte löschen

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

function sortContacts() {
  contacts.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
}
