import { h, hFragment, defineComponent } from "../../packages/runtime/dist/krowmare.js"

const Counter = defineComponent({
  state() {
    return { count: 0 }
  },

  render() {
    return hFragment([
      h('p', {}, [`Count: ${this.state.count}`]),
      h(
        'button',
        {
          on: {
            click: () => {
              this.updateState({ count: this.state.count + 1 })
            },
          },
        },
        ['Increment'],
      ),
    ])
  },
})

const counter = new Counter()

counter.mount(document.body)
