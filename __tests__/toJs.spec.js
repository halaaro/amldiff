const { toJs } = require('../toJs.js')

test('toJs converts single Item to list', () =>{
    expect(toJs('<AML><Item/></AML>')).toEqual({'AML': {'Item': [ {} ]}})
})

test('toJs converts empty AML to empty Item list', () =>{
    expect(toJs('<AML></AML>')).toEqual({'AML': {'Item': [ ]}})
})

test('toJs preserves Item list', () =>{
    expect(toJs('<AML><Item/><Item/></AML>')).toEqual({'AML': {'Item': [ {}, {} ]}})
})

test('toJs converts empty Relationships to empty Item list', () =>{
    expect(toJs('<AML><Item><Relationships></Relationships></Item></AML>')).toEqual(
        {AML: {Item: [
            {Relationships: {Item: [ ]} }
        ]}})
})

test('toJs converts single Item in Relationships to list', () =>{
    expect(toJs('<AML><Item><Relationships><Item/></Relationships></Item></AML>')).toEqual(
        {AML: {Item: [
            {Relationships: {Item: [ {} ]} }
        ]}})
})

test('toJs preserves Item list in Relationships', () =>{
    expect(toJs('<AML><Item><Relationships><Item/><Item/></Relationships></Item></AML>')).toEqual(
        {AML: {Item: [
                {Relationships: {Item: [ {}, {} ]} }
        ]}})
})