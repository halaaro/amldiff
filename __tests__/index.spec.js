const diff = require('../index.js')
const toJs = require('../toJs.js')
const { js2xml } = require('xml-js')

const opts = { compact: true, attributesKey: '_attr' }

const empty = `
<AML>
</AML>
`
const test1 = `
<AML>
    <Item type="test" id="1"/>
</AML>
`
const test1_add = `
<AML>
    <Item type="test" id="1" action="add"/>
</AML>
`
const test1_delete = `
<AML>
    <Item type="test" id="1" action="delete"/>
</AML>
`
const test2 = `
<AML>
    <Item type="test" id="1"><prop>val2</prop></Item>
</AML>
`
const test1_test2_edit = `
<AML>
    <Item type="test" id="1" action="edit"><prop>val2</prop></Item>
</AML>
`
const test2_test1_edit = `
<AML>
    <Item type="test" id="1" action="edit"><prop></prop></Item>
</AML>
`

test( 'add item', () => {
    expect( diff(empty, test1) ).toEqual( toJs(test1_add) )
})

test( 'delete item', () => {
    expect( diff(test1, empty) ).toEqual( toJs(test1_delete) )
})

test( 'edit item set new property', () => {
    expect( diff(test1, test2) ).toEqual( toJs(test1_test2_edit) )
})

test( 'edit item remove property', () => {
    expect( diff(test2, test1) ).toEqual( toJs(test2_test1_edit) )
})

test( 'same item should return empty aml', () => {
    expect( diff(test1, test1) ).toEqual( toJs(empty) )
})

test( 'same item should return empty aml', () => {
   console.log(js2xml(diff(`<AML><Item type='test' id='123'><name>shawn</name><login>dooby</login></Item></AML>`,`<AML><Item type='test' id='123'><name>shawn</name><login>dooby2</login></Item></AML>`), {compact: true, attributesKey: '_attr'}))
})