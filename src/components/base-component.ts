// component base class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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