const { _diff } = require('./diff.js')
const { opts } = require('./toJs.js')
const { js2xml } = require('xml-js')

const diff = (a, b) => {
    const diffObject = _diff(a, b)
    return js2xml( diffObject, opts )
}

module.exports = diff

if (require.main == module) {
    const fs = require('fs')
    const a = fs.readFileSync(process.argv[2], 'utf-8')
    const b = fs.readFileSync(process.argv[3], 'utf-8')
    const d = diff(a, b)
    process.stdout.write( d )
    process.stdout.write('\n')
}