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

function toggleContactSelect(event) {
  const contactElement = event.target.closest('[data-contact]');
  const contactsList = Array.from(document.querySelectorAll('[data-contact]'));

  contactsList.forEach((contact) => {
    if (contact === contactElement) {
      contact.classList.toggle('selected-contact');
      if (contact.classList.contains('selected-contact')) {
        const contactId = contactElement.dataset.contactId;
        moreInfomationOfContact(contactId, false);
      } else {
        clearContactInformation();
      }
    } else {
      contact.classList.remove('selected-contact');
    }
  });
}

function clearContactInformation() {
  document.getElementById('more-information').innerHTML = ''; // Bereich leeren
}

function moreInfomationOfContact(contactId, isEditMode) {
  const contactData = contacts.find((contact) => contact.id === contactId);
  if (!contactData) return;

  document.getElementById('more-information').innerHTML = getMoreInfomationTemplate(contactId);

  const jobTitle = checkJobAndColor(contactId);
  const firstBigLetter = document.getElementById('first-big-letter-' + contactId);

  firstBigLetter.innerHTML = extractTheFirstLetter(contactData.name.split(' '));
  addClassToElement('first-big-letter-' + contactId, jobTitle);

  if (isEditMode) {
    document.getElementById('contact-name-' + contactId).innerHTML = contactData.name;
    document.getElementById('contact-email-' + contactId).innerHTML = contactData.email;
  }

  currentContact = contactId;
}


// function moreInfomationOfContact(numberOfContact, isEditMode) {
//   if (currentContact === numberOfContact && !isEditMode) return;

//   const contactNameElement = document.getElementById('contact-name-' + numberOfContact);
//   const contactEmailElement = document.getElementById('contact-email-' + numberOfContact);
//   const jobTitle = checkJobAndColor(numberOfContact);

//   document.getElementById('more-information').innerHTML = getMoreInfomationTemplate(numberOfContact);

//   // document.getElementById('more-button-div').classList.remove('d_none');

//   document.getElementById('first-big-letter-' + numberOfContact).innerHTML = extractTheFirstLetter(contactNameElement.innerText.split(' '));

//   addClassToElement('first-big-letter-' + numberOfContact, jobTitle);

//   if (isEditMode) {
//     contactNameElement.innerHTML = contacts[numberOfContact].name;
//     contactEmailElement.innerHTML = contacts[numberOfContact].email;
//   }

//   currentContact = numberOfContact;
// }

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

  sortContacts();
  showContactsData();
  hideAddContactMenu();

  const { name } = await postDataAtBackend(userData, 'contacts');

  contacts.slice(-1);
  contacts.push({ ...userData, id: name });
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


// function toggleContactSelect(event) {
//   const contactElement = event.target.closest('[data-contact]');
//   const contactsList = Array.from(document.querySelectorAll('[data-contact]'));

//   contactsList.forEach((contact) => {
//     if (contact === contactElement) {
//       // Wenn der Kontakt bereits ausgewählt ist, entfernen wir die Klasse
//       contact.classList.toggle('selected-contact');
//     } else {
//       // Entferne die Klasse von allen anderen Kontakten
//       contact.classList.remove('selected-contact');
//     }
//   });
// }
