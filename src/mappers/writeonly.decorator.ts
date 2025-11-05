const WRITE_ONLY_KEY = Symbol("WRITE_ONLY_KEY")

export function WriteOnly(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const existingWriteonly: WriteOnlyProperties = Reflect.getMetadata(WRITE_ONLY_KEY, target, propertyKey) || []
    Reflect.defineMetadata(WRITE_ONLY_KEY, [...existingWriteonly, propertyKey], target, propertyKey)
  }
}

export function getWriteOnlyProperties(target: object): WriteOnlyProperties {
  return Reflect.getMetadata(WRITE_ONLY_KEY, target) || []
}

export type WriteOnlyProperties = Array<string | symbol>
