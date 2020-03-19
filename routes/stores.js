var express = require('express');
var router = express.Router();

var storesDb = require('../resources/db/stores_db')


/**
 * Get best Pack to use now
 * @param {Package} package The new package entry to be inserted
 * 
 */
router.get('/:storeId', function(req, res, next) {
    let { storeId } = req.params
    
    storesDb.removeFromStockHint(storeId).then((resp) => res.send(resp)).catch((err) => res.send(err))

});


/**
 * Delete a specific package with provided identification scheme
 * @param {String} identificationScheme is the pattern string to identify package
 * @param {String} storeId is the store's Id wich own the package
 */
router.delete('/:identificationScheme/:storeId', function(req, res, next) {
    let { identificationScheme, storeId } = req.params
    storesDb.deactivatePack(identificationScheme, storeId).then((resp) => res.send(resp)).catch((err) => res.send(err))

});





/**
 * Register new pack into system
 * @param {Package} package The new package entry to be inserted
 * 
 */
router.post('/', function(req, res, next) {
    let { packageId, storeId, packQuantity } = req.body
    storesDb.insertNewPack(packageId, storeId, packQuantity).then((resp) => res.send(resp)).catch((err) => res.send(err))

});



module.exports = router;
