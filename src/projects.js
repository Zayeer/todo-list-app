/* eslint-disable linebreak-style */
/* eslint-disable import/no-cycle */
import varList from './index';
import { projectsFromLS } from './storage';

const projectManager = (() => {
  function addProject() {
    const savedProjectsArr = varList.savedProjectsArr();
    projectsFromLS.updateData(savedProjectsArr);
  }

  function removeProject() {
    const savedProjectsArr = varList.savedProjectsArr();
    if (savedProjectsArr.length > 3) {
      projectsFromLS.updateData(savedProjectsArr);
    } else {
      projectsFromLS.removeData(savedProjectsArr);
    }
  }

  return {
    addProject,
    removeProject,
  };
})();

export default projectManager;
