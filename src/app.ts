class ProjectInput {
  private templateEl: HTMLTemplateElement;
  private hostEl: HTMLDivElement;
  private templateContent: HTMLFormElement;

  constructor() {
    this.templateEl = document.getElementById('project-input') as HTMLTemplateElement;
    this.hostEl = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.templateContent = importedNode.firstElementChild as HTMLFormElement;

    this.attach();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.templateContent);
  }
}

new ProjectInput();