/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */
import { format } from 'date-fns';
import projectBoardHandlers from './projectsDOM';
import tasksBoardHandlers from './tasksDOM';
import { tasksFromLS, projectsFromLS } from './storage';
import taskManager from './tasks';

const varList = (() => {
  const hamburger = document.querySelector('.fa-bars');
  const projectsBoard = document.querySelector('.projects-board');
  const mainContent = document.querySelector('.main-content');
  const tasksBoard = document.querySelector('.tasksBoard');
  const tasksList = document.querySelector('.tasks-list');
  const projectInputForm = document.querySelector('.project-input-form');
  const projectsList = document.querySelector('.projects-list');
  const addTaskButton = document.querySelector('.fa-plus-square');
  const taskProperties = document.querySelector('.task-properties');
  const taskInputForm = document.querySelector('.task-input-form');
  const taskUpdateForm = document.querySelector('.task-update-form');
  const content = document.querySelector('#content');
  const navContainer = document.querySelector('.nav-container');
  const projectSelect = document.querySelector('#project-select');
  const projectName = document.querySelector('#project-name');
  const taskName = document.querySelector('#task-name');
  const projects = () => {
    const updatedProjects = Array.from(document.querySelectorAll('.project'));
    return updatedProjects;
  };

  const savedProjectsArr = () => {
    const updatedProjects = Array.from(document.querySelectorAll('.project'));
    return updatedProjects.map((project) => project.innerText);
  };
  const savedTasksArr = [];
  const projectInput = document.querySelector('#project-input');
  const deleteProjectIcons = () => Array.from(document.querySelectorAll('.fa-trash'));
  const projectSubmitIcon = document.querySelector('.fa-arrow-alt-circle-down');
  const dueDate = document.querySelector('#dueDate');
  const tasks = () => {
    const updatedTasks = Array.from(document.querySelectorAll('.task'));
    return updatedTasks;
  };
  const taskTitle = document.querySelector('#taskTitle');
  const desc = document.querySelector('#desc');
  const updateDate = document.querySelector('#updateDate');
  const updateDesc = document.querySelector('#updateDesc');
  const priority = document.querySelector('#priority');
  const updatePriority = document.querySelector('#update-priority');
  const updateHigh = Array.from(updatePriority.children[0]);
  const updateMedium = Array.from(updatePriority.children[1]);
  const updateLow = Array.from(updatePriority.children[2]);
  return {
    hamburger,
    projectsBoard,
    mainContent,
    tasksBoard,
    tasksList,
    projectInputForm,
    projectsList,
    addTaskButton,
    taskProperties,
    taskInputForm,
    taskUpdateForm,
    content,
    navContainer,
    projects,
    projectInput,
    deleteProjectIcons,
    projectSubmitIcon,
    dueDate,
    taskTitle,
    tasks,
    savedTasksArr,
    savedProjectsArr,
    projectSelect,
    desc,
    updateDate,
    updateDesc,
    projectName,
    taskName,
    priority,
    updatePriority,
    updateHigh,
    updateMedium,
    updateLow,
  };
})();

export default varList;

function closeProjectsBoard(event) {
  // close projectsBoard on bg click
  if (
    varList.projectsBoard.classList.contains('displayProjects')
    && event.target.offsetLeft === 0
  ) {
    projectBoardHandlers.closeProjectsBoard();
  }
}

function displayOrCloseProjectsBoard() {
  // eslint-disable-next-line no-shadow
  const { closeProjectsBoard, openProjectsBoard } = projectBoardHandlers;
  if (varList.projectsBoard.classList.contains('displayProjects')) {
    closeProjectsBoard();
  } else {
    openProjectsBoard();
  }
}

varList.hamburger.addEventListener('click', displayOrCloseProjectsBoard);

varList.projectsBoard.addEventListener('click', closeProjectsBoard);

// projectsBoard

varList.projectsList.addEventListener('click', projectBoardHandlers.projectsListEvents);

const displayDeleteProjectIcon = () => {
  const updatedProjects = varList.projects();
  const deleteProjectIcons = varList.deleteProjectIcons();
  for (let i = 3; i < updatedProjects.length; i += 1) {
    updatedProjects[i].addEventListener('mouseover', () => {
      for (let j = 0; j < deleteProjectIcons.length; j += 1) {
        if (Array.from(updatedProjects[i].children).includes(deleteProjectIcons[j])) {
          deleteProjectIcons[j].style.visibility = 'visible';
        }
      }
    });
  }
};

const hideDeleteProjectIcon = () => {
  const updatedProjects = varList.projects();
  const deleteProjectIcons = varList.deleteProjectIcons();
  for (let i = 3; i < updatedProjects.length; i += 1) {
    updatedProjects[i].addEventListener('mouseout', () => {
      for (let j = 0; j < deleteProjectIcons.length; j += 1) {
        if (Array.from(updatedProjects[i].children).includes(deleteProjectIcons[j])) {
          deleteProjectIcons[j].style.visibility = 'hidden';
        }
      }
    });
  }
};

varList.projectInputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const projectInputVal = varList.projectInput.value;
  projectBoardHandlers.addNewProjectToProjectsList(projectInputVal);
  displayDeleteProjectIcon();
  hideDeleteProjectIcon();
});

varList.projectSubmitIcon.addEventListener('click', () => {
  projectBoardHandlers.addNewProjectToProjectsList();
  displayDeleteProjectIcon();
  hideDeleteProjectIcon();
});

// tasks related

function displayTaskDetails(event) {
  const tasks = varList.tasks();
  for (let i = 0; i <= tasks.length - 1; i += 1) {
    if ((event.target === tasks[i]
            || event.target === tasks[i].children[1]
            || Array.from(tasks[i].children[1].children).includes(event.target))
            && (varList.taskProperties.style.display === 'none'
            || window.getComputedStyle(varList.taskProperties).display === 'none')) {
      const clickedTask = tasks[i];
      tasksBoardHandlers.displayTaskProperties(clickedTask);
      event.stopPropagation();
    }
  }
}

varList.tasksBoard.addEventListener('click', (event) => {
  const {
    openAddTaskPropertiesMenu, removeTaskFromTasksList,
    checkTaskIcon, uncheckTaskIcon,
  } = tasksBoardHandlers;
  if (event.target === varList.addTaskButton
    && window.getComputedStyle(varList.projectsBoard).display !== 'grid'
    && varList.projectsBoard.style.display !== 'grid') {
    openAddTaskPropertiesMenu(event);
    event.stopPropagation();
  }

  if (Array.from(varList.tasksList.children).length > 0) {
    const taskDeleteIcon = Array.from(document.querySelectorAll('.fa-trash-alt'));
    for (let i = 0; i < taskDeleteIcon.length; i += 1) {
      if (event.target === taskDeleteIcon[i]) {
        removeTaskFromTasksList(event);
        event.stopPropagation();
      }
    }

    const taskUncheckedIcon = Array.from(document.querySelectorAll('.fa-circle'));
    for (let i = 0; i < taskUncheckedIcon.length; i += 1) {
      if (event.target === taskUncheckedIcon[i]
                && window.getComputedStyle(varList.projectsBoard).display !== 'grid'
                && varList.projectsBoard.style.display !== 'grid') {
        checkTaskIcon(event.target);
        taskManager.checkOrUncheck(event.target.parentElement.getAttribute('data-task'),
          event.target.parentElement.getAttribute('data-project'), true);
        event.stopPropagation();
        return;
      }
    }

    const taskCheckedIcon = Array.from(document.querySelectorAll('.fa-check-circle'));
    for (let i = 0; i < taskCheckedIcon.length; i += 1) {
      if (event.target === taskCheckedIcon[i]
                && window.getComputedStyle(varList.projectsBoard).display !== 'grid'
                && varList.projectsBoard.style.display !== 'grid') {
        uncheckTaskIcon(event.target);
        taskManager.checkOrUncheck(event.target.parentElement.getAttribute('data-task'),
          event.target.parentElement.getAttribute('data-project'), false);
        event.stopPropagation();
        return;
      }
    }
  }

  if (window.getComputedStyle(varList.projectsBoard).display !== 'grid'
        && varList.projectsBoard.style.display !== 'grid') {
    displayTaskDetails(event);
  }
});

varList.taskInputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  varList.content.click();
});

varList.taskProperties.addEventListener('click', tasksBoardHandlers.closeAddTaskPropertiesMenuOnBgClick);

function restoreSavedProjectsData() {
  const storedProjects = JSON.parse(projectsFromLS.accessData());
  if (storedProjects) {
    for (let i = 3; i < storedProjects.length; i += 1) {
      projectBoardHandlers.addNewProjectToProjectsList(storedProjects[i]);
      displayDeleteProjectIcon();
      hideDeleteProjectIcon();
      varList.projectsList.addEventListener(
        'click',
        projectBoardHandlers.projectsListEvents,
      );
    }
  }
}

function restoreSavedTasksData() {
  const storedTasks = JSON.parse(tasksFromLS.accessData());
  tasksFromLS.removeData();
  if (storedTasks) {
    storedTasks.forEach((task) => {
      let projectVal;
      if (task.projectsRelated.length === 1) {
        projectVal = '';
      } else {
        projectVal = task.projectsRelated[1];
      }
      tasksBoardHandlers.addNewTaskToTasksList(
        task.taskTitle,
        projectVal,
        task.priority,
        task.dueDate,
        task.desc,
        task.checked,
      );
    });
    varList.tasksBoard.addEventListener('click', (event) => {
      if (
        window.getComputedStyle(varList.projectsBoard).display !== 'grid'
        && varList.projectsBoard.style.display !== 'grid'
      ) {
        displayTaskDetails(event);
      }
    });
  }
}

window.onload = () => {
  document.querySelector('.projects-list').firstElementChild.classList.add('active-project');
  varList.dueDate.min = `${format(new Date(), 'yyyy-MM-dd')}`;
  varList.updateDate.min = `${format(new Date(), 'yyyy-MM-dd')}`;
  restoreSavedProjectsData();
  restoreSavedTasksData();
};
