const READ_ONLY_KEY = Symbol("READ_ONLY_KEY")

export function ReadOnly(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const existingReadonly: ReadOnlyProperties = Reflect.getMetadata(READ_ONLY_KEY, target, propertyKey) || []
    Reflect.defineMetadata(READ_ONLY_KEY, [...existingReadonly, propertyKey], target, propertyKey)
  }
}

export function getReadOnlyProperties(target: object): ReadOnlyProperties {
  return Reflect.getMetadata(READ_ONLY_KEY, target) || []
}

export type ReadOnlyProperties = Array<string | symbol>
