export function addEventListener(eventName, handler, el, hostComponent = null) {
  function boundHandler(...args) {
    hostComponent
      ? handler.apply(hostComponent, args)
      : handler(...args)
  }
  el.addEventListener(eventName, boundHandler)
    
  return boundHandler
}

export function addEventListeners(listeners = {}, el, hostComponent = null) {
  const addedListeners = {}

  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el, hostComponent)
    addedListeners[eventName] = listener
  })

  return addedListeners
}

export function removeEventListeners(listeners = {}, el) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    removeEventListener(eventName, handler, el)
  })
}
