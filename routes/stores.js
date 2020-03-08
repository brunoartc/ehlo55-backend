var express = require('express');
var router = express.Router();

var storesDb = require('../resources/db/stores_db')


/**
 * Get best Pack to use now
 * @param {Package} package The new package entry to be inserted
 * 
 */
router.get('/', function(req, res, next) {
    let { packageId } = req.params

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