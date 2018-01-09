const util = require('../util.js')

const _attr = { type: 'test', id: '1' }

test ('util.getItems returns empty list by default', () => {
    expect(util.getItems()).toEqual([])
    expect(util.getItems({})).toEqual([])
    expect(util.getItems({'AML':{}})).toEqual([])
})

test ('util.getItems returns list when Item is list', () => {
    expect(util.getItems({'AML':{'Item':[]}})).toEqual([])
})

test ('util.getItems returns list when Item is object', () => {
    expect(util.getItems({'AML':{'Item':{}}})).toEqual([{}])
})

const testItem1 = { prop: { keyed_name: 'test', _text: '1' } }
const testItemEmpty = { } 
const testItem1_Empty = { prop: { } }

test ('util.compareProps returns empty property if not set', () => {
    expect( util.compareProps(testItem1, testItemEmpty) ).toEqual( testItem1_Empty )
})

test ('util.compareProps returns new property value', () => {
    expect( util.compareProps(testItemEmpty, testItem1) ).toEqual( testItem1 )
})

test ('util.compareProps does not set property value if same', () => {
    expect( util.compareProps(testItem1, testItem1) ).toEqual( null )
})

