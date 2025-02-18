var express = require('express');
var router = express.Router();


var packageDb = require('../resources/db/package_db')




/**
 * 
 * @typedef {Object} Package
 * @property {Date} validThru the expiration date of the package
 * @property {Number} totalPacks the total number of packs of the product
 * @property {Number} consumedPacks the total number of consumed Packs
 * @property {Bool} active the package has any Packs left ?
 * @property {String} geolocation the geolocation of the package (lat|log)
 * @property {String[]} childStoreIds the Id where the known packs are located
 * 
 */


router.post('/', function(req, res, next) {
    let {
        packageValidThruSecondsTimestamp,
        packageTotalPacks,
        packageGeolocation
    } = req.body

    let package = {
        validThru: new Date(parseInt(packageValidThruSecondsTimestamp) * 1000),
        totalPacks: parseInt(packageTotalPacks),
        consumedPacks: 0,
        active: true,
        geolocation: packageGeolocation,
        childStoreIds: []
    }


    packageDb.insertNewPackage(package).then((resp) => res.send(resp)).catch((err) => res.send(err))

});

/**
* Updates the package
* @param {String} packageId
* @paran {String} storeId
*/
router.put('/:packageId', function(req, res, next) {
    let { packageId } = req.params
    let { storeId } = req.body
    packageDb.addChildStore(packageId, storeId).then((resp) => res.send(resp)).catch((err) => res.send(err))

});

/**
* Get infos from the provided packageId
* @param {String} packageId
*/
router.get('/:packageId', function(req, res, next) {
    let { packageId } = req.params
    packageDb.findPackageInfo(packageId).then((resp) => res.send(resp)).catch((err) => res.send(err))

});

/**
* Get infos from the provided store Id
* @param {String} storeId
*/
router.get('/store/:storeId', function(req, res, next) {
    let { storeId } = req.params
    packageDb.findAllPackagesCurrentInStore(storeId).then((resp) => res.send(resp)).catch((err) => res.send(err))

});



module.exports = router;
