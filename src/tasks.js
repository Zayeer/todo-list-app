/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-cycle */
import varList from './index';
import { tasksFromLS } from './storage';

class Task {
  constructor(taskTitle, projectsRelated, priority, dueDate, desc, checked) {
    this.taskTitle = taskTitle;
    this.projectsRelated = projectsRelated;
    this.priority = priority;
    this.dueDate = dueDate;
    this.desc = desc;
    this.checked = checked;
  }
}

const taskManager = (() => {
  function savedTasksArr() {
    const storedTasks = JSON.parse(tasksFromLS.accessData('savedTasksArr'));
    if (storedTasks) {
      varList.savedTasksArr = [...storedTasks];
      return varList.savedTasksArr;
    }
    return [];
  }

  function addTask(taskTitle, project, priority, dueDate, desc, checked) {
    varList.savedTasksArr = savedTasksArr();
    if (!duplicateTasks(taskTitle, project)) {
      const projectsRelated = ['all tasks'];
      if (project) {
        projectsRelated.push(project.toLowerCase());
      }
      const newTask = new Task(taskTitle, projectsRelated, priority, dueDate, desc, checked);
      varList.savedTasksArr.push(newTask);
      tasksFromLS.updateData(varList.savedTasksArr);
    }
  }

  function duplicateTasks(title, project) {
    varList.savedTasksArr = savedTasksArr();
    if (varList.savedTasksArr.length > 0) {
      varList.savedTasksArr.some((task) => task.taskTitle === title
                && (task.projectsRelated.includes(project)
                || (project === '' && task.projectsRelated.length === 1)));
    } else {
      return false;
    }
  }

  function checkOrUncheck(task, project, checkVal) {
    varList.savedTasksArr = savedTasksArr();
    for (let i = 0; i < varList.savedTasksArr.length; i += 1) {
      if (task === varList.savedTasksArr[i].taskTitle
                && ((project === '' && varList.savedTasksArr[i].projectsRelated.length === 1)
                || (varList.savedTasksArr[i].projectsRelated.includes(project)))) {
        varList.savedTasksArr[i].checked = checkVal;
        tasksFromLS.updateData(varList.savedTasksArr);
      }
    }
  }

  function removeTask(taskName, projectName) {
    varList.savedTasksArr = savedTasksArr();
    for (let i = 0; i < varList.savedTasksArr.length; i += 1) {
      if (varList.savedTasksArr[i].taskTitle === taskName
                && (varList.savedTasksArr[i].projectsRelated.includes(projectName.toLowerCase())
                || varList.savedTasksArr[i].projectsRelated.length === 1)) {
        varList.savedTasksArr.splice(i, 1);
        break;
      }
    }
    if (varList.savedTasksArr.length > 0) {
      tasksFromLS.updateData(varList.savedTasksArr);
    } else {
      tasksFromLS.removeData(varList.savedTasksArr);
    }
  }

  function removeTasksBasedOnProjectName(projectName) {
    varList.savedTasksArr = savedTasksArr();
    if (varList.savedTasksArr.length > 0) {
      const duplicateSavedTasksArr = [...varList.savedTasksArr];
      for (let i = 0; i < duplicateSavedTasksArr.length; i += 1) {
        if (varList.savedTasksArr[i].projectsRelated.includes(projectName.toLowerCase())) {
          varList.savedTasksArr.splice(i, 1);
        }
      }
      if (varList.savedTasksArr.length > 0) {
        tasksFromLS.updateData(varList.savedTasksArr);
      } else {
        tasksFromLS.removeData(varList.savedTasksArr);
      }
    }
  }

  return {
    addTask, removeTask, removeTasksBasedOnProjectName, savedTasksArr, checkOrUncheck,
  };
})();

export default taskManager;
