class ProjectInput {
  private templateEl: HTMLTemplateElement;
  private hostEl: HTMLDivElement;
  private formEl: HTMLFormElement;

  private inputTitleEl: HTMLInputElement;
  private inputDescriptionEl: HTMLTextAreaElement;
  private inputPeopleEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById('project-input') as HTMLTemplateElement;
    this.hostEl = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.formEl = importedNode.firstElementChild as HTMLFormElement;
    this.formEl.id = 'user-input';

    this.inputTitleEl = document.querySelector('#title') as HTMLInputElement;
    this.inputDescriptionEl = document.querySelector('#description') as HTMLTextAreaElement;
    this.inputPeopleEl = document.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private handleSubmit(event: Event) {
    event.preventDefault();

    console.log('ADD PROJECT clicked', this.formEl);
    console.log('titleEl', this.inputTitleEl);
    console.log('descriptionEl', this.inputDescriptionEl);
    console.log('peopleEl', this.inputPeopleEl);
  }

  private configure() {
    this.formEl.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }
}

new ProjectInput();