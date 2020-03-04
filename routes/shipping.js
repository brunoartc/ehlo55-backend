var express = require('express');
var router = express.Router();


/**
 * 
 * @typedef {Object} transactionDescriptor
 * @property {Bool} transactionType - CREDIT/DEBIT
 * @property {String} productBrand - brand of the product, may be an array
 * @property {String} productType - type of the product, may be an array
 * @property 
 */

/**
 * 
 * @typedef {Object} Update
 * @property {Date} updateDate - the initial date of the shipping
 * @property {String} lastUpdateHash - one of the steps in your new habit
 * @property {transactionDescriptor} shippmentUpdateDescriptor - description of the update
 * @property 
 */


/**
 * 
 * @typedef {Object} Shipping
 * @property {Date} shippingDate - the initial date of the shipping
 * @property {String} lastUpdate - one of the steps in your new habit
 * @property {String} currentHash - Hash of stringfy of last Update object
 * @property {Updates[]} updates - An update consists of (DA)
 * @property {String[]} signatures - steps to complete your goal
 * @property 
 */




/**
 * Get all objects current active
 * @todo filters
 */
router.get('/', function(req, res, next) {

});

/**
 * Get last occurence of and object
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

module.exports = router;