const diff = require('../diff.js')

const _attr = { type: 'test', id: '1' }

test ('diff.getItems returns empty list by default', () => {
    expect(diff.getItems()).toEqual([])
    expect(diff.getItems({})).toEqual([])
    expect(diff.getItems({'AML':{}})).toEqual([])
})

test ('diff.getItems returns list when Item is list', () => {
    expect(diff.getItems({'AML':{'Item':[]}})).toEqual([])
})

test ('diff.getItems returns list when Item is object', () => {
    expect(diff.getItems({'AML':{'Item':{}}})).toEqual([{}])
})

const testItem1 = { prop: { keyed_name: 'test', _text: '1' } }
const testItemEmpty = { } 
const testItem1_Empty = { prop: { } }

test ('diff.compareProps returns empty property if not set', () => {
    expect( diff.compareProps(testItem1, testItemEmpty) ).toEqual( testItem1_Empty )
})

test ('diff.compareProps returns new property value', () => {
    expect( diff.compareProps(testItemEmpty, testItem1) ).toEqual( testItem1 )
})

test ('diff.compareProps does not set property value if same', () => {
    expect( diff.compareProps(testItem1, testItem1) ).toEqual( null )
})

