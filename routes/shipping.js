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
 * @property {String} lastUpdate - one of the steps in your updatesnew habit
 * @property {Updates[]} plannedTransactions - a List of updates
 * @property {Number} totalPlanned - number of done updates
 * @property {String} shippingSignature - signature of stringfy of upper proprerties, from the owner
 * @property {String} lastShippmentSignature - last block with a signature 
 * @property {Bool} active - shippment was complete ?
 * @property {Number} doneCount - number of done updates
 * @property {String} currentUpdateHash - Hash of stringfy of last Update object
 * @property {transactionDescriptor[]} updates - An update consists of (DA)
 * @property {String[]} signatures - steps to complete your goal
 */




/**
 * Get all shippments current active
 * @todo filters
 */
router.get('/', function(req, res, next) {
    shippmentDb.getAllActiveShippment().then((resp) => res.send(resp)).catch((err) => res.send(err))

});

/**
 * Sign occurence of object
 * @param {Date} shippingDate is the date when the shippment should happen
 * @param {String} shippingPlannedTransactions are the supposed-to-happen transactions 
 * @param {Date} insertionTimeStamp is the moment when a package is inserted to the shippment
 * @param {String} lastShippmentSignature last signature tha occurred in this shippment
 * @param {String} shippingOwnerSignature who owns the last signature
 */
router.post('/', function(req, res, next) {
    let {
        shippingDate,
        shippingPlannedTransactions,
        insertionTimeStamp,
        lastShippmentSignature, //need to autocomlet
        shippingOwnerSignature
    } = req.body
    let shippment = {
        shippingDate: shippingDate,
        lastUpdate: insertionTimeStamp,
        plannedTransactions: JSON.parse(shippingPlannedTransactions),
        totalPlanned: JSON.parse(shippingPlannedTransactions).length,
        lastShippmentSignature: lastShippmentSignature,
        shippingSignature: shippingOwnerSignature,
        active: true,
        adultered: false,
        doneCount: 0,
        currentUpdateHash: "",
        updates: [],
        signatures: []
    }

    shippmentValidator.validateTransactionObject(shippment.plannedTransactions).catch((res) => console.log(res))

    shippmentDb.insertNewShippment(shippment).then((resp) => res.send(resp)).catch((err) => res.send(err))



});



/**
 * Get last hash of and shippment
 */
router.get('/:id', function(req, res, next) {


});

/**
 * Get what needs to be done next for auto completition & error checking if product is missing
 * @param {String} shippmentId
 */
router.get('/next/:shippmentId', function(req, res, next) {
    let { shippmentId } = req.params
    shippmentDb.checkBlockCloseBlock(shippmentId).then((resp) => res.send(resp.data.data.plannedTransactions[resp.data.data.doneCount]))
});


/**
 * Add a package to a shippment
 * @param {String} user who is inserting or deleting the package into the shippment
 * @param {String} signature is the signature of the user
 * @param {String} lastUpdateHash is the tracking data for the last update on the shippment
 * @param {String} transactionType identify if the package is being added or delivered
 * @param {String} productBrand is the product brand
 * @param {String} prodyuctType is the type os the product that is being inserted
 * @param {Number} productQuantity is the number of packages of the determined product
 * @param {String} shippmentId identifies the shippment to update
*/
router.post('/:shippmentId', function(req, res, next) {
    let {
        user,
        signature,
        lastUpdateHash, // get from /:id
        transactionType,
        productBrand,
        productType,
        productQuantity
    } = req.body

    let { shippmentId } = req.params

    let update = {
        updateDate: new Date(),
        lastUpdateHash: lastUpdateHash,
        shippmentUpdateDescriptor: {
            transactionType: transactionType,
            productBrand: productBrand,
            productType: productType,
            quantity: productQuantity
        }
    }

    shippmentDb.insertUpdate(update, signature, shippmentId).then((resp) => res.send(resp)).catch((err) => res.send(err))

});


/**
 * Set double signatures confirmation
 * @param {String} user who is validating the last signature
 * @param {String} signature is the signature of the user
 * @param {String} shippmentId identifies the shippment to update
 */
router.post('/2/:shippmentId', function(req, res, next) {
    let {
        user,
        signature
    } = req.body

    let { shippmentId } = req.params

    shippmentDb.signSignature(signature, shippmentId).then((resp) => res.send(resp)).catch((err) => res.send(err))

});




module.exports = router;
