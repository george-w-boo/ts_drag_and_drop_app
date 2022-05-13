// autobind decorator: binds a method to current class
export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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
