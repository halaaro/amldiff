const toJs = require('../toJs.js')

test('toJs converts single Item to list', () =>{
    expect(toJs('<AML><Item/></AML>')).toEqual({'AML': {'Item': [ {} ]}})
})

test('toJs converts empty AML to empty Item list', () =>{
    expect(toJs('<AML></AML>')).toEqual({'AML': {'Item': [ ]}})
})

test('toJs preserves Item list', () =>{
    expect(toJs('<AML><Item/><Item/></AML>')).toEqual({'AML': {'Item': [ {}, {} ]}})
})
