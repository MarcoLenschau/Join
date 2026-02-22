/**
 * Generates the HTML template for the sidebar.
 *
 * @param {boolean} loggedIn - Indicates if the user is logged in. Defaults to true.
 * @returns {string} The HTML string for the sidebar.
 */
function sidebarShow(loggedIn = true) {
  return `<a href="${loggedIn ? '../pages/summary.html' : '../index.html'}" class="logo-link">
            <img class="logo" src="../assets/img/logo-white.png" alt="logo"/>
          </a>
          <div class="navigation ${loggedIn ? '' : 'width-unset p-2'}">
            ${createOptionForMenu('summary', '../pages/summary.html', '../assets/icon/summary.png', 'Summary', loggedIn)}
            ${createOptionForMenu('task', '../pages/add_task.html', '../assets/icon/addTask.png', 'Add Task', loggedIn)}
            ${createOptionForMenu('board', '../pages/board.html', '../assets/icon/board.png', 'Board', loggedIn)}
            ${createOptionForMenu('contacts', '../pages/contacts.html', '../assets/icon/contacts.png', 'Contacts', loggedIn)}
            ${createOptionForMenu('login', '../index.html', '../assets/img/login.svg', 'Log In', loggedIn, true)}
          </div>
          <div class="privacy-container">
            ${createJuridicalLink('privacy-policy', 'privacy_policy.html', 'Privacy Policy', loggedIn)}
            ${createJuridicalLink('legal-notice', 'legal_notice.html', 'Legal notice', loggedIn)}
          </div>`;
}

function createOptionForMenu(id, url, imgPath, text, loggedIn, reverse = false) {
  if (reverse) { loggedIn = !loggedIn };
  return `<a id="${id}" href="${url}" class="d_flex_c d_flex_c_c g_12 h-50 w-100 ${loggedIn ? 'mobile-height' : 'd_none'}">     
            <img src="${imgPath}" alt="${id} icon"/>    
            <span class="sidebar-link">${text}</span>
          </a>`
}

function createJuridicalLink(id, url, text, loggedIn) {
  return `<a id="${id}" href="${url}" class="${loggedIn ? 'mobile-hidden' : ''}">${text}</a>`;
}

function headerShow(loggedIn = true) {
  return `<section class="content-limited">
            <h1>Kanban Project Management Tool</h1>
            <div class="profile ${loggedIn ? '' : 'd_none'}">
              <a href="./help.html">
                <img class="help-icon" src="../assets/icon/help.png" alt="help icon" />
              </a>
              <span id="first-letter-header" onclick="toggleHeaderMenu();"></span>
            </div>    
            <div class="header-menu">
              <a href="./legal_notice.html">Legal Notice</a>
              <a href="./privacy_policy.html">Privacy Policy</a>
              <a href="../index.html">Logout</a>
            </div>
          </section>`;
}

/**
 * Generates an HTML option element.
 *
 * @param {string} value - The value attribute of the option element.
 * @param {string} option - The displayed text of the option element.
 * @returns {string} The HTML string for the option element.
 */
function getListTemplate(value, option) {
  return `<option value="${value}">${option}</option>`;
}

/**
 * Generates the HTML template for the "Add Task" modal.
 *
 * @param {boolean} isEditMode - Indicates if the modal is in edit mode.
 * @param {Object} task - The task object containing task details.
 * @param {string} date - The due date of the task.
 * @param {string} subTasks - The HTML string for the subtasks.
 * @returns {string} The HTML string for the "Add Task" modal.
 */
function getAddTaskTemplate(isEditMode, task, date, subTasks) {
  return `<div class="d_flex_column responsive-margin responsive-add-task-dialog ${isEditMode ? 'edit-mode-padding' : ''}" data-modal>
              <div class="d_flex main-div">
                <div class="media-w-300">
                    <h1 class="${isEditMode ? 'd_none' : ''} add-task-title">Add Task</h1>
                    <div>
                        <div class="flex">
                            <span class="headline-span">Title <span class="color-red">*</span></span>
                            <input id="title" type="text" value="${
                              isEditMode ? task.title : ''
                            }" placeholder="Enter a title" class="input-task input-field task-input-field input-font-size-size" required/>
                        </div>
                        <div class="flex">
                            <span class="headline-span">Description</span>
                            <textarea id="description" rows="5" cols="50" placeholder="Enter a Description" class="input-font-size-size input-field">${isEditMode ? task.description : ''}</textarea>
                        </div>
                    </div>
                    <div class="flex">
                      <span class="headline-span">Due date <span class="color-red">*</span></span>
                      <input id="date" type="date" value="${date}" class="input-task task-input-field input-font-size-size input-field" required />
                    </div>
          <div class="flex">
             <span class="headline-span">Prio</span>
             <div class="d_flex">
                 <button id="urgent" data-prio="high" class="d_flex_c prio-button" onclick="checkThePrioOfTask(1);" class="input-font-size-size"> Urgent
                     <div class="d_flex_column">
                         <img id="urgent0" src="../assets/img/urgent.svg" alt="urgent" class="prio-button-image"/>
                         <img id="urgent1" src="../assets/img/urgent.svg" alt="urgent" class="prio-button-image"/>
                     </div>
                 </button>
                 <button id="medium" data-prio="medium" class="d_flex_c prio-button" onclick="checkThePrioOfTask(2);" class="input-font-size-size">
                  Medium
                   <div class="d_flex_column">
                     <img
                       id="medium0"
                       src="../assets/img/medium-white.svg"
                       alt="medium"
                       class="prio-button-image"
                     />
                     <img
                       id="medium1"
                       src="../assets/img/medium-white.svg"
                       alt="medium"
                       class="prio-button-image"
                     />
                   </div>
                 </button>
                 <button id="low" data-prio="low" class="d_flex_c prio-button" onclick="checkThePrioOfTask(3);" class="input-font-size-size">
                   Low
                   <div class="d_flex_column">
                     <img id="low0" src="../assets/img/low.svg" alt="low" class="prio-button-image" />
                     <img id="low1" src="../assets/img/low.svg" alt="low" class="prio-button-image" />
                   </div>
                 </button>
               </div>
          </div>
          <div class="flex">
            <span class="headline-span">Category <span class="color-red">*</span></span>
            <select id="category" class="h-34 input-field task-input-field input-font-size">
           <option value="" selected disabled>Select task category</option>
          <option ${task?.category === 'User Story' ? 'selected' : ''} value="User Story">User Story</option>
           <option ${
             task?.category === 'Technical Task' ? 'selected' : ''
           } value="Technical Task">Technical Task</option>
            </select>
          </div>
          <span id="required-field-big">
            <span class="color-red">*</span>This field is required
          </span>
        </div>
        <div class="separator separator-max"></div>
        ${getAddTaskRightFormTemplate(isEditMode, date, subTasks, task)}
      </div>
    </div>
    <button onclick="toggleAddTaskModal(event);" class="button-close-modal">
      <img src="../assets/icon/close.png"  alt="close icon"/>
    </button>
    </div>            
  </div>
  `;
}

/**
 * Generates the right form section of the "Add Task" modal.
 *
 * @param {boolean} isEditMode - Indicates if the modal is in edit mode.
 * @param {string} date - The due date of the task.
 * @param {string} subTasks - The HTML string for the subtasks.
 * @param {Object} task - The task object containing task details.
 * @returns {string} The HTML string for the right form section.
 */
function getAddTaskRightFormTemplate(isEditMode, date, subTasks, task) {
  return `<div class="media-w-300 add-task-right-form">
              <div class="main-container">
                <div class="file-upload"> 
                  <h3>Attachments</h3>  
                  <div class="delete-container">
                      <span>Allowed file types are JPEG and PNG</span>
                      <div>
                        <img tabindex=0 class="delete-icon" onclick="deleteFiles('all')" src="/assets/img/delete.svg" alt="delete" onkeydown="if(event.key === 'Enter') this.click();"> 
                        <span tabindex=0 class="delete-all" onclick="deleteFiles('all')" onkeydown="if(event.key === 'Enter') this.click();">Delete all</span>                              
                      </div>
                  </div>
                  <div id="dropzone" class="file-upload-container"> 
                    <img tabindex=0 class="upload-file" src="/assets/img/upload.svg" alt="file-upload-image" onclick="filepicker.click(); fileDefine();" onkeydown="if(event.key === 'Enter') this.click();">
                    <input type="file" id="filepicker" class="d_none" accept="image/*" multiple>
                    <span class="error hidden-error-message">Only image allowed</span>
                  </div>
                  <div class="d_flex_c image-container-div">
                    <div id="image-container"></div>
                  </div>
                  <div class="subtasks-container">
                    <span class="headline-span">Subtasks</span>
                    <div>
                      <div class="d_flex align-items-center">
                         <input type="text" placeholder="Add new subtask" class="subTask-input w-100 h-34 input-field task-input-field subtasks-width input-font-size" />
                         <img class="add-subTask-icon"  onclick="addSubTask()" src="../assets/img/plus.svg" />
                      </div>
                      <ul class="subtask-list">
                        ${subTasks || ''}
                      </ul>                      
                    </div>
                  </div>
                   <span class="headline-span">Assigned to</span>
                    <div tabindex=0 onclick="toggleCheckMenu();" class="d_flex input-field userlist-ctn task-input-field select-contacts" onkeydown="if(event.key === 'Enter') this.click();">
                        <span class="select-text">
                          <p class="input-font-size">Select contacts to assign</p>
                          <img class="arrow-drop-down" src="../assets/icon/arrow_drop_down.png" />
                        </span>
                        <div id="userlist" class="d_none"></div>
                    </div>
                    <ul class="assigned-list">
                      ${isEditMode ? assignedTemplate : ''}
                    </ul> 
                </div>
                             <div class="d_flex g_12">
                  <button onclick="resetTaskValues();" class="clear-button clear-and-create-button ${
                    isEditMode ? 'd_none' : ''
                  }" formnovalidate> Clear X</button>
                  <button onclick="${
                    isEditMode ? `updateTaskFields('${task.id}')` : ' createNewTask();'
                  }" class="primary-button clear-and-create-button ${isEditMode ? 'ok-button-edit-mode' : ''}  "> ${isEditMode ? 'Ok' : ' Create Task'}
                      <img src="../assets/img/check.svg" alt="check" />
                  </button>
                </div>
              </div>`;
}

/**
 * Generates the HTML template for a contact.
 *
 * @param {number} index - The index of the contact in the contacts array.
 * @returns {string} The HTML string for the contact.
 */
function getContactsTemplate(index) {
  const contact = contacts[index];
  const name = contact.name;
  if (contact.img) {
    return getContactsWithPicture(name, index, contact);
  } else {
    return getContactsWithFirstLetter(name, index, contact);
  }
}

/**
 * Creates an HTML string for a contact that does not have a profile picture.
 * Shows the first letter(s) of the contact’s name instead.
 *
 * @param {string} name - The full name of the contact.
 * @param {number} index - The contact's position in the list.
 * @param {Object} contact - The contact object containing email and other info.
 * @param {string} contact.email - The email address of the contact.
 * @returns {string} HTML string representing the contact without a picture.
 */
function getContactsWithFirstLetter(name, index, contact) {
  return `<div data-firstletter="${firstLetter(name)}" data-contact onclick="toggleContactSelect(event, ${index}); toggleContactMenu('add');" class="d_flex_c_c contacts-div first-letter-hover">
            <span id="first-letter-${index}" class="first-letter">
              ${name.at(0)}${name.split(' ')[1]?.at(0) || ''}
            </span>
            <div class="center-contacts">
                <span id="contact-name-${index}">${name}</span>
                <a><span id="contact-email-${index}" class="email">${contact.email}</span></a>
            </div>
          </div>`;
}

/**
 * Creates an HTML string for a contact that has a profile picture.
 * Displays the contact's name, email, and picture.
 *
 * @param {string} name - The full name of the contact.
 * @param {number} index - The contact's position in the list.
 * @param {Object} contact - The contact object containing image and email.
 * @param {string} contact.img - The base64 image of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @returns {string} HTML string representing the contact with a picture.
 */
function getContactsWithPicture(name, index, contact) {
  return `<div data-firstletter="${firstLetter(name)}" data-contact onclick="toggleContactSelect(event, ${index}); toggleContactMenu('add');" class="d_flex_c_c contacts-div first-letter-hover">
            <img id="first-letter-${index}" onclick="stopPropagation(event); bigPicture('first-letter-${index}');" src="${contact.img}" class="profile-picture-list">
            <div class="center-contacts">
                <span id="contact-name-${index}">${name}</span>
                <a><span id="contact-email-${index}" class="email">${contact.email}</span></a>
            </div>
          </div>`;
}

/**
 * Generates the HTML template for an assigned contact.
 *
 * @param {Object} contact - The contact object containing contact details.
 * @returns {string} The HTML string for the assigned contact.
 */
function getMoreInfomationTemplate(numberOfContact) {
  return `<div class="d_flex_c_c g_12">
                ${contacts[numberOfContact].img ?  getMoreInfoWithPicute(numberOfContact) : getMoreInfoWithBigLetter(numberOfContact)}
                <div class="d_flex_column">
                    <span class="bold" data-contact-name>${contacts[numberOfContact].name}</span>
                    <div class="d_flex g_12">
                        <div onclick="addContact('Edit', ${numberOfContact});" class="d_flex_c_c delete-and-edit">
                            <img src="../assets/icon/edit.svg"></img>
                            <span>Edit</span>
                        </div>
                        <div onclick="deleteUser(${numberOfContact}, '${contacts[numberOfContact].id}');" class="d_flex_c_c delete-and-edit">
                            <img src="../assets/icon/delete.svg"></img>
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
              </div>
              <div>
                  <span class="bold">Contact Information</span>
                  <div class="d_flex_column contact-email-info">
                      <span class="bold">Email</span>
                      <a href="mailto:${contacts[numberOfContact].email}" class="p_12"><span class="email">${contacts[numberOfContact].email}</span></a>
                  </div>
                  <div class="d_flex_column">
                      <span class="bold">Phone</span>
                      <a href="tel:${contacts[numberOfContact].phone}" class="p_12 color-black"><span>${contacts[numberOfContact].phone}</span></a>
                  </div>
                  <div class="d_flex_column">
                      <span class="bold">Role</span>
                      <span class="p_12">${contacts[numberOfContact].role}</span>
                  </div>
              </div>
              <div onclick="toggleMenu();" id="more-button-div" class="d_flex_c_c d_flex_column h-100 more-button-div">
                  <div id="toggleMenu" class="d_none d_flex_column bg-blue">
                      <a onclick="addContact('Edit', ${numberOfContact});">Edit</a>
                      <a onclick="deleteUser(${numberOfContact}, '${contacts[numberOfContact].id}'); toggleContactMenu('remove');">Delete</a>
                  </div>
                  <div class="more-button">
                      <img src="../assets/img/show_more.svg">            
                  </div>
              </div>`;
}

/**
 * Creates an HTML string for showing a big letter placeholder for a contact.
 * When clicked, it triggers the hidden file input and starts user image selection.
 *
 * @param {number} numberOfContact - The index or ID of the contact.
 * @returns {string} HTML string for the big letter input area.
 */
function getMoreInfoWithBigLetter(numberOfContact) {
  const imagepicker = `imagepicker${numberOfContact}`;
  return `<div class="big-letter-ctn file-upload-container">
              <span id="first-big-letter-${numberOfContact}" class="bold first-big-letter"></span>
              <input type="file" id="${imagepicker}" style='display: none' accept="image/*">
              <span class="error hidden-error-message">Only image allowed</span>          
          </div>`;
}

/**
 * Creates an HTML string for showing a contact's profile picture.
 * When clicked, it triggers the hidden file input and starts user image selection.
 *
 * @param {number} numberOfContact - The index or ID of the contact.
 * @returns {string} HTML string for the profile picture input area.
 */
function getMoreInfoWithPicute(numberOfContact) {
  const imagepicker = `imagepicker${numberOfContact}`;
  return `<div class="big-letter-ctn file-upload-container">
              <img id="first-big-letter-${numberOfContact}" class="first-big-letter transparent" src="${contacts[numberOfContact].img}">
              <input type="file" id="${imagepicker}" style="display: none" accept="image/*">
              <span class="error hidden-error-message">Only image allowed</span>
          </div>`;
}

/**
 * Generates an HTML template for a subtask item.
 *
 * @param {string} description - The description of the subtask.
 * @returns {string} The HTML string for the subtask item.
 */
function getSubTaskItemTemplate(description) {
  return `
   <li>
    <div>
    <input type="text" value="${description}" />
    <div class="edit-icon-ctn" data-edit-icon>
    <img onclick="toggleEditMode(event)" src="../assets/icon/edit.svg" alt="edit icon" />
       <span class="line"></span>
     <img onclick="deleteSubTask(event)" src="../assets/icon/delete.svg" alt="delete icon" />
    </div>
    <div class="edit-mode-ctn">
      <img class="close-icon" onclick="toggleEditMode(event)" src="../assets/icon/close.png" alt="close icon" />
     <span class="line"></span>
     <img  onclick="toggleEditMode(event)" src="../assets/icon/check.png" alt="check icon" />
      </div>
    </div>
   </li>`;
}

/**
 * Generates an HTML template for the add/edit contacts modal.
 *
 * @param {string} content - The main content/title of the modal.
 * @param {string} contentButton0 - The text for the cancel button.
 * @param {string} contentButton1 - The text for the save button.
 * @param {number} numberOfContact - The number of the contact.
 * @returns {string} The HTML string for the add/edit contacts modal.
 */
function getAddContactsTemplate(content, contentButton0, contentButton1, numberOfContact) {
  const imagepicker =  numberOfContact === null ? "imagepicker" : "imagepicker" + numberOfContact;
  const editpicker =  "editpicker" + numberOfContact;
  const userPicture = numberOfContact != null ? contacts[numberOfContact].img : "../assets/icon/person-light.png";
  const onclickHandler = `${content === "Edit" ? `userImageEdit(${numberOfContact})` : `userImgDefine(${numberOfContact})`}`;
  return `
  <div>
    <div class="overlay_mobile_top_part">
      <img src="../assets/img/logo-white.png" class="logo">
      <div>
        <h1 class="f_s_58">${content} contacts</h1>
        <h2 class="m-bottom-20">Tasks are better with a team!</h2>
        <div class="add-contact-separator"></div>
      </div>
    </div>
    <form class="form-ctn" onsubmit="saveAndCreate(event, '${content}', ${numberOfContact})">
      <section class="picture-section">
        <div class="add-contact-img-div file-upload-container">
          <img src="${userPicture !== undefined ? userPicture : "../assets/icon/person-light.png"}" class="${ content === "Edit" ? 'profile-picture-span' : 'person-icon person-icon-without-picture'} ${userPicture === undefined ? "hidden" : "" }">
          <input type="file" id="${ content === "Edit" ? editpicker : imagepicker }" style="display: none" accept="image/*" onclick="${onclickHandler}">
          <span class="error hidden-error-message">Only image allowed</span>
        </div>
        <div class="camera-container" onclick="${ content === "Edit" ? editpicker : imagepicker }.click();">
          <img src="../assets/img/camera.svg">
        </div>
      </section>
      <div id="inputsfields_div" class="d_flex_column g_12">
        <div class="d_flex_c_c">
          <input id="name" type="text" placeholder="Name" class="default-border input-field_contacts" required>
          <img src="../assets/img/person.svg" class="overlay-image">
        </div>
        <div class="d_flex_c_c">
          <input type="email" id="email" placeholder="Email" class="default-border input-field_contacts" required>
          <img src="../assets/img/mail.svg" class="overlay-image">
        </div>
        <div class="d_flex_c_c">
          <input type="tel" id="phone" placeholder="Phone" class="default-border input-field_contacts" required>
          <img src="../assets/icon/phone.png" class="overlay-image">
        </div>
        <div class="d_flex_c contact-overlay-buttons">
          <div id="cancel_button">
            <button type="button" onclick="deleteAndCancel('${content}', ${numberOfContact})"
               class="clear-button clear-and-create-button">${contentButton0}</button><img>
          </div>
          <a onclick="deleteAndCancel('${content}', ${numberOfContact})"
          class="overlay_cancel button_mobile">X</a>
          <div>
            <button class="primary-button clear-and-create-button">${contentButton1}</button><img>
          </div>
        </div>
      </div>
    </form>
  </div>
  `;
}

/**
 * Generates an HTML template for a contact checkbox list item.
 *
 * @param {number} index - The index of the contact in the contacts array.
 * @param {Object} contacts - The contact object containing contact details.
 * @param {string} shortcut - The shortcut/initials of the contact.
 * @param {string} jobTitle - The job title of the contact.
 * @returns {string} The HTML string for the contact checkbox list item.
 */
function getCheckBoxList(index, contacts, shortcut, jobTitle) {
  if (contacts.img) {
    return `<label onclick="event.stopPropagation(); toggleAddTaskContact(event);" for="checkbox${index}">
              <div>
                  <img class="profile-picture-list" src="${contacts.img}" alt="profile picture"/>
                  <span data-contact-name>${contacts.name}</span>
              </div>
              <input type="checkbox" id="checkbox${index}"/>
            </label>`;
  } else {
    return `<label onclick="event.stopPropagation(); toggleAddTaskContact(event);" for="checkbox${index}">
                <div>
                    <span class="${jobTitle}">${shortcut}</span>
                    <span data-contact-name>${contacts.name}</span>
                </div>
                <input type="checkbox" id="checkbox${index}"/>
            </label>`;
    }
}

/**
 * Generates an HTML template for the task preview.
 *
 * @param {Object} task - The task object containing task details.
 * @returns {string} The HTML string for the task preview.
 */
function getTaskPreviewTemplate(task) {
  return `
    <div class="task-preview">
    <button onclick="toggleAddTaskModal(event); loadFiles('${task}');" class="button-close-modal">
       <img src="../assets/icon/close.png" alt="close icon">
       </button>
        <span class="task-category bg-${
          task.category === 'User Story' ? 'dark-blue' : 'turquoise'
        }">${task.category}</span>
        <h3 class="primary-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
        <span class="distance-data">Due: <span>${task.date}</span></span>
        <span class="distance-data">Priority:
          <span> ${task.prio} <img src="../assets/icon/prio-${task.prio}-transparent.png" alt="priority icon" /></span>
        </span>
        <span class="distance-data">Assigned To:</span>
        <ul>
         ${getAssignedTemplate(task.assignedTo, true)}
        </ul>
        <span class="distance-data subtasks">Subtasks</span>
        <ul>
         ${getSubTasksTemplate(task.subTasks, task.id)}
        </ul>

        <div class="files">
          <span>Files</span>
          <div id='files-container' class='files'></div>
        </div>
        <div>
          <span onclick="deleteTask('${task.id}', ${
            task.state
          }); toggleAddTaskModal(event); toggleEmptyMessage(event); loadFiles('${task.id}');" data-delete-button>
            <img src="../assets/icon/delete.svg" alt="delete icon" />
            Delete
          </span>
          <span onclick="toggleAddTaskModal(event); loadModal(true, '${task.id}'); loadFiles('${task.id}');">
            <img src="../assets/icon/edit.svg" alt="edit icon" />
            Edit
          </span>
        </div>
      </div>
  `;
}

/**
 * Generates an HTML template for a task item.
 *
 * @param {Object} task - The task object containing task details.
 * @param {number} doneSubTasksLength - The number of completed subtasks.
 * @returns {string} The HTML string for the task item.
 */
function getTaskTemplate(task, doneSubTasksLength) {
  return `
    <li ondragstart="handleDragStart(event)"
    draggable="true"
    onclick="toggleAddTaskModal(event); loadTaskPreview('${task.id}'); loadFiles('${task.id}');" data-id="${task.id}">
     <div class="drag-and-drop-ctn"><span class="task-category bg-${task.category === 'User Story' ? 'dark-blue' : 'turquoise'}">${task.category}</span>
       <div onclick="toggleStatePopup(event)" class="drag-icon-ctn"><img data-drag-icon src="../assets/icon/drag-and-drop.png" alt="drag and drop icon" /></div></div
     <h3 class="task-title">${task.title}</h3>
     <p class="task-description">${task.description}</p>
     <span class="progressbar ${!task.subTasks ? 'd_none' : ''}">
       <progress value="${doneSubTasksLength}" max="${task.subTasks?.length}"></progress>
       <span class="subtasks-text">${doneSubTasksLength}/${task.subTasks?.length} Subtasks</span>
     </span>
     <div class="task-assigned-container">
       <div class="assigned-users">
        ${getAssignedTemplate(task.assignedTo)}
       </div>
       <img src="../assets/icon/prio-${task.prio}-transparent.png" class="prio-img" alt="priority icon" />
     </div>
   </li>
  `;
}

/**
 * Generates HTML templates for users assigned to a task.
 *
 * Filters the global `contacts` array to find users matching the `assignedTo` list,
 * then creates HTML elements for each assigned user, with or without a profile picture.
 * If not in preview mode and more than four users are assigned, returns a summarized string.
 *
 * @param {Array<Object>} assignedTo - Array of user objects assigned to the task. Each object should have at least a `name` property.
 * @param {boolean} previewTask - Flag indicating if the function is called in preview mode.
 * @returns {string} HTML string representing the assigned users, or a summarized string if not in preview mode and more than four users are assigned.
 */
function getAssignedTemplate(assignedTo, previewTask) {
  let assignedElements;  
  const assignedToUsers = contacts.filter(contact =>
    assignedTo.some(user => user.name === contact.name)
  );
  
  assignedElements = assignedToUsers?.map(({ name, role, img }) => {
    return img ? assignedToWithPicture(name, img, previewTask) : assignedToWithoutPicture(name, role, previewTask);
  });
  
  if (!previewTask && assignedElements.length > 4) {
    return getAssignedToString(assignedElements);
  }
  const assignedTemplates = assignedElements?.join(' ');
  assignedTemplate = assignedTemplates;
  return assignedTemplates;
}

/**
 * Generates an HTML string representing a user's picture and optionally their name.
 *
 * @param {string} name - The name of the user to display.
 * @param {string} img - The URL of the user's image.
 * @param {boolean} previewTask - If true, wraps the content in a <li> and includes the user's name.
 * @returns {string} The generated HTML string.
 */
function assignedToWithPicture(name, img, previewTask) {
  const elements = `<img src="${img}" class="assigned-to-picture"> ${previewTask ? `<span>${name}</span>` : ''}`;
  return previewTask ? `<li>${elements}</li>` : elements;
}

/**
 * Generates an HTML string representing a user assignment without a picture.
 *
 * @param {string} name - The name of the assigned user.
 * @param {string} role - The role of the assigned user, used to determine CSS class.
 * @param {boolean} previewTask - If true, wraps the output in a <li> and includes the full name.
 * @returns {string} The generated HTML string for the assigned user.
 */
function assignedToWithoutPicture(name, role, previewTask) {
  const elements = `<span class="${getRoleString(role)}">${getInitialsName(name)}</span> ${previewTask ? `<span>${name}</span>` : ''}`;
  return previewTask ? `<li>${elements}</li>` : elements;
}

/**
 * Generates HTML template for a list of subtasks.
 * 
 */
function getSubTasksTemplate(subTasks, taskId) {
  if (!subTasks) return '';
  return subTasks
    .map(({ description, done }) => {
      return `
      <li>
        <input type="checkbox" ${done ? 'checked' : ''}  onchange="updateCheckbox(event, '${taskId}')"/>
        <span>${description}</span>
      </li>
    `;
    })
  .join('');
}