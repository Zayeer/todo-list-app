class DataStore {
    constructor(itemRef) {
        this.itemRef = itemRef;
    }

    updateData(item) {
        localStorage.setItem(this.itemRef, JSON.stringify(item));
    }

    accessData() {
        return localStorage.getItem(this.itemRef);
    }

    removeData() {
        localStorage.removeItem(this.itemRef);
    }
}

export const tasksFromLS = new DataStore("savedTasksArr");

export const projectsFromLS = new DataStore("savedProjectsArr");

