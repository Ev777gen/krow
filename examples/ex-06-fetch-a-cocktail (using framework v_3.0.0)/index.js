import { h, hFragment, defineComponent } from "../../packages/runtime/dist/krow.js"

const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'

async function getRandomCocktail() {
  return fetch(url)
    .then(res => res.json())
    .then(json => json.drinks.at(0))
}

const RandomCocktail = defineComponent({
  state() {
    return { 
      cocktail: null,
      isLoading: false,
    }
  },

  render() {
    const { cocktail, isLoading } = this.state

    if (isLoading) {
      return hFragment([
        h('h1', {}, ['Random cocktail']),
        h('p', {}, ['Loading...'])
      ])
    }

    if (!cocktail) {
      return hFragment([
        h('h1', {}, ['Random cocktail']),
        h(
          'button',
          {
            on: {
              click: () => this.fetchCocktail(),
            },
          },
          ['Get a cocktail'],
        )
      ])
    }
    else {
      return hFragment([
        h('h1', {}, [cocktail.strDrink]),
        h('p', {}, [cocktail.strInstructions]),
        h('img', { src: cocktail.strDrinkThumb, alt: cocktail.strDrink }),
        h(
          'button',
          {
            on: {
              click: () => this.fetchCocktail(),
            },
          },
          ['Get another cocktail'],
        ),
      ])
    }
  },

  async fetchCocktail() {
    this.updateState({ isLoading: true, cocktail: null })

    const cocktail = await getRandomCocktail()
    this.updateState({ isLoading: false, cocktail })
  }
})

const cocktail = new RandomCocktail()

cocktail.mount(document.body)
