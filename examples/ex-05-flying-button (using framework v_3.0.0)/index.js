import { h, hFragment, defineComponent } from "../../packages/runtime/dist/krowmare.js"

function getViewportDimentions() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }
}

function calcRandomPosition() {
  const { width, height } = getViewportDimentions()
  // TODO: учесть прокрутку окна
  return {
    x: Math.floor(height * Math.random()),
    y: Math.floor(width * Math.random()),
  }
}

const FlyingButton = defineComponent({
  state() {
    return { position: { ...calcRandomPosition() } }
  },

  render() {
    return hFragment([
      h(
        'button',
        {
          style: {
            position: 'absolute',
            top: `${this.state.position.x}px`,
            left: `${this.state.position.y}px`,
          },
          on: {
            click: () => {
              this.updateState({ position: { ...calcRandomPosition() } })
            },
          },
        },
        ['Flying Button'],
      ),
    ])
  },
})

const button = new FlyingButton()

button.mount(document.body)
