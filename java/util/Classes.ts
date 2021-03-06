/// <reference path="Interfaces.d.ts"/>

namespace java.util {
  import FreezeAll = pjs.utils.FreezeAll

  @FreezeAll export abstract class AbstractCollection<E> implements Collection<E> {
     abstract iterator(): Iterator<E>
     abstract [Symbol.iterator](): Iterator<E>
  }
}
