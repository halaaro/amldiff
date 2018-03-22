const { itemsMatch } = require('../diff.js')

test('itemsMatch returns false if items have diferent type', () => {
  expect(
    itemsMatch(
      { _attr: { type: 'type1', id: 1 } },
      { _attr: { type: 'type2', id: 1 } }
    )
  ).toEqual(false)
})

test('itemsMatch returns true if have same id', () => {
  expect(itemsMatch({ _attr: { id: 1 } }, { _attr: { id: 1 } })).toEqual(true)
})


test('itemsMatch returns false if have same id and different action', () => {
  expect(itemsMatch({ _attr: { id: 1, action: 'add'} }, { _attr: { id: 1, action: 'edit'} })).toEqual(false)
})

test('itemsMatch returns true if have same where', () => {
  expect(
    itemsMatch({ _attr: { where: '1' } }, { _attr: { where: '1' } })
  ).toEqual(true)
})

test('itemsMatch returns true if have related_id has same text', () => {
  expect(
    itemsMatch(
      {
        _attr: {},
        related_id: {
          _text: "123"
        }
      },
      {
        _attr: {},
        related_id: {
          _text: "123"
        }
      }
    )
  ).toEqual(true)
})


test('itemsMatch returns true if have related_id items have same id', () => {
  expect(
    itemsMatch(
      {
        _attr: {},
        related_id: {
          Item: { _attr: { id: 1 } }
        }
      },
      {
        _attr: {},
        related_id: {
          Item: { _attr: { id: 1 } }
        }
      }
    )
  ).toEqual(true)
})
