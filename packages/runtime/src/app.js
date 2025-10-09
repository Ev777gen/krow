/**
 * This is the first version of the framework.
 * 
 * The createApp() returns an object with two methods: mount() and unmount(). 
 * The mount() method takes a DOM element as a parameter and mounts the application in it. 
 * This object is the application instance inside which you implement the renderer and the state manager.
 * The unmount() method destroys the view and cleans up the subscriptions.
 * 
 * The createApp() function takes an object with three properties: state, view, and reducers.
 * The state property is the initial state of the application, and the view property is the
 * top-level component of the application.
 * 
 * You need two variables in the closure of the createApp() function: parentEl and vdom. 
 * These variables keep track of the DOM element where the application is
 * mounted and the virtual DOM tree of the previous view, respectively. 
 * Both should be initialized to null because the application hasn’t been mounted yet.
 * 
 * Then comes the renderer, which is implemented as a function: renderApp(). 
 * This function renders the view by destroying the current DOM tree (if one exists) 
 * and then mounting the new one. 
 * It takes a DOM element as a parameter and mounts the application in it. 
 * Note that you save the DOM element in the parentEl variable so that you can use it later to unmount the application.
 * 
 * A "reducers" parameter - is an object that maps command names to reducer functions
 * —functions that take the current state and the command’s payload and return a new state.
 * You subscribed the renderApp() function to be an after-command handler 
 * so that the application is re-rendered after every command is handled.
 * 
 * To allow components to dispatch commands more conveniently, you implemented an emit() function. 
 * So instead of writing dispatcher.dispatch(), you can write emit() inside the components, 
 * which is a bit more concise. Then you passed the emit() function to the components as a second argument.
 */

/**
 * - The framework’s first version is made of a renderer and a state manager wired together.
 * - The renderer first destroys the DOM (if it exists) and then creates it from scratch. 
 *   This process isn’t very efficient and creates problems with the focus of input fields, among other things.
 * - The state manager is in charge of keeping the state and view of the application in sync.
 * - The developer of an application maps the user interactions to commands, framed in the business language, 
 *   that are dispatched to the state manager.
 * - The commands are processed by the state manager, updating the state and notifying 
 *   the renderer that the DOM needs to be updated.
 * - The state manager uses a reducer function to derive the new state from the old state and the command’s payload.
 */

import { destroyDOM } from './destroy-dom'
import { Dispatcher } from './dispatcher'
import { mountDOM } from './mount-dom'

export function createApp({ state, view, reducers = {} }) {
  let parentEl = null
  let vdom = null

  const dispatcher = new Dispatcher()
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

  for (const actionName in reducers) {
    const reducer = reducers[actionName]

    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload)
    })

    subscriptions.push(subs)
  }

  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload)
  }

  function renderApp() {
    if (vdom) {
      destroyDOM(vdom)
    }

    vdom = view(state, emit)
    mountDOM(vdom, parentEl)
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl
      renderApp()
    },

    unmount() {
      destroyDOM(vdom)
      vdom = null
      subscriptions.forEach((unsubscribe) => unsubscribe())
    },
  }
}