export function withoutNulls(arr) {
  return arr.filter((item) => item !== null || item !== undefined)
}

/**
 * Простое сравнение
 * This is simple comparison: items are added or removed but never changed.
 * In the arraysDiff() function, you’re not specifying the index at
 * which an item was added or removed because to modify the classList of an element, 
 * you simply add or remove the classes. This approach might be problematic because,
 * as you know, the order of classes in the classList matters. 
 * A class that comes later in the list can override the styles of a class that comes earlier in the list. 
 * You’re making this tradeoff to keep the code simple, 
 * but bear in mind that a more robust solution is to maintain the order of classes in the classList.
 */
export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter((newItem) => !oldArray.includes(newItem)),
    removed: oldArray.filter((oldItem) => !newArray.includes(oldItem)),
  }
}

/**
 * Алгоритм сравнения двух массивов OLD и NEW, вычисляющий последовательность шагов, которые приведут из OLD к NEW
 * См. иллюстрацию №14 в папке /help/illustrations/14.***.png
 */

export const ARRAY_DIFF_OP = {
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop',
}

// Example:
// OLD = [A, B, C]
// NEW = [C, B, D]
// Последовательность операций будет такой:
// [
//   {op: 'remove', index: 0, item: 'A'}
//   {op: 'move', originalIndex: 2, from: 1, index: 0, item: 'C'}
//   {op: 'noop', index: 1, originalIndex: 1, item: 'B'}
//   {op: 'add', index: 2, item: 'D'}
// ]

// This class is used for keeping track of the old array’s original indices so that when you modify
// a copy of the old array and you apply each operation, you can keep the original indices. 
class ArrayWithOriginalIndices {
  #array = []
  #originalIndices = []
  #equalsFn

  constructor(array, equalsFn) {
    this.#array = [...array]
    this.#originalIndices = array.map((_, i) => i)
    this.#equalsFn = equalsFn
  }

  get length() {
    return this.#array.length
  }

  // removal case
  isRemoval(index, newArray) {
    if (index >= this.length) {
      return false
    }

    const item = this.#array[index]
    const indexInNewArray = newArray.findIndex((newItem) => this.#equalsFn(item, newItem))

    return indexInNewArray === -1
  }

  removeItem(index) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index],
    }

    this.#array.splice(index, 1)
    this.#originalIndices.splice(index, 1)

    return operation
  }

  // noop case
  isNoop(index, newArray) {
    if (index >= this.length) {
      return false
    }

    const item = this.#array[index]
    const newItem = newArray[index]

    return this.#equalsFn(item, newItem)
  }

  #getOriginalIndexAt(index) {
    return this.#originalIndices[index]
  }

  noopItem(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.#getOriginalIndexAt(index),
      index,
      item: this.#array[index],
    }
  }

  // addition case
  isAddition(item, fromIdx) {
    return this.#findIndexFrom(item, fromIdx) === -1
  }

  #findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i
      }
    }
    
    return -1
  }

  addItem(item, index) {
    const operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    }

    this.#array.splice(index, 0, item)
    this.#originalIndices.splice(index, 0, -1)

    return operation
  }

  // move case
  moveItem(item, toIndex) {
    const fromIndex = this.#findIndexFrom(item, toIndex)

    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.#getOriginalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex],
    }

    const [_item] = this.#array.splice(fromIndex, 1)
    this.#array.splice(toIndex, 0, _item)

    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1)
    this.#originalIndices.splice(toIndex, 0, originalIndex)
    
    return operation
  }

  // remove extra items
  removeItemsAfter(index) {
    const operations = []

    while (this.length > index) {
      operations.push(this.removeItem(index))
    }

    return operations
  }
}

export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b
) {
  const sequence = []
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn)

  for (let index = 0; index < newArray.length; index++) {
    // removal case
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index))
      index-- // Decrements the index to stay at the same index in the next iteration
      continue
    }

    // noop case
    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index))
      continue
    }

    // addition case
    const item = newArray[index]
    
    if (array.isAddition(item, index)) {
      sequence.push(array.addItem(item, index))
      continue
    }

    // move case
    sequence.push(array.moveItem(item, index))
  }

  // remove extra items
  sequence.push(...array.removeItemsAfter(newArray.length))
  
  return sequence
}
