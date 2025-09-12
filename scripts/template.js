/**
 * Generates the HTML template for the sidebar.
 *
 * @returns {string} The HTML string for the sidebar.
 */
function sidebarShow() {
  return `<a href="../pages/summary.html"><img class="logo" src="../assets/img/logo-white.png" alt="logo"/></a>
          <div class="navigation">
              <div id="summary">
                  <a href="../pages/summary.html" class="d_flex_c g_12 w-100">     
                      <img src="../assets/icon/summary.png" alt="summary icon"/>    
                      <span class="sidebar-link">Summary</span>
                  </a>
               </div>   
              <div id="task">
                  <a href="../pages/add_task.html" class="d_flex_c g_12 w-100">     
                      <img src="../assets/icon/addTask.png" alt="task icon"/>    
                      <span class="sidebar-link">Add Task</span>
                  </a>
              </div> 
              <div id="board">
                  <a href="../pages/board.html" class="d_flex_c g_12 w-100">     
                      <img src="../assets/icon/board.png" alt="board icon"/>    
                      <span class="sidebar-link">Board</span>
                  </a>
              </div>   
              <div id="contacts">
                  <a href="../pages/contacts.html" class="d_flex_c g_12 w-100">     
                      <img src="../assets/icon/contacts.png" alt="contacts icon"/>    
                      <span class="sidebar-link">Contacts</span>
                  </a>
              </div> 
          </div>
          <div class="privacy-container">
        <a href="privacy_policy.html">Privacy Policy</a>
        <a href="legal_notice.html">Legal notice</a>
      </div>
  `;
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
  return `<span data-firstletter="${firstLetter(name)}">
            <div data-contact onclick="toggleContactSelect(event, ${index}); toggleContactMenu('add');" class="d_flex_c_c contacts-div first-letter-hover">
              <span id="first-letter-${index}" class="first-letter">
                ${name.at(0)}${name.split(' ')[1]?.at(0) || ''}
              </span>
              <div class="center-contacts">
                  <span id="contact-name-${index}">${name}</span>
                  <a><span id="contact-email-${index}" class="email">${contact.email}</span></a>
              </div>
            </div>
          </span>`;
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
  return `<span data-firstletter="${firstLetter(name)}">
            <div data-contact onclick="toggleContactSelect(event, ${index}); toggleContactMenu('add');" class="d_flex_c_c contacts-div first-letter-hover">
              <img id="first-letter-${index}" onclick="stopPropagation(event); bigPicture('first-letter-${index}');" src="${contact.img}" class="profile-picture-list">
              <div class="center-contacts">
                  <span id="contact-name-${index}">${name}</span>
                  <a><span id="contact-email-${index}" class="email">${contact.email}</span></a>
              </div>
            </div>
          </span>`;
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
  return `<div class="big-letter-ctn file-upload-container" onclick="${imagepicker}.click();  userImgDefine(${numberOfContact});">
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
  return `<div class="big-letter-ctn file-upload-container" onclick="${imagepicker}.click();  userImgDefine(${numberOfContact});">
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
  const userPicture = numberOfContact != null ?  contacts[numberOfContact].img : "../assets/icon/person-light.png";
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
          <img src="${userPicture}" class="${ content === "Edit" ? 'profile-picture-span' : 'person-icon' } ${userPicture  === undefined ? "hidden" : "" }">
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
       <img src="../assets/icon/prio-${task.prio}-transparent.png" alt="priority icon" />
     </div>
   </li>
  `;
}

/**
 * Generates a template string for assigned users.
 * 
 */
function getAssignedTemplate(assignedTo, previewTask) {
  const assignedElements = assignedTo?.map(({ name, role }) => {
    const elements = `<span class="${getRoleString(role)}">${getInitialsName(name)}</span> ${previewTask ? `<span>${name}</span>` : ''}`;
    return previewTask ? `<li>${elements}</li>` : elements;
  });

  if (!previewTask && assignedElements.length > 4) {
    return getAssignedToString(assignedElements);
  }

  const assignedTemplates = assignedElements?.join(' ');
  assignedTemplate = assignedTemplates;
  return assignedTemplates;
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