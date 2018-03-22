const { toJs } = require('./toJs.js')

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
const _getPropValue = (prop) => { 
    return JSON.stringify(prop.Item) || prop._cdata || prop._text
}
const compareProps = (aProps, bProps) => {
    const props = {}
    for( let prop in bProps ) {
        props[prop] = bProps[prop]
    }
    
    for ( let prop in aProps) {
        if ( prop in props ) { // change
    
            if (_getPropValue(aProps[prop]) === _getPropValue(bProps[prop])) { // ignore if same
                delete props[prop]
            } else if (prop === 'related_id' && props[prop].Item && props[prop].Item._attr.action !== 'get') {
                props[prop].Item = compareItem( aProps[prop].Item, bProps[prop].Item )
                props[prop].Item._attr.action = 'edit'
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

    if (item._attr && item._attr.where) {
        // TODO: parse and check where clause
    } else if ( item.related_id ) { 
        // TODO: check if has related_id and source_id 
    } else if (item._attr == null || item._attr.id == null ) {
        throw new Error('Item must have id attribute defined')
    }
}

const _validateCompare = (a, b) => {
    _validateItem(a)
    _validateItem(b)
    if (a._attr.type !== b._attr.type) {
        console.log(a._attr, b._attr);
        throw new Error( 'Both items must have same type')
    }
    // TODO: parse where and compare elements
    //if (a._attr.where != b._attr.where) {
    //    
    //} else 
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
        if (b._attr.id) {
            diff = { _attr: { id: b._attr.id, type: b._attr.type } }
        } else if ( a._attr.where && b._attr.where ) {
            diff = { _attr: { where: b._attr.where, type: b._attr.type } } 
        }  else if ( a.related_id && b.related_id ) {
            diff = { _attr: b._attr }
            if (!propsDiff.related_id) {
                diff.related_id = b.related_id
            }
            if (!propsDiff.source_id) {
                diff.source_id = b.source_id
            }
        } else { 
            return diff 
        }
        if (propsDiff) { Object.assign( diff, propsDiff ) }
        if (relItems.length) { diff.Relationships = { Item: relItems } }
    }
    return diff
}

const itemsMatch = ( aItem, bItem ) => {

    // first check types
    if (bItem._attr.type !== aItem._attr.type) {
        return false
    }

    // next check the id and action
    if (bItem._attr.id && 
        bItem._attr.id === aItem._attr.id &&
        bItem._attr.action === aItem._attr.action) {
        return true
    }

    // next check for compatible where clause and type
    if (bItem._attr.where && bItem._attr.where === aItem._attr.where) {
        return true   
    }
    
    // finally check for related_id matching
    if (bItem.related_id || aItem.related_id) {

        // check for direct text node id's first
        const aRelText = aItem.related_id && aItem.related_id._text
        const bRelText = bItem.related_id && bItem.related_id._text

        if (bRelText && aRelText === bRelText) {
            return true
        }

        // otherwise, check for item node id
        const aRelItem = aItem.related_id && aItem.related_id.Item
        const bRelItem = bItem.related_id && bItem.related_id.Item 

        const aRelId = aRelItem && aRelItem._attr && aRelItem._attr.id
        const bRelId = bRelItem && bRelItem._attr && bRelItem._attr.id

        if (bRelId && aRelId === bRelId  ) {
            return true
        }

        // need to check for keyed_name?
    }
    
    return false
    // check action?            aItem._attr.action === bItem._attr.action
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
            // TODO: normalize where clause 
            if ( itemsMatch (aItem, bItem) ) {
                // check relatedId matcher
                matched = true
                matchedItem = aItem
                break
            }
        }
        if (!matched) {
            if (bItem._attr.action !== 'edit') {
                bItem._attr.action = 'add'
            }
            addItems.push(bItem)
        } else {
            let diff = compareItem(matchedItem, bItem)
            if (bItem._attr.action === 'delete') {
                deleteItems.push( bItem )
            }
            if (diff != null) {
                if (diff.related_id && (diff._attr.id == null)) { // special case for related items without ID (eg. Workflow Map Activity)
                    diff._attr.action = 'add'
                } else {
                    diff._attr.action = 'edit'
                }
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

const _diff = (a, b) => {
    let [aObject, bObject] = [a,b].map( toJs )
    let {addItems, editItems, deleteItems} = compareItems(aObject.AML.Item, bObject.AML.Item)
    const diffObject = {'AML': { 'Item': addItems.concat(editItems).concat(deleteItems) }} 
    return diffObject
}

module.exports = { _diff, getItems, compareItems, compareItem, compareProps, itemsMatch }