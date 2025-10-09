/**
 * When the mountDOM() function creates each DOM node for the virtual DOM, it needs
 * to save a reference to the real DOM node in the virtual node under the el property.
 * Similarly, if the node includes event listeners, the mountDOM() function saves a reference
 * to the event listener in the virtual node under the listeners property.
 * Saving these references has a double purpose: it allows the framework to remove the
 * event listeners and detach the element from the DOM when the virtual node is
 * unmounted, and the reconciliation algorithm requires it to know what element in the
 * DOM needs to be updated.
 */

import { DOM_TYPES } from './h'
import { setAttributes } from './attributes'
import { addEventListeners } from './events'

export function mountDOM(vdom, parentEl) {
  switch (vdom.type) {
    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl)
      break
    }

    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl)
      break
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl)
      break
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}

/**
 * Virtual DOM elements have the following structure:
 * {
 *   type: DOM_TYPES.ELEMENT,
 *   tag: 'button',
 *   props: { class: 'btn', on: { click: () => console.log('yay!') } },
 *   children: [{ type: DOM_TYPES.TEXT, value: 'Click me!' }, ... ]
 * }
 * To create the corresponding DOM element from the virtual node, you need to do the following:
 *   1 Create the element node using the document.createElement() function.
 *   2 Add the attributes and event listeners to the element node, saving the added
 *     event listeners in a new property of the virtual node called listeners.
 *   3 Save a reference to the element node in the virtual node under the el property.
 *   4 Mount the children recursively into the element node.
 *   5 Append the element node to the parent element.
 * Two special cases that are related to styling also need special handling: style and class. 
 * You’ll extract them from the props object and handle them separately.
 */
function createElementNode(vdom, parentEl) {
  const { tag, props, children } = vdom

  const element = document.createElement(tag)
  addProps(element, props, vdom)
  vdom.el = element

  children.forEach((child) => mountDOM(child, element))
  parentEl.append(element)
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props
  
  vdom.listeners = addEventListeners(events, el)
  setAttributes(el, attrs)
}

/**
 * Text nodes have the following structure:
 * { type: DOM_TYPES.TEXT, value: 'I need more coffee' }
 * After creating the text DOM node, you have to do two things:
 *   1 Save a reference to the real DOM node in the virtual node under the el property.
 *   2 Attach the text node to the parent element.
 */
function createTextNode(vdom, parentEl) {
  const { value } = vdom
  
  const textNode = document.createTextNode(value)
  vdom.el = textNode
  
  parentEl.append(textNode)
}

/**
 * Fragments are an array of children. They aren’t get attached to the DOM. Only the children are.
 * All the el references of those fragment virtual nodes should point to the same parent element.
 */
function createFragmentNodes(vdom, parentEl) {
  const { children } = vdom
  vdom.el = parentEl

  children.forEach((child) => mountDOM(child, parentEl))
}
