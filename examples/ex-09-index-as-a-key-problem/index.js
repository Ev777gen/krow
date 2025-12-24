import { h, hText, defineComponent } from "../../packages/runtime/dist/krow.js"

const MyCounter = defineComponent({
  state() {
    return { 
      count: 0 
    }
  },
  
  render() {
    const { count } = this.state

    return h('div', {}, [
      h('span', {}, [hText(count)]),
      h(
        'button',
        {
          on: {
            click: () => this.updateState({ count: count + 1 }),
          },
        },
        ['Add']
      ),
      h(
        'button',
        {
          on: {
            click: () => this.emit('remove'),
          },
        },
        ['Remove']
      ),
    ])
  },
})

const App = defineComponent({
  state() {
    return {
      counters: 3,
    }
  },

  render() {
    const { counters } = this.state

    return h(
      'div',
      {},
      Array(counters)
      .fill()
      .map((_, index) => {
        return h(MyCounter, {
          key: index,
          on: {
            remove: () => {
              this.updateState({ counters: counters - 1 })
            },
          },
        })
      })
    )
  }
})

const app = new App()

app.mount(document.body)
