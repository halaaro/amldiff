const { _diff, getItems, compareProps } = require('../diff.js')
const { toJs } = require('../toJs.js')

const _attr = { type: 'test', id: '1' }

test ('getItems returns empty list by default', () => {
    expect(getItems()).toEqual([])
    expect(getItems({})).toEqual([])
    expect(getItems({'AML':{}})).toEqual([])
})

test ('getItems returns list when Item is list', () => {
    expect(getItems({'AML':{'Item':[]}})).toEqual([])
})

test ('getItems returns list when Item is object', () => {
    expect(getItems({'AML':{'Item':{}}})).toEqual([{}])
})

const testItem1 = { prop: { keyed_name: 'test', _text: '1' } }
const testItemEmpty = { } 
const testItem1_Empty = { prop: { } }

test ('compareProps returns empty property if not set', () => {
    expect( compareProps(testItem1, testItemEmpty) ).toEqual( testItem1_Empty )
})

test ('compareProps returns new property value', () => {
    expect( compareProps(testItemEmpty, testItem1) ).toEqual( testItem1 )
})

test ('compareProps does not set property value if same', () => {
    expect( compareProps(testItem1, testItem1) ).toEqual( null )
})

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
    expect( _diff(empty, test1) ).toEqual( toJs(test1_add) )
})

test( 'delete item', () => {
    expect( _diff(test1, empty) ).toEqual( toJs(test1_delete) )
})

test( 'edit item set new property', () => {
    expect( _diff(test1, test2) ).toEqual( toJs(test1_test2_edit) )
})

test( 'edit item remove property', () => {
    expect( _diff(test2, test1) ).toEqual( toJs(test2_test1_edit) )
})

test( 'same item should return empty aml', () => {
    expect( _diff(test1, test1) ).toEqual( toJs(empty) )
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
    expect( _diff(test1, testRel1) ).toEqual( toJs(testRel1_add) )
})

test( 'delete relationship', () => {
    debugger
    expect( _diff(testRel1, test1) ).toEqual( toJs(testRel1_delete) )
})

test( 'edit relationship', () => {
    debugger
    expect( _diff(testRel1, testRel2) ).toEqual( toJs(testRel2_edit) )
})

const testRelId1 = `
<AML>
  <Item type="test" id="1">
    <related_id>2</related_id>
  </Item>
</AML>
`

const testRelId2 = `
<AML>
  <Item type="test" id="1">
    <related_id>
      <Item type="rel" action="get" select="id">
        <keyed_name>related</keyed_name>
      </Item>
    </related_id>
  </Item>
</AML>
`

const testRelId3 = `
<AML>
  <Item type="test" id="1">
    <related_id>
      <Item type="rel" action="get" select="id">
        <keyed_name>different</keyed_name>
      </Item>
    </related_id>
  </Item>
</AML>
`


const testRelId1_edit = `
<AML>
  <Item type="test" id="1" action="edit">
    <related_id>2</related_id>
  </Item>
</AML>
`

const testRelId2_edit = `
<AML>
  <Item type="test" id="1" action="edit">
    <related_id>
      <Item type="rel" action="get" select="id">
        <keyed_name>related</keyed_name>
      </Item>
    </related_id>
  </Item>
</AML>
`

const testRelId3_edit = `
<AML>
  <Item type="test" id="1" action="edit">
    <related_id>
      <Item type="rel" action="get" select="id">
        <keyed_name>different</keyed_name>
      </Item>
    </related_id>
  </Item>
</AML>
`

test( 'edit related id direct', () => {
  expect( _diff(testRelId2, testRelId1) ).toEqual( toJs(testRelId1_edit) )
})

test( 'edit related id direct to indirect', () => {
  expect( _diff(testRelId1, testRelId2) ).toEqual( toJs(testRelId2_edit) )
})

test( 'edit related id indirect same', () => {
  expect( _diff(testRelId2, testRelId2) ).toEqual( toJs(empty) )
})

test( 'edit related id indirect different', () => {
  expect( _diff(testRelId2, testRelId3) ).toEqual( toJs(testRelId3_edit) )
})

const testCData1 = `
<AML>
  <Item type="test" id="1">
    <prop><![CDATA[<value1></value1>]]></prop>
  </Item>
</AML>
`

const testCData2 = `
<AML>
  <Item type="test" id="1">
    <prop><![CDATA[<value2></value2>]]></prop>
  </Item>
</AML>
`
const testCData2_edit = `
<AML>
  <Item type="test" id="1" action="edit">
    <prop><![CDATA[<value2></value2>]]></prop>
  </Item>
</AML>
`

test( 'edit cdata', () => {
  expect( _diff(testCData1, testCData2) ).toEqual( toJs(testCData2_edit) )
})
