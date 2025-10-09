/**
 * The Dispatcher is a class with a private variable called subs (short for subscriptions): a
 * JavaScript map to store the registered handlers by event name.
 * Note that more than one handler can be registered for the same command name.
 * 
 * The state manager is in charge of keeping the state in sync with the views. 
 * It does so by notifying the renderer about state changes so that the renderer can update the views accordingly. 
 * The state can change only in response to commands. 
 * A command triggers the execution of one or more handler functions, which execute reducers, 
 * which in turn update the state. Therefore, the best time to notify the renderer about 
 * state changes is after the handlers for a given command have been executed. 
 * You should allow the dispatcher to register special handler functions 
 * (we’ll call them after-command handlers) that are executed after the handlers for any dispatched command
 * have been executed. The framework uses these handlers to notify the renderer about
 * potential state changes so that it can update the view.
 */

export class Dispatcher {
  #subs = new Map()
  #afterHandlers = []

  subscribe(commandName, handler) {
    // Creates the array of subscriptions if it doesn’t exist for a given command name
    if (!this.#subs.has(commandName)) {
      this.#subs.set(commandName, [])
    }

    // Checks whether the handler is already registered:
    // If the handler was already registered, you simply return a function that does nothing 
    // because there’s nothing to unregister.
    // We are returning an empty function because it prevents the side effects 
    // that result when a developer inadvertently calls the returned function twice
    // —once for each time they called subscribe() using the same handler. 
    // In this case, when the same handler is unregistered for the second time, 
    // indexOf() returns -1 because the handler isn’t in the array anymore.
    // Then the splice() function is called with an index of -1, which removes the 
    // last handler in the array—not what you want. This is a silent failure. 
    const handlers = this.#subs.get(commandName)
    if (handlers.includes(handler)) {
      return () => {}
    }

    // Registers the handler
    handlers.push(handler)
    
    // Returns a function to unregister the handler (later in the future)
    return () => {
      const idx = handlers.indexOf(handler)
      handlers.splice(idx, 1)
    }
  }

  afterEveryCommand(handler) {
    this.#afterHandlers.push(handler)
    
    return () => {
      const idx = this.#afterHandlers.indexOf(handler)
      this.#afterHandlers.splice(idx, 1)
    }
  }

  dispatch(commandName, payload) {
    if (this.#subs.has(commandName)) {
      this.#subs.get(commandName).forEach((handler) => handler(payload))
    } else {
      console.warn(`No handlers for command: ${commandName}`)
    }
    
    this.#afterHandlers.forEach((handler) => handler())
  }
}
