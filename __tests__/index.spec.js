const { diff } = require('../diff.js')
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

const testRel1 = `
<AML>
  <Item type="test" id="1">
    <Relationships>
      <Item type="rel" id="2">
        <source_id>1</source_id>
      </Item>
    </Relationships>
  </Item>
</AML>
`
const testRel2 = `
<AML>
  <Item type="test" id="1">
    <Relationships>
      <Item type="rel" id="2">
        <related_id>3</related_id>
        <source_id>1</source_id>
      </Item>
    </Relationships>
  </Item>
</AML>
`
const testRel1_add = `
<AML>
  <Item type="test" id="1" action="edit">
    <Relationships>
      <Item type="rel" id="2" action="add">
        <source_id>1</source_id>
      </Item>
    </Relationships>
  </Item>
</AML>
`
const testRel1_delete = `
<AML>
  <Item type="test" id="1" action="edit">
    <Relationships>
      <Item type="rel" id="2" action="delete">
      </Item>
    </Relationships>
  </Item>
</AML>
`
const testRel2_edit = `
<AML>
  <Item type="test" id="1" action="edit">
    <Relationships>
      <Item type="rel" id="2" action="edit">
        <related_id>3</related_id>
      </Item>
    </Relationships>
  </Item>
</AML>
`

test( 'add relationship', () => {
    debugger
    expect( diff(test1, testRel1) ).toEqual( toJs(testRel1_add) )
})

test( 'delete relationship', () => {
    debugger
    expect( diff(testRel1, test1) ).toEqual( toJs(testRel1_delete) )
})

test( 'edit relationship', () => {
    debugger
    expect( diff(testRel1, testRel2) ).toEqual( toJs(testRel2_edit) )
})