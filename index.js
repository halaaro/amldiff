const toJs = require('./toJs.js')
const util = require('./util.js')

const diff = (a, b) => {
    let [a2, b2] = [a,b].map( val => toJs( val ) )

    // get list of items
    let [aItems, bItems] = [a2,b2].map( val => util.getItems(val) )

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
            let diff = util.compareItems(matchedItem, bItem)
            if (diff !== null) {
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

    return {'AML': { 'Item': addItems.concat(editItems).concat(deleteItems) }}
}

module.exports = diff

if (require.main == module) {
    const { js2xml } = require('xml-js')
    const { pd } = require('pretty-data')
    const fs = require('fs')

    const a = fs.readFileSync(process.argv[2], 'utf-8')
    const b = fs.readFileSync(process.argv[3], 'utf-8')

    const d = diff(a, b)
    process.stdout.write( pd.xml( js2xml(d, {compact: true, attributesKey: '_attr'})) )
    process.stdout.write('\n')
}