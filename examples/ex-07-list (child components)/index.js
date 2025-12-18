import { h, hFragment, defineComponent } from "../../packages/runtime/dist/krowmare.js"

const List = defineComponent({
  render() {
    const { items } = this.props

    return hFragment([
      h('h1', {}, ['List of items']),
      h('ul', {}, items.map(item => h(ListItem, { item })))
    ])
  },
})

const ListItem = defineComponent({
  render() {
    const { item } = this.props
    return h('li', {}, [item])
  },
})

const items = ['foo', 'bar', 'baz']
const list = new List({ items })

list.mount(document.body)
