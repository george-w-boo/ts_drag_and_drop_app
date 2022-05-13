export interface Validatable {
  value: number | string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(objToValidate: Validatable): boolean {
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
