import { Component } from '../components/base-component.js';
import { Dropable} from '../models/drag-drop.js';
import { Project, ProjectStatus } from '../models/project.js';
import { autobind } from '../decorators/autobind.js';
import { prjState } from '../state/project-state.js';
import { ProjectListItem } from './project-list-item.js';

// Project List section
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Dropable
{
  private assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      this.element.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    prjState.updateProjectStatus(
      event.dataTransfer!.getData("text/plain"),
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    this.element.classList.remove("droppable");
  }

  configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    prjState.addListener((projects: Project[]) => {
      const relaventProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }

        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relaventProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      `${this.type} projects`.toUpperCase();
  }

  private renderProjects() {
    const list = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    list.innerHTML = "";

    for (const assignedProject of this.assignedProjects) {
      new ProjectListItem(
        this.element.querySelector("ul")!.id,
        assignedProject
      );
    }
  }
}
