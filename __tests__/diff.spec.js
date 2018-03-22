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
    expect( _diff(test1, testRel1) ).toEqual( toJs(testRel1_add) )
})

test( 'delete relationship', () => {
    expect( _diff(testRel1, test1) ).toEqual( toJs(testRel1_delete) )
})

test( 'edit relationship', () => {
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

const testNoBuiltinProp = `
<AML>
  <Item type="test" id="123" action="add"/>
</AML>
`

const testBuiltinProp1 = `
<AML>
  <Item type="test" id="123" action="add"/>
  <Item type="test" id="123" action="edit">
    <Relationships>
      <Item type="Property" action="edit" where="source_id='123' and name='prop_name'">
        <is_hidden>0</is_hidden>
        <same>1</same>
      </Item>
    </Relationships>
  </Item>
</AML>
`

const testBuiltinProp2 = `
<AML>
  <Item type="test" id="123" action="add"/>
  <Item type="test" id="123" action="edit">
    <Relationships>
      <Item type="Property" action="edit" where="source_id='123' and name='prop_name'">
        <is_hidden>1</is_hidden>
        <same>1</same>
      </Item>
    </Relationships>
  </Item>
</AML>
`

const testBuiltinProp2_edit = `
<AML>
  <Item type="test" id="123" action="edit">
    <Relationships>
      <Item type="Property" action="edit" where="source_id='123' and name='prop_name'">
        <is_hidden>1</is_hidden>
      </Item>
    </Relationships>
  </Item>
</AML>
`

const testBuiltinProp2_add = `
<AML>
  <Item type="test" id="123" action="edit">
    <Relationships>
      <Item type="Property" action="edit" where="source_id='123' and name='prop_name'">
        <is_hidden>1</is_hidden>
        <same>1</same>
      </Item>
    </Relationships>
  </Item>
</AML>
`

test( 'change edit of built-in property', () => {
  debugger
  expect( _diff(testBuiltinProp1, testBuiltinProp2) ).toEqual( toJs(testBuiltinProp2_edit) )
})

test( 'add edit of built-in property', () => {
  expect( _diff(testNoBuiltinProp, testBuiltinProp2) ).toEqual( toJs(testBuiltinProp2_add) )
})

const testKeepDelete = `
<AML>
  <Item type="test" id="123" action="delete">
  </Item>
</AML>
`

test( 'keep delete item', () => {
  expect( _diff(testKeepDelete, testKeepDelete) ).toEqual( toJs(testKeepDelete) )
})

const testRelationshipItem1 = `
<AML>
  <Item id="123" type="RelationshipType" action="add" dependencyLevel="0">
    <relationship_id keyed_name="RelatedItem" type="ItemType" name="RelatedItem">
      <Item type="ItemType" id="456" action="add">
        <allow_private_permission>1</allow_private_permission>
      </Item>
    </relationship_id>
  </Item>
</AML>
`
const testRelationshipItem2 = `
<AML>
  <Item id="123" type="RelationshipType" action="add" dependencyLevel="0">
    <relationship_id keyed_name="RelatedItem" type="ItemType" name="RelatedItem">
      <Item type="ItemType" id="456" action="add">
        <allow_private_permission>0</allow_private_permission>
      </Item>
    </relationship_id>
  </Item>
</AML>
`
const testRelationshipItem2_edit = `
<AML>
  <Item id="123" type="RelationshipType" action="edit" dependencyLevel="0">
    <relationship_id keyed_name="RelatedItem" type="ItemType" name="RelatedItem">
      <Item type="ItemType" id="456" action="edit">
        <allow_private_permission>0</allow_private_permission>
      </Item>
    </relationship_id>
  </Item>
</AML>
`


test( 'relationship itemtype no change', () => {
  expect( _diff(testRelationshipItem1, testRelationshipItem1) ).toEqual( toJs(empty) )
})


test( 'relationship itemtype', () => {
  expect( _diff(testRelationshipItem1, testRelationshipItem1) ).toEqual( toJs(empty) )
})

const testRelationshipItem3 = `
<AML>
 <Item type="Parent" id="123" action="add">
 <Relationships>
   <Item type="Relation" action="add">
    <related_id keyed_name="Related Name" type="Relation Type">456</related_id>
    <prop1>1</prop1>
    <prop2>1</prop2>
    <source_id keyed_name="Parent Name" type="Parent">123</source_id>
   </Item>
  </Relationships>
 </Item>    
</AML>
`


const testRelationshipItem4 = `
<AML>
 <Item type="Parent" id="123" action="add">
 <Relationships>
   <Item type="Relation" action="add">
    <related_id keyed_name="Related Name" type="Relation Type">456</related_id>
    <prop1>2</prop1>
    <prop2>1</prop2>
    <source_id keyed_name="Parent Name" type="Parent">123</source_id>
   </Item>
  </Relationships>
 </Item>    
</AML>
`

const testRelationshipItem4_edit = `
<AML>
 <Item type="Parent" id="123" action="edit">
 <Relationships>
   <Item type="Relation" action="add">
    <related_id keyed_name="Related Name" type="Relation Type">456</related_id>
    <prop1>2</prop1>
    <source_id keyed_name="Parent Name" type="Parent">123</source_id>
   </Item>
  </Relationships>
 </Item>    
</AML>
`


test( 'relationship without ID or where clause', () => {
  expect( _diff(testRelationshipItem3, testRelationshipItem3) ).toEqual( toJs(empty) )
})


test( 'edit relationship without ID or where clause', () => {
  debugger
  expect( _diff(testRelationshipItem3, testRelationshipItem4) ).toEqual( toJs(testRelationshipItem4_edit) )
})


const testRelationshipItem5 = `
<AML>
 <Item type="Parent" id="123" action="add">
 <Relationships>
   <Item type="Relation" action="add">
    <related_id keyed_name="Related Name" type="Relation Type">
      <Item type="Child" action="add" id="456">
        <child_prop1>1</child_prop1>
        <child_prop2>2</child_prop2>
      </Item>
    </related_id>
    <source_id keyed_name="Parent Name" type="Parent">123</source_id>
   </Item>
  </Relationships>
 </Item>    
</AML>
`

const testRelationshipItem6 = `
<AML>
 <Item type="Parent" id="123" action="add">
 <Relationships>
   <Item type="Relation" action="add">
    <related_id keyed_name="Related Name" type="Relation Type">
      <Item type="Child" action="add" id="456">
        <child_prop1>2</child_prop1>
        <child_prop2>2</child_prop2>
      </Item>
    </related_id>
    <source_id keyed_name="Parent Name" type="Parent">123</source_id>
   </Item>
  </Relationships>
 </Item>    
</AML>
`

const testRelationshipItem6_edit = `
<AML>
 <Item type="Parent" id="123" action="edit">
  <Relationships>
   <Item type="Relation" action="add">
    <related_id keyed_name="Related Name" type="Relation Type">
      <Item type="Child" action="edit" id="456">
        <child_prop1>2</child_prop1>
      </Item>
    </related_id>
    <source_id keyed_name="Parent Name" type="Parent">123</source_id>
   </Item>
  </Relationships>
 </Item>    
</AML>
`



test( 'same child relationship without ID or where clause should be ignored', () => {
  expect( _diff(testRelationshipItem5, testRelationshipItem5) ).toEqual( toJs(empty) )
})


test( 'changed child relationship without ID or where clause', () => {
  expect( _diff(testRelationshipItem5, testRelationshipItem6) ).toEqual( toJs(testRelationshipItem6_edit) )
})


const testNonKeyedProp1 = `
<AML>
  <Item type="test" id="123" action="add">
    <Relationships>
      <Item type="Property" action="add" id="456">
        <is_keyed>0</is_keyed>
        <same>1</same>
      </Item>
    </Relationships>
  </Item>
</AML>
`

const testKeyedProp1 = `
<AML>
  <Item type="test" id="123" action="add"/>
  <Item type="test" id="123" action="edit">
    <Relationships>
      <Item type="Property" action="add" id="456">
        <is_keyed>1</is_keyed>
        <same>1</same>
      </Item>
    </Relationships>
  </Item>
</AML>
`

const testKeyedProp1_edit = `
<AML>
  <Item type="test" id="123" action="edit">
    <Relationships>
      <Item type="Property" action="edit" id="456">
        <is_keyed>1</is_keyed>
      </Item>
    </Relationships>
  </Item>
</AML>
`

test( 'change property from non-keyed to keyed', () => {
  debugger
  expect( _diff(testNonKeyedProp1, testKeyedProp1) ).toEqual( toJs(testKeyedProp1_edit) )
})
