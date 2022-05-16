import { Component } from './base-component';
import * as Validation from '../utils/validation';
import { autobind } from '../decorators/autobind';
import { prjState } from '../state/project-state';

// User input form
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    const titleValidationConfig: Validation.Validatable = {
      value: title,
      required: true,
    };

    const descriptionValidationConfig: Validation.Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };

    const peopleValidationConfig: Validation.Validatable = {
      value: peopleAmount,
      required: true,
      min: 1,
    };

    if (
      !Validation.validate(titleValidationConfig) ||
      !Validation.validate(descriptionValidationConfig) ||
      !Validation.validate(peopleValidationConfig)
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
