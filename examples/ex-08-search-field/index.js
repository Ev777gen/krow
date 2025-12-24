import { h, hFragment, defineComponent } from "../../packages/runtime/dist/krow.js"

const SearchField = defineComponent({
  state() {
    return {}
  },
  
  render() {
    return hFragment([
      h('h1', {}, ['Search Field']),
      h(
        InputField,
        {
          on: {
            'input-data': (data) => console.log(data),
          }
        }
      ),
    ])
  },
})

const InputField = defineComponent({
  render() {
    return h(
      'input',
      { 
        on: {
          input: (data) => this.emit('input-data', data),
        },
      },
    )
  },
})

const searchField = new SearchField()

searchField.mount(document.body)
