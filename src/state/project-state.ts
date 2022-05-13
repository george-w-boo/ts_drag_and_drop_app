import { Project, ProjectStatus } from "../models/project.js";

// app state
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listnerFn: Listener<T>) {
    this.listeners.push(listnerFn);
  }
}

class ProjectState extends State<Project> {
  private static instance: ProjectState;
  private projects: Project[] = [];

  private constructor() {
    super();
    this.projects = [];
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject: Project = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  updateProjectStatus(prjId: string, newStatus: ProjectStatus) {
    const prjToUpdate = this.projects.find((prj) => prj.id === prjId);

    if (prjToUpdate && prjToUpdate.status !== newStatus) {
      prjToUpdate.status = newStatus;
      this.updateListeners();
    }
  }

  updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const prjState = ProjectState.getInstance();
