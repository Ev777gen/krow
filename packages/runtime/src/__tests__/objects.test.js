import { expect, test } from 'vitest'
import { objectsDiff } from '../utils/objects'

test('no diffrences', () => {
  const oldObj = { foo: 'bar' }
  const newObj = { foo: 'bar' }
  const expectedResult = { added: [], removed: [], updated: [] }

  expect(objectsDiff(oldObj, newObj)).toEqual(expectedResult)
})

test('added', () => {
  const oldObj = { foo: 'bar' }
  const newObj = { foo: 'bar', newProp: 1 }
  const expectedResult = { added: ['newProp'], removed: [], updated: [] }

  expect(objectsDiff(oldObj, newObj)).toEqual(expectedResult)
})

test('removed', () => {
  const oldObj = { foo: 'bar', removedProp: 1 }
  const newObj = { foo: 'bar' }
  const expectedResult = { added: [], removed: ['removedProp'], updated: [] }

  expect(objectsDiff(oldObj, newObj)).toEqual(expectedResult)
})

test('updated', () => {
  const oldObj = { foo: 'bar' }
  const newObj = { foo: 'bazz' }
  const expectedResult = { added: [], removed: [], updated: ['foo'] }

  expect(objectsDiff(oldObj, newObj)).toEqual(expectedResult)
})

