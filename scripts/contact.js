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


function moreInfomationOfContact(numberOfContact) {
  // Durchlaufe alle Kontakte und überprüfe, ob einer die Klasse 'selected-contact' hat
  const selectedContactElement = document.querySelector('[data-contact].selected-contact');

  // Wenn kein Kontakt mit der Klasse 'selected-contact' gefunden wurde, setze 'more-information' zurück
  if (!selectedContactElement) {
    document.getElementById('more-information').innerHTML = "";
    return;
  }

  // Loggt die Nummer des ausgewählten Kontakts (kann entfernt werden, wenn nicht mehr benötigt)
  console.log(numberOfContact);
  
  // Den Kontakt anhand der numberOfContact-ID suchen
  const contactNameElement = document.getElementById('contact-name-' + numberOfContact);
  const contactEmailElement = document.getElementById('contact-email-' + numberOfContact);
  const jobTitle = checkJobAndColor(numberOfContact);

  // Setze die 'more-information'-Sektion auf die Template-Daten des Kontakts
  document.getElementById('more-information').innerHTML = getMoreInfomationTemplate(numberOfContact);

  // Extrahiere die ersten Buchstaben des Kontaktnamens und zeige sie an
  document.getElementById('first-big-letter-' + numberOfContact).innerHTML = extractTheFirstLetter(contactNameElement.innerText.split(' '));

  // Füge den Jobtitel zur Anzeige der ersten Buchstaben hinzu
  addClassToElement('first-big-letter-' + numberOfContact, jobTitle);

  // Aktualisiere den Namen und die E-Mail des Kontakts
  contactNameElement.innerHTML = contacts[numberOfContact].name;
  contactEmailElement.innerHTML = contacts[numberOfContact].email;

  // Setze den aktuellen Kontakt auf die gegebene Nummer
  currentContact = numberOfContact;
}






// function moreInfomationOfContact(numberOfContact, isEditMode) {

//   const contactElement = document.getElementById('contact-name-' + numberOfContact).closest('[data-contact]');

//   // Überprüfen, ob das Kontakt-Element die Klasse 'selected-contact' hat
//   if (!contactElement || !contactElement.classList.contains('selected-contact')) {
//     return; // Funktion abbrechen, wenn der Kontakt nicht ausgewählt ist
//   }

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


// function toggleContactSelect(event, index) {
//   const contactElement = event.target.closest('[data-contact]');
//   const contactsList = Array.from(document.querySelectorAll('[data-contact]'));

//   // Wenn der Kontakt bereits 'selected-contact' hat, entfernen und abbrechen
//   if (contactElement.classList.contains('selected-contact')) {
//     contactElement.classList.remove('selected-contact');
//     return; // Funktion beenden
//   }

//   // Andernfalls: Alle anderen Kontakte deselektieren
//   contactsList.forEach((contact) => {
//     contact.classList.remove('selected-contact');
//   });

//   // Nur dem angeklickten Kontakt 'selected-contact' hinzufügen
//   contactElement.classList.add('selected-contact');
// }

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

  // Rufe die Funktion auf, um die Informationen des ausgewählten Kontakts zu laden
  moreInfomationOfContact(index);
}

