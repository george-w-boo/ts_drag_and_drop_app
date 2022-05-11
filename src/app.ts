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
// end of autobind decorator

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

    this.inputTitleEl = this.formEl.querySelector('#title')! as HTMLInputElement;

    this.inputDescriptionEl = this.formEl.querySelector(
      "#description"
    ) as HTMLTextAreaElement;
    this.inputPeopleEl = this.formEl.querySelector("#people") as HTMLInputElement;

    this.attach();
    this.configure();

    console.log('this.inputTitleEl', document.getElementById('title'));
  }

  private clearInputs() {
    this.inputTitleEl.value = "";
    this.inputDescriptionEl.value = "";
    this.inputPeopleEl.value = "";
  }

  private gatherUserInput(): [string, string, number] | void {
    console.log('ssdfs');
    const title = this.inputTitleEl.value;
    const description = this.inputDescriptionEl.value;
    const peopleAmount = this.inputPeopleEl.value;

    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      peopleAmount.trim().length === 0
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
    console.log('submitted');

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

new ProjectInput();
