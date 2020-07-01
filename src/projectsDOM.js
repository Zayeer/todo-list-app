/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-cycle */
import varList from './index';
import tasksBoardHandlers from './tasksDOM';
import projectManager from './projects';
import taskManager from './tasks';

const projectBoardHandlers = (() => {
  function openProjectsBoard() {
    varList.projectsBoard.classList.toggle('displayProjects');
    varList.mainContent.style.gridTemplateAreas = '"pb tb"';
    varList.projectsBoard.style.gridArea = 'pb';
    varList.mainContent.style.gridTemplateColumns = '1fr 2fr';
    varList.tasksBoard.style.width = '65vw';
    varList.tasksList.style.width = 'inherit';
    varList.tasksBoard.style.opacity = '0.5';
  }

  function closeProjectsBoard() {
    varList.projectsBoard.classList.toggle('displayProjects');
    varList.mainContent.style.gridTemplateAreas = '"tb"';
    varList.mainContent.style.gridTemplateColumns = '1fr';
    varList.mainContent.style.removeProperty('grid-gap');
    varList.tasksBoard.style.width = '100vw';
    varList.tasksBoard.style.removeProperty('opacity');
  }

  // eslint-disable-next-line consistent-return
  function activeProject() {
    const updatedProjects = varList.projects();
    for (let i = 0; i < updatedProjects.length; i += 1) {
      if (updatedProjects[i].classList.contains('active-project')) {
        return updatedProjects[i];
      }
    }
  }

  function addNewProjectToProjectsList(project) {
    if (project.length > 0
            && checkDuplicateProjects()) {
      const newProject = document.createElement('li');
      newProject.className = 'project';
      newProject.setAttribute('data-project', `${project.toLowerCase()}`);
      newProject.innerHTML = `${project} 
            <i class="fa fa-trash" data-project = ${project.toLowerCase()} aria-hidden="true">`;
      varList.projectsList.appendChild(newProject);
      projectManager.addProject();
      varList.projectInputForm.reset();
    }
  }

  function checkDuplicateProjects() {
    const updatedProjects = varList.projects();
    return !(updatedProjects.some((project) => project.innerText.toLowerCase()
    === varList.projectInput.value.toLowerCase()));
  }

  function projectsListEvents(event) {
    const { target } = event;
    const deleteProjectFromProjectsList = (() => {
      const deleteProjectIcons = varList.deleteProjectIcons();
      const updatedTasks = varList.tasks();
      const updatedProjects = varList.projects();
      for (let i = 0; i < deleteProjectIcons.length; i += 1) {
        if (target === deleteProjectIcons[i]) {
          for (let j = 0; j < updatedTasks.length; j += 1) {
            if (target.parentElement.getAttribute('data-project') === updatedTasks[i].getAttribute('data-project')) {
              updatedTasks[i].style.display = 'none';
              updatedTasks[i].remove();
            }
          }
          taskManager.removeTasksBasedOnProjectName(target.parentElement.getAttribute('data-project'));
          target.parentElement.style.display = 'none';
          target.parentElement.remove();
          projectManager.removeProject();
        }
      }
      event.stopPropagation();
    })();

    const makeProjectActive = (() => {
      const updatedProjects = varList.projects();
      for (let i = 0; i < updatedProjects.length; i += 1) {
        if (updatedProjects[i] === target) {
          activeProject().classList.remove('active-project');
          updatedProjects[i].classList.add('active-project');
          tasksBoardHandlers.displayActiveProjectTasks();
          return;
        }
      }
    })();
  }

  return {
    openProjectsBoard,
    closeProjectsBoard,
    addNewProjectToProjectsList,
    projectsListEvents,
    activeProject,
  };
})();

export default projectBoardHandlers;
