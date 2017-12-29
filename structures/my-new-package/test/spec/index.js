const assert = require('assert')
const context = require('../context/')
const myNewPackage = require('../../src/')

const myNewPackageTestSuite = {
    context,
    'should be a function': () => {
        assert.equal(typeof myNewPackage, 'function')
    },
    'should call package without error': () => {
        assert.doesNotThrow(() => {
            myNewPackage()
        })
    },
}

module.exports = myNewPackageTestSuite
