const toJs = require('./toJs.js')

const getItems = ( a ) => {

    // if empty, return empty list
    if ( a == null || a.AML == null || a.AML.Item == null ) {
        return []
    }

    // if Item is object, wrap in list
    if ( a.AML.Item.length == null ) { 
        return [a.AML.Item]
    } else {
        return a.AML.Item
    }
}

const compareProps = (aProps, bProps) => {
    const props = {}
    for( let prop in bProps ) {
        props[prop] = bProps[prop]
    }

    for ( let prop in aProps) {
        if ( prop in props ) { // change
            if (aProps[prop]._text == bProps[prop]._text) { // ignore if same
                delete props[prop]
            }
        } else { // removed, replace with empty
            props[prop] = {}
        }
    }
    return Object.keys(props).length ? props : null
}

const _getID = (item) => {
   return item._attr || item._attr.id || item.id || item.id._text
}

const compareRels = (aRels, bRels) => {
    const addRels = []
    const editRels = []
    const deleteRels = []

    for( let rel of bRels ) {
        addRels.push(rel)
    }

    //TODO: find matching relationship by ID
    for ( let rel of aRels) {
        if ( _getID(rel) in addRels.map(_getID) ) { // change
            matchedRel = addRels.filter( (v) => _getID(v) = _getID(rel) )[0]
            relDiff = compareProps(rel, matchedRel)
            if (!relDiff) { // ignore if same
                // delete from addRels
            } else { 
                // add to editRels
            }
        } else { // delete
            deleteRels.push( { _attr: { id: rel._attr.id._value, type: rel._attr.type._value, action: 'delete'} } )
        }
    }
    return addRels || editRels || deleteRels ? { addRels, editRels, deleteRels } : null
}

const _getProperties = ( item ) => {
    const props = {}
    const notProps = ['_attr', 'Relationships']
    Object.keys(item).filter( k => !(k in notProps) ).forEach( k => props[k] = item[k] )
    return props
}

const _getRelationships = ( item ) => {
    const relationships = item.Relationships && item.Relationships.Item ? item.Relationships.Item : []
    return relationships.length == null ? [relationships] : relationships
}

const _validateItem = ( item ) => {
    if (item._attr == null || item._attr.type == null) {
        throw new Error('Item must have type attribute defined')
    }

    if (item._attr == null || item._attr.id == null) {
        throw new Error('Item must have id attribute defined')
    }
}

const _validateCompare = (a, b) => {
    _validateItem(a)
    _validateItem(b)
    if (a._attr.type !== b._attr.type) {
        throw new Error( 'Both items must have same type')
    }
    if (a._attr.id !== b._attr.id) {
        throw new Error( 'Both items must have the same id')
    }
}

const compareItem = ( a, b ) => { 
    _validateCompare( a, b )
    const propsDiff = compareProps( _getProperties(a), _getProperties(b) )
    const { addItems, editItems, deleteItems } = compareItems( _getRelationships(a), _getRelationships(b) )
    let diff = null
    let relItems = addItems.concat(editItems).concat(deleteItems)
    if ( propsDiff || relItems.length ) {
        diff = { _attr: { id: b._attr.id, type: b._attr.type } }
        if (propsDiff) { Object.assign( diff, propsDiff ) }
        if (relItems.length) { diff.Relationships = { Item: relItems } }
    }
    return diff
}

const compareItems = ( aItems, bItems ) => {

    let addItems = []
    let editItems = []
    let deleteItems = []

    // check for added or changed items
    for ( bItem of bItems ) {
        let matched = false
        let matchedItem
        for ( let aItem of aItems ) {
            if ( bItem._attr.id === aItem._attr.id ) {
                matched = true
                matchedItem = aItem
                break
            }
        }
        if (!matched) {
            bItem._attr.action = 'add'
            addItems.push(bItem)
        } else {
            let diff = compareItem(matchedItem, bItem)
            if (diff != null) {
                diff._attr.action = 'edit'
                editItems.push( diff )
            }
        }
    } 

    // check for removed items
    for ( aItem of aItems ) {
        matched = false
        for ( bItem of bItems ) {
            if ( bItem._attr.id === aItem._attr.id ) {
                matched = true
            }
        }
        if (!matched) {
            aItem._attr.action = 'delete'
            deleteItems.push( { _attr: aItem._attr }) // include only attributes
        }
    } 

    return { addItems, editItems, deleteItems }
}

const diff = (a, b) => {
    let [a2, b2] = [a,b].map( val => toJs( val ).AML.Item )
    
    let { addItems, editItems, deleteItems } = compareItems( a2, b2 )

    return {'AML': { 'Item': addItems.concat(editItems).concat(deleteItems) }}
}

module.exports = { diff, getItems, compareItems, compareItem, compareProps }