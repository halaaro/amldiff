
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

const _getProperties = ( item ) => {
    const props = {}
    const notProps = ['_attr', 'Relationships']
    Object.keys(item).filter( k => !(k in notProps) ).forEach( k => props[k] = item[k] )
    return props
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

const compareItems = ( a, b ) => { 
    _validateCompare( a, b )
    const propsDiff = compareProps( _getProperties(a), _getProperties(b) )
    return propsDiff ? 
        Object.assign( { _attr: { type: b._attr.type, id: b._attr.id }}, propsDiff ) :
        null
}

module.exports = { getItems, compareItems, compareProps }