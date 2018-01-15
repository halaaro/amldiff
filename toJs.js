const { xml2js } = require('xml-js')
const opts = { compact: true, attributesKey: '_attr', spaces: 2 }

/**
 * @func toJS
 * Xml to javascript conversion for AML. Wraps xml-js to normalize Item elements.
 * 
 * @arg {string} xml XML to transform
 * @returns {Object} `AML` object representing xml source
 * 
 * `AML.Item` is a list regardless of how many Item tags are present. In the case of no Item elements, 
 * an `AML.Item` is an empty list. If there is one or more Item elements, a list of objects representing 
 * the Item(s) is returned in `AML.Item`.
 **/

const _normalize = (parent) => {
    // if not present, return empty list, if single Item, add as list
    let items = Array.isArray(parent.Item) ? parent.Item : ( parent.Item ? [ parent.Item ] : [] )
    for (item of items) {
        if ( item.Relationships != null ) {
            item.Relationships.Item = _normalize(item.Relationships)
        }
    }
    return items
}

const toJs = ( xml ) => {
    let obj = xml2js( xml, opts )
    if (obj && obj.AML ) {
        obj.AML.Item = _normalize(obj.AML)
    }
    return obj
}

module.exports = { toJs, opts }