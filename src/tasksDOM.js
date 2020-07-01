/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-cycle */
import { formatDistanceToNowStrict } from 'date-fns';
import varList from './index';
import projectBoardHandlers from './projectsDOM';
import taskManager from './tasks';
import { tasksFromLS } from './storage';

const tasksBoardHandlers = (() => {
  function displayActiveProjectTasks() {
    const updatedTasks = varList.tasks();
    const { activeProject } = projectBoardHandlers;
    if (activeProject().getAttribute('data-project') !== 'all tasks') {
      updatedTasks.forEach((task) => {
        if (task.getAttribute('data-project') === activeProject().getAttribute('data-project')) {
          task.style.display = 'grid';
        } else {
          task.style.display = 'none';
        }
      });
    } else {
      updatedTasks.forEach((task) => {
        task.style.display = 'grid';
      });
    }
  }

  function openAddTaskPropertiesMenu() {
    varList.taskProperties.style.display = 'block';
    varList.taskProperties.style.zIndex = '10';
    updateProjectSelectOptions();
  }

  // close taskProperties menu
  function closeAddTaskPropertiesMenuOnBgClick(event) {
    // close task properties on bg click
    if (varList.taskProperties.style.display === 'block'
            && (varList.taskInputForm.style.display === 'grid'
             || window.getComputedStyle(varList.taskInputForm).display === 'grid')
            && event.target === varList.taskProperties
            && event.target !== varList.taskInputForm
            && !(Array.from(varList.taskInputForm.children).includes(event.target))) {
      closeAddTaskPropertiesMenu();
    }
  }

  function checkTaskIcon(uncheckCircle) {
    uncheckCircle.classList.remove('fa-circle');
    uncheckCircle.classList.add('fa-check-circle');
    // eslint-disable-next-line array-callback-return
    Array.from(uncheckCircle.nextElementSibling.children).map((child) => {
      // eslint-disable-next-line no-param-reassign
      if (uncheckCircle.parentElement.classList.contains('high-priority')) {
        child.style.textDecoration = 'line-through #bb2124';
      } else if (uncheckCircle.parentElement.classList.contains('medium-priority')) {
        child.style.textDecoration = 'line-through #22bb33';
      } else {
        child.style.textDecoration = 'line-through #27AEA4';
      }
    });
  }

  function uncheckTaskIcon(checkCircle) {
    checkCircle.classList.remove('fa-check-circle');
    checkCircle.classList.add('fa-circle');
    // eslint-disable-next-line array-callback-return
    Array.from(checkCircle.nextElementSibling.children).map((child) => {
      child.style.removeProperty('text-decoration');
    });
  }

  function addNewTaskToTasksList(taskTitle, projectVal, priority, dueDate, desc, checked) {
    if (taskTitle.length > 0
            && !(duplicateTasks(taskTitle.toLowerCase(),
              projectVal.toLowerCase()))) {
      const { activeProject } = projectBoardHandlers;
      const newTask = document.createElement('div');
      newTask.setAttribute('data-task', `${taskTitle.toLowerCase()}`);
      newTask.setAttribute('data-project', `${projectVal.toLowerCase()}`);
      newTask.className = 'task';
      newTask.innerHTML = `<i class="far fa-circle"></i>
                            <div>
                                <p>${taskTitle}</p>
                                <small class="time-left">
                                </small>
                            </div>
                            <i class="far fa-trash-alt"></i>`;
      varList.tasksList.appendChild(newTask);

      if (priority === 'High') {
        newTask.classList.add('high-priority');
      } else if (priority === 'Medium') {
        newTask.classList.add('medium-priority');
      }
      const timeLeft = Array.from(document.querySelectorAll('.time-left'));
      if (dueDate !== '') {
        timeLeft[timeLeft.length - 1].innerHTML = `${formatDistanceToNowStrict(new Date(dueDate),
          { addSuffix: true })}`;
      } else {
        timeLeft[timeLeft.length - 1].innerHTML = 'Unknown time left';
      }
      if (activeProject().getAttribute('data-project') !== 'all tasks'
                && activeProject().getAttribute('data-project') !== newTask.getAttribute('data-project')) {
        newTask.style.display = 'none';
      }

      if (checked === true) checkTaskIcon(newTask.firstElementChild);

      taskManager.addTask(taskTitle, projectVal, priority,
        dueDate, desc, checked);
      varList.taskInputForm.reset();
      event.stopPropagation();
    }
  }

  function closeAddTaskPropertiesMenu() {
    addNewTaskToTasksList(
      varList.taskTitle.value,
      varList.projectSelect.value,
      varList.priority.value,
      varList.dueDate.value,
      varList.desc.value,
      false,
    );
    varList.taskProperties.style.display = 'none';
    varList.navContainer.style.removeProperty('opacity');
    varList.tasksBoard.style.removeProperty('opacity');
  }

  function updateProjectSelectOptions() {
    const projectSelectOptions = Array.from(document.querySelectorAll('#project-select>option'));
    // remove all the previously added project options
    const dupProjectSectOptions = projectSelectOptions;
    for (let i = dupProjectSectOptions.length - 1; i > 2; i -= 1) {
      projectSelectOptions[i].remove();
    }

    // update project options
    const updatedProjects = varList.projects();
    for (let i = 3; i < updatedProjects.length; i += 1) {
      const newOption = document.createElement('option');
      newOption.innerText = updatedProjects[i].innerText;
      varList.projectSelect.appendChild(newOption);
    }
  }

  function duplicateTasks(newTask, projectSelectVal) {
    newTask = newTask.toLowerCase();
    const updatedTasks = varList.tasks();
    return updatedTasks.some((task) => task.getAttribute('data-task') === newTask
                && task.getAttribute('data-project') === projectSelectVal);
  }

  function removeTaskFromTasksList(event) {
    taskManager.removeTask(event.target.parentElement.getAttribute('data-task'),
      event.target.parentElement.getAttribute('data-project'));
    event.target.parentElement.style.display = 'none';
    event.target.parentElement.remove();
  }

  function displayTaskProperties(clickedTask) {
    if (varList.taskProperties.style.display !== 'block') {
      openAddTaskPropertiesMenu();
      varList.taskInputForm.style.display = 'none';
      varList.taskUpdateForm.style.display = 'grid';
      varList.savedTasksArr = taskManager.savedTasksArr();
      for (let i = 0; i <= varList.savedTasksArr.length - 1; i += 1) {
        if (clickedTask.getAttribute('data-task')
                === varList.savedTasksArr[i].taskTitle.toLowerCase()
                    && (varList.savedTasksArr[i].projectsRelated.includes(clickedTask.getAttribute('data-project'))
                || varList.savedTasksArr[i].projectsRelated.length === 1)) {
          document.querySelector('#task-name').innerText = `${varList.savedTasksArr[i].taskTitle}`;
          if (varList.savedTasksArr[i].projectsRelated.length !== 1) {
            document.querySelector('#project-name').innerText = `${clickedTask.getAttribute('data-project')[0].toUpperCase()
                            + clickedTask.getAttribute('data-project').slice(1)} project`;
          } else {
            document.querySelector('#project-name').innerText = 'Random project';
          }
          if (clickedTask.classList.contains('high-priority')) {
            varList.updatePriority.value = Array.from(varList.updatePriority.children)[0].innerText;
          } else if (clickedTask.classList.contains('medium-priority')) {
            varList.updatePriority.value = Array.from(varList.updatePriority.children)[1].innerText;
          } else {
            varList.updatePriority.value = Array.from(varList.updatePriority.children)[2].innerText;
          }
          varList.updateDate.value = varList.savedTasksArr[i].dueDate;
          varList.updateDesc.value = varList.savedTasksArr[i].desc;
          break;
        }
        event.stopPropagation();
      }

      varList.updateDate.addEventListener('change', (event) => {
        updateDueDate(event);
      });
      varList.updatePriority.addEventListener('change', updatePriorityVal);
      varList.updateDesc.addEventListener('input', updateDescription);
      varList.taskProperties.addEventListener('click', closeTaskUpdateMenuOnBgClick);
    }
  }

  function updatePriorityVal(event) {
    varList.savedTasksArr = taskManager.savedTasksArr();
    const taskName = varList.taskName.innerText.toLowerCase();
    const projectName = varList.projectName.innerText.slice(0,
      (varList.projectName.innerText.indexOf('project')) - 1).toLowerCase();
    for (let i = 0; i <= varList.savedTasksArr.length - 1; i += 1) {
      if (varList.taskName.innerText.toLowerCase()
        === varList.savedTasksArr[i].taskTitle.toLowerCase()
            && (varList.savedTasksArr[i].projectsRelated.includes(projectName)
            || (varList.savedTasksArr[i].projectsRelated.length === 1
            && projectName === 'random'))) {
        const updatedTasks = varList.tasks();
        for (let j = 0; j <= updatedTasks.length - 1; j += 1) {
          if (updatedTasks[j].getAttribute('data-task') === taskName
             && (updatedTasks[j].getAttribute('data-project')
             === projectName || (updatedTasks[j].getAttribute('data-project')
             === '' && projectName === 'random'))) {
            if (event.target.value === 'High') {
              if (updatedTasks[j].classList.contains('high-priority')) {
                break;
              } else if (updatedTasks[j].classList.contains('medium-priority')) {
                updatedTasks[j].classList.remove('medium-priority');
                updatedTasks[j].classList.add('high-priority');
                varList.savedTasksArr[i].priority = event.target.value;
                tasksFromLS.updateData(varList.savedTasksArr);
                break;
              } else {
                updatedTasks[j].classList.remove('low-priority');
                updatedTasks[j].classList.add('high-priority');
                varList.savedTasksArr[i].priority = event.target.value;
                tasksFromLS.updateData(varList.savedTasksArr);
                break;
              }
            } else if (event.target.value === 'Medium') {
              if (updatedTasks[j].classList.contains('medium-priority')) {
                break;
              } else if (updatedTasks[j].classList.contains('high-priority')) {
                updatedTasks[j].classList.remove('high-priority');
                updatedTasks[j].classList.add('medium-priority');
                varList.savedTasksArr[i].priority = event.target.value;
                tasksFromLS.updateData(varList.savedTasksArr);
                break;
              } else {
                updatedTasks[j].classList.remove('low-priority');
                updatedTasks[j].classList.add('medium-priority');
                varList.savedTasksArr[i].priority = event.target.value;
                tasksFromLS.updateData(varList.savedTasksArr);
                break;
              }
            } else if (updatedTasks[j].classList.contains('medium-priority')) {
              updatedTasks[j].classList.remove('medium-priority');
              varList.savedTasksArr[i].priority = event.target.value;
              tasksFromLS.updateData(varList.savedTasksArr);
              break;
            } else if (updatedTasks[j].classList.contains('high-priority')) {
              updatedTasks[j].classList.remove('high-priority');
              varList.savedTasksArr[i].priority = event.target.value;
              tasksFromLS.updateData(varList.savedTasksArr);
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }

  function closeTaskUpdateMenuOnBgClick() {
    if (varList.taskProperties.style.display === 'block'
            && (varList.taskInputForm.style.display !== 'grid'
             || window.getComputedStyle(varList.taskInputForm).display !== 'grid')
            && event.target === varList.taskProperties
            && event.target !== varList.taskUpdateForm
            && !(Array.from(varList.taskUpdateForm.children).includes(event.target))) {
      varList.taskUpdateForm.reset();
      varList.taskUpdateForm.style.display = 'none';
      varList.taskInputForm.style.display = 'grid';
      varList.taskProperties.style.display = 'none';
      varList.navContainer.style.removeProperty('opacity');
      varList.tasksBoard.style.removeProperty('opacity');
      event.stopPropagation();
    }
  }

  function updateDueDate(event) {
    varList.savedTasksArr = taskManager.savedTasksArr();
    const taskName = varList.taskName.innerText.toLowerCase();
    const projectName = varList.projectName.innerText.slice(0,
      (varList.projectName.innerText.indexOf('project')) - 1).toLowerCase();
    for (let i = 0; i <= varList.savedTasksArr.length - 1; i += 1) {
      if (varList.taskName.innerText.toLowerCase()
      === varList.savedTasksArr[i].taskTitle.toLowerCase()
                && (varList.savedTasksArr[i].projectsRelated.includes(projectName)
                    || (varList.savedTasksArr[i].projectsRelated.length === 1
                        && projectName === 'random'))) {
        const updatedTasks = varList.tasks();
        for (let j = 0; j < updatedTasks.length; j += 1) {
          if (updatedTasks[j].getAttribute('data-task') === taskName
                    && (updatedTasks[j].getAttribute('data-project') === projectName
                    || (updatedTasks[j].getAttribute('data-project') === ''
                    && projectName === 'random'))) {
            const timeLeft = updatedTasks[j].children[1].children[1];
            if (event.target.value !== '') {
              varList.savedTasksArr[i].dueDate = event.target.value;
              timeLeft.innerText = `${formatDistanceToNowStrict(new Date(varList.savedTasksArr[i].dueDate),
                { addSuffix: true })}`;
              tasksFromLS.updateData(varList.savedTasksArr);
              event.stopPropagation();
              break;
            } else {
              timeLeft.innerText = 'Unknown time left';
              varList.savedTasksArr[i].dueDate = event.target.value;
              tasksFromLS.updateData(varList.savedTasksArr);
              event.stopPropagation();
              break;
            }
          }
        }
      }
    }
  }

  function updateDescription(event) {
    varList.savedTasksArr = taskManager.savedTasksArr();
    const projectName = varList.projectName.innerText.slice(0,
      (varList.projectName.innerText.indexOf('project')) - 1).toLowerCase();
    for (let i = 0; i <= varList.savedTasksArr.length - 1; i += 1) {
      if (varList.taskName.innerText.toLowerCase()
      === varList.savedTasksArr[i].taskTitle.toLowerCase()
                && (varList.savedTasksArr[i].projectsRelated.includes(projectName.toLowerCase())
                    || (varList.savedTasksArr[i].projectsRelated.length === 1
                        && projectName === 'random'))) {
        varList.savedTasksArr[i].desc = event.target.value;
        break;
      }
    }
    tasksFromLS.updateData(varList.savedTasksArr);
  }

  return {
    displayActiveProjectTasks,
    updateProjectSelectOptions,
    openAddTaskPropertiesMenu,
    closeAddTaskPropertiesMenuOnBgClick,
    removeTaskFromTasksList,
    checkTaskIcon,
    uncheckTaskIcon,
    displayTaskProperties,
    addNewTaskToTasksList,
  };
})();

export default tasksBoardHandlers;
