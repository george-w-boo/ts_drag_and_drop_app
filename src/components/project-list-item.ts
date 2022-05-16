import { Component } from '../components/base-component';
import { Dragable} from '../models/drag-drop';
import { Project } from '../models/project';
import { autobind } from '../decorators/autobind';

// project list item
export class ProjectListItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Dragable
{
  get personPeople() {
    if (this.project.people === 1) {
      return "1 person";
    }

    return `${this.project.people} people`;
  }

  constructor(hostId: string, private project: Project) {
    super("single-project", hostId, false, project.id);

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    console.log("dragging started", event);
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(event: DragEvent): void {
    console.log("dragging ended", event);
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent =
      this.personPeople + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
