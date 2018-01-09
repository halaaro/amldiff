const { xml2js } = require('xml-js')
const opts = { compact: true, attributesKey: '_attr' }

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
const toJs = ( xml ) => {
    let obj = xml2js( xml, opts )
    if (obj && obj.AML ) {
        if (obj.AML.Item == null) {
            // missing Item, add as empty list
            obj.AML.Item = []
        } else if (obj.AML.Item.length == null) {
            // single Item, add as list
            obj.AML.Item = [ obj.AML.Item ]
        }
    }
    return obj
}

module.exports = toJs