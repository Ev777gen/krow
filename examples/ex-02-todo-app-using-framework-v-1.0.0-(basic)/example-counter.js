import { createApp, h, hText } from "../../packages/runtime/dist/krowmare.js"

// Example 1. Counter-button
createApp({
  state: 0,

  reducers: {
    add: (state, amount) => state + amount,
  },

  view: (state, emit) =>
    h(
      'button',
      { on: { click: () => emit('add', 1) } },
      [hText(state)]
    ),
}).mount(document.body)


// Example 2. Counter with two buttons +/-
createApp({
  state: 0,

  reducers: {
    add: (state, amount) => state + amount,
    subtract: (state, amount) => state - amount,
  },

  view: (state, emit) =>
    h(
      'div',
      {},
      [
        h(
          'button',
          { on: { click: () => emit('add', 1) } },
          [hText('+')]
        ),
        h(
          'span',
          {},
          [hText(state)]
        ),
        h(
          'button',
          { on: { click: () => emit('subtract', 1) } },
          [hText('-')]
        ),
      ],
    ),
}).mount(document.body)
