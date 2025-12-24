import { createApp, h, hFragment } from "../../packages/runtime/dist/krow.js"

function createGrid(rows, columns) {
  return Array(rows).fill(undefined).map((_) => {
    return Array(columns).fill(null)
  })
}

const state = {
  field: createGrid(3, 3),
  isX: true,
}

const reducers = {
  'make-move': (state, { row, column }) => {
    const figure = state.isX ? 'X' : 'O'
    state.field[row][column] = figure
    state.isX = !state.isX
    
    return state
  }
}

function App(state, emit) {
  return hFragment([
    h('h1', {}, ['Tic Tac Toe']),
    GameField(state, emit),
  ])
}

function GameField(state, emit) {
  return h(
    'table',
    {
      on: {
        click: (evt) => {
          if (evt.target.cellValue === null)
            emit('make-move', { row: evt.target.rowIndex, column: evt.target.columnIndex })
        },
      },
    }, 
    [
      ...state.field.map((rowData, rowIndex) => {
        return h('tr', {}, [
          ...rowData.map((columnData, columnIndex) => {
            return h(
              'td',
              {
                rowIndex,
                columnIndex,
                cellValue: columnData,
              },
              [columnData === null ? ' ' : columnData],
            )
          })
        ])
      })
    ])
}

createApp({ state, reducers, view: App }).mount(document.body)
