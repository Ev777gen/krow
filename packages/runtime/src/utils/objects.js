export function objectsDiff(oldObj, newObj) {
  const oldKeys = Object.keys(oldObj)
  const newKeys = Object.keys(newObj)
  
  return {
    added: newKeys.filter((key) => !(key in oldObj)),
    removed: oldKeys.filter((key) => !(key in newObj)),
    updated: newKeys.filter((key) => key in oldObj && oldObj[key] !== newObj[key]),
  }
}

// More optimized version:
export function objectsDiffOptimized(oldObj, newObj) {
  const oldKeys = Object.keys(oldObj)
  const newKeys = Object.keys(newObj)

  const differences = newKeys.reduce((acc, key) => {
    if (!(key in oldObj)) {
      acc.added.push(key)
    }
    else if (key in oldObj && oldObj[key] !== newObj[key]) {
      acc.updated.push(key)
    }
    return acc
  }, { added: [], removed: [], updated: [] })

  const hasRemovedProperties = oldKeys.length > newKeys.length - differences.added.length
  if (hasRemovedProperties) {
    differences.removed = oldKeys.filter((key) => !(key in newObj))
  }

  return differences
}

// // Performance test:
// function measurePerformance(f, ...args) {
//   const start = performance.now()
//   f(...args)
//   const end = performance.now()
//   return end - start
// }

// const heavyObj = (() => {
//   const obj = {}
//   for (let i = 0; i < 10000; i++) {
//     obj[i] = i
//   }
//   return obj
// })()

// const oldObj = Object.assign(heavyObj, { foo: 'bar', removedProp: 1, updatedProp: 'Ddddd' })
// const newObj = Object.assign(heavyObj, { foo: 'bar', addedProp: 1, updatedProp: 'Ffffff' })

// console.log('simple', measurePerformance(objectsDiff, oldObj, newObj))
// console.log('optimized', measurePerformance(objectsDiffOptimized, oldObj, newObj))

// // С удалением свойств
// // simple     1.599999999627471
// // optimized  0.7000000011175871

// // Без удаления свойств
// // simple 1
// // optimized 0.5