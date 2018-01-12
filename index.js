const { diff } = require('./diff.js')

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