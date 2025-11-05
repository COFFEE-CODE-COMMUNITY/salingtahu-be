import {
  createMap as createAutoMap,
  Dictionary,
  forMember,
  ignore,
  Mapper,
  Mapping,
  MappingConfiguration
} from "@automapper/core"
import { getWriteOnlyProperties } from "./writeonly.decorator"
import { getReadOnlyProperties } from "./readonly.decorator"

export function createMap<S, D>(
  mapper: Mapper,
  source: new (...args: any[]) => S,
  destination: new (...args: any[]) => D,
  ...configurations: Array<MappingConfiguration<Dictionary<S>, Dictionary<D>>>
): Mapping<Dictionary<S>, Dictionary<D>> {
  const sourceWriteOnly = getWriteOnlyProperties(source)
  const destinationReadonly = getReadOnlyProperties(destination)

  const ignores: Array<MappingConfiguration<Dictionary<S>, Dictionary<D>>> = [
    ...sourceWriteOnly.map(property => forMember(property as any, ignore())),
    ...destinationReadonly.map(property => forMember(property as any, ignore()))
  ]

  return createAutoMap(mapper, source, destination, ...ignores, ...configurations)
}
