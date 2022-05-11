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

// Project List section
class ProjectList {
  private templateEl: HTMLTemplateElement;
  private hostEl: HTMLDivElement;
  private sectionEl: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateEl = document.getElementById(
      "project-list"
    ) as HTMLTemplateElement;

    this.hostEl = document.getElementById("app") as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.sectionEl = importedNode.firstElementChild as HTMLElement;
    this.sectionEl.id = `${this.type}-projects`;

    this.attach();
    this.populate();
  }

  private populate() {
    const listId = `${this.type}-projects-list`;
    this.sectionEl.querySelector("ul")!.id = listId;
    this.sectionEl.querySelector("h2")!.textContent =
      `${this.type} projects`.toUpperCase();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.sectionEl);
  }
}

// User input form
class ProjectInput {
  private templateEl: HTMLTemplateElement;
  private hostEl: HTMLDivElement;
  private formEl: HTMLFormElement;

  private inputTitleEl: HTMLInputElement;
  private inputDescriptionEl: HTMLTextAreaElement;
  private inputPeopleEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;

    this.hostEl = document.getElementById("app") as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.formEl = importedNode.firstElementChild as HTMLFormElement;
    this.formEl.id = "user-input";

    this.inputTitleEl = this.formEl.querySelector(
      "#title"
    )! as HTMLInputElement;

    this.inputDescriptionEl = this.formEl.querySelector(
      "#description"
    ) as HTMLTextAreaElement;
    this.inputPeopleEl = this.formEl.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.attach();
    this.configure();
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

    this.clearInputs();
  }

  private configure() {
    this.formEl.addEventListener("submit", this.handleSubmit);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }
}

const prjInput = new ProjectInput();
const activeProjectsList = new ProjectList("active");
const finishedProjectsList = new ProjectList("finished");
