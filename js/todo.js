let submitBtn = document.querySelector(".btn__submit");
let numericUpBtn = document.querySelector(".btn__numeric_up");
let numericDownBtn = document.querySelector(".btn__numeric_down");
let checkboxTheme = document.querySelector(".checkboxTheme");

$(document).on("click.bs.dropdown.data-api", ".noclose", function (e) {
  e.stopPropagation();
});
submitBtn.addEventListener("click", addTask);
numericUpBtn.addEventListener("click", numericUp);
numericDownBtn.addEventListener("click", numericDown);
checkboxTheme.addEventListener("click", changeTheme);
changeTheme();
downloadLocalStorageTasks();

function changeTheme() {
  let body = document.querySelector("body");
  let titleHeader = document.querySelectorAll(".title_header");
  let navbar = document.querySelector(".navbar");
  let dropdownMenu = document.querySelector(".dropdown-menu ");
  let modalContent = document.querySelector(".modal-content");
  let closeX = document.querySelector(".close");

  if (checkboxTheme.checked == true) {
    body.style.backgroundColor = "#00000080";

    for (let i = 0; i < titleHeader.length; i++) {
      titleHeader[i].style.color = "white";
    }
    navbar.classList.add("blackNavbar");
    closeX.classList.add("NoColor");
    dropdownMenu.style.backgroundColor = "#302d2d77";
    modalContent.style.backgroundColor = "#302d2d77";
  } else {
    body.style.backgroundColor = "white";
    dropdownMenu.style.backgroundColor = "white";
    modalContent.style.backgroundColor = "white";
    for (let i = 0; i < titleHeader.length; i++) {
      titleHeader[i].style.color = "black";
    }
    navbar.classList.remove("blackNavbar");
  }
}

function addTask(e) {
  let form = document.forms.modal__form;
  let title = form.elements.title.value;
  let textArea = form.elements.textarea.value;
  let radioAll = document.querySelectorAll(".form-check-input");
  let color = form.elements.color.value;
  for (let i = 0; i < 3; i++) {
    if (radioAll[i].checked) {
      var priority = radioAll[i].value;
    }
  }

  if (title && textArea && priority) {
    e.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.remove("show");
    modal.style.display = "none";

    let modalBackdrop = document.querySelector(".modal-backdrop");
    modalBackdrop.style.display = "none";
    modalBackdrop.classList.remove("show");

    displayNewTask(title, textArea, priority, color);
  }
  let countSuccUnsucc = document.querySelector("#countSuccUnsucc");

  countSuccUnsucc.innerHTML = `${countSuccUnsucc.innerHTML.split("/")[0]}/${
    +countSuccUnsucc.innerHTML.split("/")[1] + 1
  }`;
}

function displayNewTask(title, textArea, priority, color) {
  let date = new Date();
  let timeCreation = `${date.getHours()}:${date.getMinutes()}`;
  let dateCrearion = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;

  if (!document.querySelectorAll(".liUnCompleted").length) {
    var idTask = 1;
  } else {
    let item = document.querySelectorAll(".liUnCompleted");

    // loop2: for (let i = 0; i < item.length; i++) {
    //   if (idTask == +item[i].children[0].children[0].children[1].innerHTML) {
    //     idTask = +idTask + 1;
    //     continue loop2;
    //   }
    // }

    let numItem = 0;
    var idTask = 1;
    while (numItem < item.length) {
      if (
        idTask == +item[numItem].children[0].children[0].children[1].innerHTML
      ) {
        idTask = +idTask + 1;
        numItem = 0;
      } else {
        numItem++;
      }
    }
  }
  createLocalStorage(
    title,
    textArea,
    priority,
    timeCreation,
    dateCrearion,
    color,
    idTask
  );
  createTemplate(
    title,
    textArea,
    priority,
    timeCreation,
    dateCrearion,
    color,
    idTask
  );
}

function createTemplate(
  title,
  textArea,
  priority,
  timeCreation,
  dateCrearion,
  color,
  idTask
) {
  let container_task = document.querySelector(".container_task");

  let templateLi = createElement(
    "li",
    null,
    "list-group-item d-flex w-100 mb-2 liUnCompleted"
  );
  templateLi.style.backgroundColor = `${color}`;
  let templateDiv1 = createElement("div", null, "w-100 mr-2");
  let templateDiv2 = createElement(
    "div",
    null,
    "d-flex w-100 justify-content-between"
  );
  let templateTitle = createElement("h5", `${title}`, "mb-1 color");

  if (!document.querySelectorAll(".liUnCompleted").length) {
    var idTasks = createElement("span", `1`, `idTask`);
  } else {
    var idTasks = createElement("span", `${idTask}`, "idTask");
  }

  let templateDiv3 = createElement("div", null, "date_status");
  let templateSmall1 = createElement("small", `${priority}`, "mr-2 color");
  let templateSmall2 = createElement(
    "small",
    `${timeCreation} ${dateCrearion}`,
    "color"
  );
  let templateTextarea = createElement(
    "small",
    `${textArea}`,
    "mb-1 w-100 color"
  );

  let templateDivDropDown = createElement("div", null, "dropdown m-2 dropleft");

  let templateButtonSuccess = createElement(
    "button",
    "Complete",
    "btn btn-success w-100 btn__success"
  );
  let templateButtonEdit = createElement(
    "button",
    "Edit",
    "btn btn-info w-100 my-2  btn__dropdown"
  );
  let templateButtonDelete = createElement(
    "button",
    "Delete",
    "btn btn-danger w-100  btn__dropdown"
  );

  container_task.append(templateLi);
  templateLi.append(templateDiv1);
  templateLi.append(templateDivDropDown);
  templateDiv1.append(templateDiv2);
  templateDiv2.append(templateTitle);
  templateDiv2.append(idTasks);
  templateDiv2.append(templateDiv3);
  templateDiv3.append(templateSmall1);
  templateDiv3.append(templateSmall2);
  templateDiv1.append(templateTextarea);
  templateDivDropDown.append(templateButtonSuccess);
  templateDivDropDown.append(templateButtonEdit);
  templateDivDropDown.append(templateButtonDelete);

  templateButtonSuccess.addEventListener("click", () => {
    templateLi.remove();
    createTemplateCompleted(
      title,
      textArea,
      priority,
      timeCreation,
      dateCrearion,
      color,
      idTask,
      (status = 1)
    );
  });
  templateButtonEdit.addEventListener("click", EditTask);
  templateButtonDelete.addEventListener("click", DeleteTask);
}

function createTemplateCompleted(
  title,
  textArea,
  priority,
  timeCreation,
  dateCrearion,
  color,
  idTask,
  status
) {
  if (status != 3) {
    let countSuccUnsucc = document.querySelector("#countSuccUnsucc");
    countSuccUnsucc.innerHTML = `${
      +countSuccUnsucc.innerHTML.split("/")[0] + 1
    }/${countSuccUnsucc.innerHTML.split("/")[1]}`;
  }

  let container_task = document.querySelector("#completedTasks");
  let templateLi = createElement(
    "li",
    null,
    "list-group-item d-flex w-100 mb-2 liCompleted"
  );
  templateLi.style.backgroundColor = `${color}`;

  let templateDiv1 = createElement("div", null, "w-100 mr-2");
  let templateDiv2 = createElement(
    "div",
    null,
    "d-flex w-100 justify-content-between"
  );
  let templateTitle = createElement("h5", `${title}`, "mb-1 color");
  let idTasks = createElement("span", `${idTask}`, "idTask");

  let templateDiv3 = createElement("div", null, "date_status");
  let templateSmall1 = createElement("small", `${priority}`, "mr-2 color");
  let templateSmall2 = createElement(
    "small",
    `${timeCreation} ${dateCrearion}`,
    "color"
  );
  let templateTextarea = createElement(
    "small",
    `${textArea}`,
    "mb-1 w-100 color"
  );

  let buttonContainer = createElement("div", null, "dropdown m-2 dropleft");
  let buttonReturn = createElement(
    "button",
    "Return",
    "btn btn-warning w-100 "
  );
  let buttonDelete = createElement(
    "button",
    "Delete",
    "btn btn-danger w-100 my-2 "
  );

  let items = Object.keys(localStorage);
  var idTitleUnSucc = idTask;
  let numItem = 0;

  if (status == 1) {
    while (numItem < items.length) {
      if (`task__${idTitleUnSucc}_completed` == items[numItem]) {
        idTitleUnSucc = +idTitleUnSucc + 1;
        idTasks.innerHTML = idTitleUnSucc;
        numItem = 0;

        item = localStorage.getItem(`task__${idTask}`).split(",");
        title = item[0];
        textArea = item[1];
        priority = item[2];
        timeCreation = item[3];
        dateCreation = item[4];
        color = item[5];
        localStorage.setItem(
          `task__${idTask}`,
          `${title},${textArea},${priority},${timeCreation},${dateCrearion},${color},${idTitleUnSucc}`
        );
      } else {
        numItem++;
      }
    }
  }

  if (status == 1) {
    localStorage.setItem(
      `task__${idTitleUnSucc}_completed`,
      `${localStorage.getItem(`task__${idTask}`)}`
    );

    localStorage.removeItem(`task__${idTask}`);
  }

  container_task.append(templateLi);
  templateLi.append(templateDiv1);
  templateDiv1.append(templateDiv2);
  templateDiv2.append(templateTitle);
  templateDiv2.append(idTasks);
  templateDiv2.append(templateDiv3);
  templateDiv3.append(templateSmall1);
  templateDiv3.append(templateSmall2);
  templateDiv1.append(templateTextarea);
  templateLi.append(buttonContainer);
  buttonContainer.append(buttonReturn);
  buttonContainer.append(buttonDelete);

  buttonDelete.addEventListener("click", DeleteTask);

  buttonReturn.addEventListener("click", () => {
    let items = Object.keys(localStorage);
    let idTaskSave = idTask;
    let countSuccUnsucc = document.querySelector("#countSuccUnsucc");
    countSuccUnsucc.innerHTML = `${
      +countSuccUnsucc.innerHTML.split("/")[0] - 1
    }/${countSuccUnsucc.innerHTML.split("/")[1]}`;

    let numItem = 0;
    while (numItem < items.length) {
      if (`task__${idTaskSave}` == items[numItem]) {
        idTaskSave = +idTaskSave + 1;
        idTasks.innerHTML = idTaskSave;
        numItem = 0;
      } else {
        numItem++;
      }
    }

    localStorage.setItem(
      `task__${idTaskSave}`,
      `${localStorage.getItem(`task__${idTitleUnSucc}_completed`)}`
    );

    item = localStorage.getItem(`task__${idTitleUnSucc}_completed`).split(",");

    localStorage.removeItem(`task__${idTitleUnSucc}_completed`);

    title = item[0];
    textArea = item[1];
    priority = item[2];
    timeCreation = item[3];
    dateCreation = item[4];
    color = item[5];
    createTemplate(
      title,
      textArea,
      priority,
      timeCreation,
      dateCreation,
      color,
      idTaskSave
    );
    templateLi.remove();
  });
}

function DeleteTask(event) {
  let item = event.target.parentElement.parentElement;

  let countSuccUnsucc = document.querySelector("#countSuccUnsucc");
  if (event.target.parentElement.parentElement.classList[4] == "liCompleted") {
    countSuccUnsucc.innerHTML = `${
      countSuccUnsucc.innerHTML.split("/")[0] - 1
    }/${+countSuccUnsucc.innerHTML.split("/")[1] - 1}`;
  } else {
    countSuccUnsucc.innerHTML = `${countSuccUnsucc.innerHTML.split("/")[0]}/${
      +countSuccUnsucc.innerHTML.split("/")[1] - 1
    }`;
  }

  deleteLocalStorage(item);
}

function EditTask(event) {
  let elem = event.target.parentElement.parentElement;
  let title = elem.children[0].children[0].children[0];
  let textarea = elem.children[0].children[1];
  let DateStatus = elem.children[0].children[0].children[2];
  let buttonTaskGroup = event.target.parentElement;
  let titleText = title.innerHTML;
  let textareaText = textarea.innerHTML;
  let priority = elem.children[0].children[0].children[2].children[0];
  let priorityText = priority.innerHTML;
  buttonTaskGroup.style.display = "none";

  let inputTitleText = createElement(
    "span",
    "Title:",
    "col-sm-1 col-form-label color"
  );
  let inputTitle = createElement(
    "input",
    null,
    " col-sm-11 form-control inputEditTitle"
  );
  inputTitle.value = `${titleText}`;
  elem.children[0].children[0].append(inputTitleText);
  elem.children[0].children[0].append(inputTitle);
  title.innerHTML = "";

  let rowTextarea = createElement("div", null, "row row_containerEdit");
  elem.children[0].children[0].after(rowTextarea);
  let TextaAreaInput = createElement(
    "span",
    "Text:",
    "col-sm-1 col-form-label color"
  );
  let inputTextArea = createElement(
    "input",
    null,
    " form-control inputEditTitle col-sm-11"
  );

  inputTextArea.value = `${textareaText}`;
  inputTextArea.style.height = "79px";

  rowTextarea.append(TextaAreaInput);
  rowTextarea.append(inputTextArea);
  textarea.innerHTML = "";
  DateStatus.style.display = "none";

  let buttonEditChoose = createElement(
    "div",
    null,
    "buttonEditChoose float-right"
  );
  buttonEditChoose.style.width = "20%";
  rowTextarea.after(buttonEditChoose);

  let rowPriority = createElement("div", null, "row row_containerEdit");
  let PriorityTitle = createElement(
    "span",
    "Priority:",
    "col-sm-1 col-form-label color"
  );
  let inputPriority = createElement("input", null, "form-control col-sm-11 ");
  inputPriority.value = `${priorityText}`;

  rowTextarea.after(rowPriority);
  rowPriority.append(PriorityTitle);
  rowPriority.append(inputPriority);

  let rowInputColor = createElement("div", null, "row row_containerEdit");
  let rowInputTitle = createElement(
    "span",
    "Color:",
    "col-sm-1 col-form-label color"
  );
  let inputColor = createElement("input", null, "form-control col-sm-1 ");
  inputColor.type = "color";
  rowPriority.after(rowInputColor);
  rowInputColor.append(rowInputTitle);
  rowInputColor.append(inputColor);

  let buttonOk = createElement(
    "button",
    "OK",
    "btn btn-success w-100 btnEditOk"
  );
  buttonEditChoose.append(buttonOk);

  let buttonCancel = createElement(
    "button",
    "Cansel",
    "btn btn-danger w-100 buttonCancel"
  );
  buttonEditChoose.append(buttonCancel);

  buttonOk.addEventListener("click", buttonEditOk);
  buttonCancel.addEventListener("click", (event) =>
    buttonEditCancel(titleText, textareaText, priorityText)
  );
}

function buttonEditOk(event) {
  let taskContainer = event.target.parentElement.parentElement;
  let title = taskContainer.children[0].children[0];
  let inputTitle = taskContainer.children[0].children[4];
  let inputTitleName = taskContainer.children[0].children[3];
  let textarea = taskContainer.children[5];
  let inputTextArea = taskContainer.children[1].children[1];
  let DateStatus = taskContainer.children[0].children[2];
  let Priority = taskContainer.children[0].children[2].children[0];
  let inputPriority = taskContainer.children[2].children[1];
  let inputColor = taskContainer.children[3].children[1];
  let buttonTaskGroup =
    event.target.parentElement.parentElement.parentElement.children[1];
  let id = taskContainer.children[0].children[1].innerHTML;
  title.innerHTML = `${inputTitle.value}`;
  textarea.innerHTML = `${inputTextArea.value}`;
  Priority.innerHTML = `${inputPriority.value}`;

 
  inputTitleName.remove();
  inputTitle.remove();
  taskContainer.children[4].remove();

  taskContainer.children[3].remove();
  taskContainer.children[2].remove();
  taskContainer.children[1].remove();
  buttonTaskGroup.style.display = "block";
  DateStatus.style.display = "block";
  taskContainer.parentElement.style.backgroundColor = `${inputColor.value}`;
  localStorage.setItem(
    `task__${id}`,
    `${inputTitle.value},${inputTextArea.value},${inputPriority.value},${
      DateStatus.children[1].innerHTML.split(" ")[0]
    },${DateStatus.children[1].innerHTML.split(" ")[1]},${
      inputColor.value
    },${id}`
  );
}

function buttonEditCancel(titleText, textareaText, priorityText) {
  let taskContainer = event.target.parentElement.parentElement;
  let title = taskContainer.children[0].children[0];
  let inputTitle = taskContainer.children[0].children[4];
  let inputTitleName = taskContainer.children[0].children[3];

  let textarea = taskContainer.children[4];

  let DateStatus = taskContainer.children[0].children[2];

  let inputPriority = taskContainer.children[2].children[1];

  let buttonTaskGroup =
    event.target.parentElement.parentElement.parentElement.children[1];

  title.innerHTML = `${titleText}`;
  textarea.innerHTML = `${textareaText}`;
  inputPriority.innerHTML = `${priorityText}`;

  taskContainer.children[2].remove();
  taskContainer.children[1].remove();
  inputTitleName.remove();
  inputTitle.remove();
  event.target.parentElement.remove();

  buttonTaskGroup.style.display = "block";
  DateStatus.style.display = "block";
}

function numericUp() {
  let containerTasksUnCom = document.querySelectorAll(".liUnCompleted");
  let containetTasksCloneUnCom = [].concat(...containerTasksUnCom);

  let containerTasksCom = document.querySelectorAll(".liCompleted");
  let containetTasksCloneCom = [].concat(...containerTasksCom);

  for (let i = 0; i < containerTasksCom.length; i++) {
    containerTasksCom[i].remove();
    let dateOfCreation =
      containetTasksCloneCom[i].children[0].children[0].children[2].children[1];
    let dateI = new Date(dateOfCreation.innerHTML).getTime();

    for (let j = i + 1; j < containetTasksCloneCom.length; j++) {
      let dateOfCreation =
        containetTasksCloneCom[j].children[0].children[0].children[2]
          .children[1];
      let dateJ = new Date(dateOfCreation.innerHTML).getTime();

      if (dateI < dateJ) {
        obj = containetTasksCloneCom[j].cloneNode(true);
        containetTasksCloneCom[j] = containetTasksCloneCom[i].cloneNode(true);
        containetTasksCloneCom[i] = obj.cloneNode(true);
      }
    }
    let dateArray = containetTasksCloneCom[
      i
    ].children[0].children[0].children[2].children[1].innerHTML.split(" ");
    let title =
      containetTasksCloneCom[i].children[0].children[0].children[0].innerHTML;
    let textArea = containetTasksCloneCom[i].children[0].children[1].innerHTML;
    let priority =
      containetTasksCloneCom[i].children[0].children[0].children[2].children[0]
        .innerHTML;
    let id =
      containetTasksCloneCom[i].children[0].children[0].children[1].innerHTML;

    let color = localStorage
      .getItem(
        `task__${containetTasksCloneCom[i].children[0].children[0].children[1].innerHTML}_completed`
      )
      .split(",")[5];
    createTemplateCompleted(
      title,
      textArea,
      priority,
      dateArray[0],
      dateArray[1],
      color,
      id,
      (status = 3)
    );
  }

  for (let i = 0; i < containerTasksUnCom.length; i++) {
    containerTasksUnCom[i].remove();
    let dateOfCreation =
      containetTasksCloneUnCom[i].children[0].children[0].children[2]
        .children[1];
    let dateI = new Date(dateOfCreation.innerHTML).getTime();

    for (let j = i + 1; j < containetTasksCloneUnCom.length; j++) {
      let dateOfCreation =
        containetTasksCloneUnCom[j].children[0].children[0].children[2]
          .children[1];
      let dateJ = new Date(dateOfCreation.innerHTML).getTime();

      if (dateI < dateJ) {
        obj = containetTasksCloneUnCom[j].cloneNode(true);
        containetTasksCloneUnCom[j] = containetTasksCloneUnCom[i].cloneNode(
          true
        );
        containetTasksCloneUnCom[i] = obj.cloneNode(true);
      }
    }
    let dateArray = containetTasksCloneUnCom[
      i
    ].children[0].children[0].children[2].children[1].innerHTML.split(" ");
    let title =
      containetTasksCloneUnCom[i].children[0].children[0].children[0].innerHTML;
    let textArea =
      containetTasksCloneUnCom[i].children[0].children[1].innerHTML;
    let priority =
      containetTasksCloneUnCom[i].children[0].children[0].children[2]
        .children[0].innerHTML;
    let id =
      containetTasksCloneUnCom[i].children[0].children[0].children[1].innerHTML;

    let color = localStorage
      .getItem(
        `task__${containetTasksCloneUnCom[i].children[0].children[0].children[1].innerHTML}`
      )
      .split(",")[5];
    createTemplate(
      title,
      textArea,
      priority,
      dateArray[0],
      dateArray[1],
      color,
      id
    );
  }
}
function numericDown() {
  let containerTasksUnCom = document.querySelectorAll(".liUnCompleted");
  let containetTasksCloneUnCom = [].concat(...containerTasksUnCom);

  let containerTasksCom = document.querySelectorAll(".liCompleted");
  let containetTasksCloneCom = [].concat(...containerTasksCom);

  for (let i = 0; i < containerTasksCom.length; i++) {
    containerTasksCom[i].remove();
    let dateOfCreation =
      containetTasksCloneCom[i].children[0].children[0].children[2].children[1];
    let dateI = new Date(dateOfCreation.innerHTML).getTime();

    for (let j = i + 1; j < containetTasksCloneCom.length; j++) {
      let dateOfCreation =
        containetTasksCloneCom[j].children[0].children[0].children[2]
          .children[1];
      let dateJ = new Date(dateOfCreation.innerHTML).getTime();

      if (dateI > dateJ) {
        obj = containetTasksCloneCom[j].cloneNode(true);
        containetTasksCloneCom[j] = containetTasksCloneCom[i].cloneNode(true);
        containetTasksCloneCom[i] = obj.cloneNode(true);
      }
    }
    let dateArray = containetTasksCloneCom[
      i
    ].children[0].children[0].children[2].children[1].innerHTML.split(" ");
    let title =
      containetTasksCloneCom[i].children[0].children[0].children[0].innerHTML;
    let textArea = containetTasksCloneCom[i].children[0].children[1].innerHTML;
    let priority =
      containetTasksCloneCom[i].children[0].children[0].children[2].children[0]
        .innerHTML;
    let id =
      containetTasksCloneCom[i].children[0].children[0].children[1].innerHTML;

    let color = localStorage
      .getItem(
        `task__${containetTasksCloneCom[i].children[0].children[0].children[1].innerHTML}_completed`
      )
      .split(",")[5];
    createTemplateCompleted(
      title,
      textArea,
      priority,
      dateArray[0],
      dateArray[1],
      color,
      id,
      (status = 3)
    );
  }

  for (let i = 0; i < containerTasksUnCom.length; i++) {
    containerTasksUnCom[i].remove();
    let dateOfCreation =
      containetTasksCloneUnCom[i].children[0].children[0].children[2]
        .children[1];
    let dateI = new Date(dateOfCreation.innerHTML).getTime();

    for (let j = i + 1; j < containetTasksCloneUnCom.length; j++) {
      let dateOfCreation =
        containetTasksCloneUnCom[j].children[0].children[0].children[2]
          .children[1];
      let dateJ = new Date(dateOfCreation.innerHTML).getTime();

      if (dateI > dateJ) {
        obj = containetTasksCloneUnCom[j].cloneNode(true);
        containetTasksCloneUnCom[j] = containetTasksCloneUnCom[i].cloneNode(
          true
        );
        containetTasksCloneUnCom[i] = obj.cloneNode(true);
      }
    }
    let dateArray = containetTasksCloneUnCom[
      i
    ].children[0].children[0].children[2].children[1].innerHTML.split(" ");
    let title =
      containetTasksCloneUnCom[i].children[0].children[0].children[0].innerHTML;
    let textArea =
      containetTasksCloneUnCom[i].children[0].children[1].innerHTML;
    let priority =
      containetTasksCloneUnCom[i].children[0].children[0].children[2]
        .children[0].innerHTML;
    let id =
      containetTasksCloneUnCom[i].children[0].children[0].children[1].innerHTML;

    let color = localStorage
      .getItem(
        `task__${containetTasksCloneUnCom[i].children[0].children[0].children[1].innerHTML}`
      )
      .split(",")[5];
    createTemplate(
      title,
      textArea,
      priority,
      dateArray[0],
      dateArray[1],
      color,
      id
    );
  }
}

function createLocalStorage(
  title,
  textArea,
  priority,
  timeCreation,
  dateCrearion,
  color,
  idTask
) {
  localStorage.setItem(
    `task__${idTask}`,
    `${title},${textArea},${priority},${timeCreation},${dateCrearion},${color},${idTask}`
  );
}

function downloadLocalStorageTasks() {
  let items = Object.keys(localStorage);
  for (let i = 0; i < items.length; i++) {
    item = localStorage.getItem(`${items[i]}`).split(",");
    localTitle = item[0];
    localTextarea = item[1];
    localValueRadio = item[2];
    localTimeCreation = item[3];
    localDateCrearion = item[4];
    color = item[5];
    idTask = item[6];

    if (items[i].split("_")[items[i].split("_").length - 1] != "completed") {
      createTemplate(
        localTitle,
        localTextarea,
        localValueRadio,
        localTimeCreation,
        localDateCrearion,
        color,
        idTask
      );
    } else {
      createTemplateCompleted(
        localTitle,
        localTextarea,
        localValueRadio,
        localTimeCreation,
        localDateCrearion,
        color,
        idTask,
        (status = 2)
      );
    }
  }
  let spanCountSuccUnsucc = document.querySelector("#countSuccUnsucc");
  let coutSucc = document.querySelectorAll(".liUnCompleted").length;
  
  let countUnsucc = document.querySelectorAll(".liCompleted").length;
  spanCountSuccUnsucc.innerHTML = `${countUnsucc}/${coutSucc + countUnsucc}`;
}

function deleteLocalStorage(item) {
  item.remove();
  if (item.classList[4] == "liCompleted") {
    let id = item.children[0].children[0].children[1].innerHTML;
    localStorage.removeItem(`task__${id}_completed`);
  } else {
    let id = item.children[0].children[0].children[1].innerHTML;
    localStorage.removeItem(`task__${id}`);
  }
}

function createElement(name = "div", text, className, id, event, fn) {
  let elem = document.createElement(name);
  text != undefined ? (elem.innerHTML = text) : null;
  className != undefined && className != null
    ? (elem.className = className)
    : null;

  id != undefined && id != null ? (elem.id = id) : null;
  event != undefined ? elem.addEventListener(event, fn) : null;
  return elem;
}
