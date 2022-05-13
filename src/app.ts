// project item
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

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

const prjState = ProjectState.getInstance();

// autobind decorator: binds a method to current class
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const adjMethod = originalMethod.bind(this);

      return adjMethod;
    },
  };

  return adjDescriptor;
}
// validation
interface Validatable {
  value: number | string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(objToValidate: Validatable): boolean {
  let isValid = true;

  if (objToValidate.required) {
    isValid = isValid && objToValidate.value.toString().length > 0;
  }

  if (
    objToValidate.minLength != null &&
    typeof objToValidate.value === "string"
  ) {
    isValid = isValid && objToValidate.value.length >= objToValidate.minLength;
  }

  if (
    objToValidate.maxLength != null &&
    typeof objToValidate.value === "string"
  ) {
    isValid = isValid && objToValidate.value.length <= objToValidate.maxLength;
  }

  if (objToValidate.min != null && typeof objToValidate.value === "number") {
    isValid = isValid && objToValidate.value >= objToValidate.min;
  }

  if (objToValidate.max != null && typeof objToValidate.value === "number") {
    isValid = isValid && objToValidate.value <= objToValidate.max;
  }

  return isValid;
}
// end of validation

// component base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  private templateEl: HTMLTemplateElement;
  private hostEl: T;
  protected element: U;

  constructor(
    public templateId: string,
    public hostElId: string,
    public afterBegin: boolean,
    public newElId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    ) as HTMLTemplateElement;

    this.hostEl = document.getElementById(hostElId)! as T;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as U;

    if (newElId) {
      this.element.id = newElId;
    }

    this.attach(afterBegin);
  }

  private attach(afterBegin: boolean) {
    this.hostEl.insertAdjacentElement(
      afterBegin ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

interface Dragable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface Dropable {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// project list item
class ProjectListItem
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

// Project List section
class ProjectList
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

// User input form
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  private inputTitleEl: HTMLInputElement;
  private inputDescriptionEl: HTMLTextAreaElement;
  private inputPeopleEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.inputTitleEl = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;

    this.inputDescriptionEl = this.element.querySelector(
      "#description"
    ) as HTMLTextAreaElement;
    this.inputPeopleEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  renderContent(): void {}

  configure() {
    this.element.addEventListener("submit", this.handleSubmit);
  }

  private clearInputs() {
    this.inputTitleEl.value = "";
    this.inputDescriptionEl.value = "";
    this.inputPeopleEl.value = "";
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.inputTitleEl.value.trim();
    const description = this.inputDescriptionEl.value.trim();
    const peopleAmount = +this.inputPeopleEl.value.trim();

    const titleValidationConfig: Validatable = {
      value: title,
      required: true,
    };

    const descriptionValidationConfig: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };

    const peopleValidationConfig: Validatable = {
      value: peopleAmount,
      required: true,
      min: 1,
    };

    if (
      !validate(titleValidationConfig) ||
      !validate(descriptionValidationConfig) ||
      !validate(peopleValidationConfig)
    ) {
      alert(
        "An invalit input filed. Please, make sure all the fields are not empty"
      );
      return;
    }

    return [title, description, +peopleAmount];
  }

  @autobind
  private handleSubmit(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput();
    console.log("userInput", userInput);

    if (Array.isArray(userInput)) {
      prjState.addProject(...userInput);

      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activeProjectsList = new ProjectList("active");
const finishedProjectsList = new ProjectList("finished");
