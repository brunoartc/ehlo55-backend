var express = require('express');
var router = express.Router();

var shippmentDb = require('../resources/db/shipping_db')
var shippmentValidator = require('../resources/validators/shipping_validator')

/**
 * 
 * @typedef {Object} transactionDescriptor
 * @property {Bool} transactionType - CREDIT/DEBIT
 * @property {String} productBrand - brand of the product, may be an array
 * @property {String} productType - type of the product, may be an array
 * @property {String} geolocation - the geolocatiion there the transaction occured
 * @property {Number} quantity - quantity of product being transacted
 */

/**
 * 
 * @typedef {Object} Update
 * @property {Date} updateDate - the initial date of the shipping
 * @property {String} lastUpdateHash - one of the steps in your new habit
 * @property {transactionDescriptor} shippmentUpdateDescriptor - description of the update
 * @property {String} currentHash - the hash of the previous properties stringfyed
 * @property 
 */


/**
 * 
 * @typedef {Object} Shipping
 * @property {Date} shippingDate - the initial date of the shipping
 * @property {String} lastUpdate - one of the steps in your new habit
 * @property {Updates[]} plannedTransactions - a List of updates
 * @property {String} lastSignature - last block with a signature 
 * @property {String} shippingSignature - signature of stringfy of upper proprerties, from the owner
 * @property {Bool} active - shippment was complete ?
 * @property {Number} doneCount - number of done updates
 * @property {String} currentHash - Hash of stringfy of last Update object
 * @property {transactionDescriptor[]} updates - An update consists of (DA)
 * @property {String[]} signatures - steps to complete your goal
 */




/**
 * Get all shippments current active
 * @todo filters
 */
router.get('/', function(req, res, next) {
    shippmentDb.getAllActiveObjectives()
});

/**
 * Get last hash of and shippment
 * @returns 
 */
router.get('/:id', function(req, res, next) {

});

/**
 * Get what needs to be done next for auto completition & error checking if product is missing
 */
router.get('/next/:id', function(req, res, next) {

});


/**
 * Sign occurence of object
 */
router.post('/:id', function(req, res, next) {
    let { user, signature, updateDate, lastUpdateHash, transactionType, productBrand, productType } = req.body

});


/**
 * Sign occurence of object
 */
router.post('/', function(req, res, next) {
    let { shippingDate, shippingPlannedTransactions, shippingOwnerSignature } = req.body
    let shippment = {
        shippingDate: shippingDate,
        lastUpdate: new Date(),
        plannedTransactions: shippingPlannedTransactions,
        shippingSignature: shippingOwnerSignature,
        active: true,
        doneCount: 0,
        currentHash: "",
        updates: [],
        signatures: []
    }

    validateTransactionObject(shippment.plannedTransactions)

    shippmentDb.insertNewShippment(shippment)


});

module.exports = router;