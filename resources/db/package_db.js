var ObjectId = require('mongodb').ObjectId;

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





/**
 * Insert new package into the system
 * @param {Package} package The new package entry to be inserted
 * 
 */
async function insertNewPackage(package) {
    return new Promise(function (resolve, reject) {
        global.conn.collection("packages").insertOne(package, (error, resp) => {

            if (error) {
                reject({ "status": "error", "data": "UNKNOWNERROR" })
            }

            resolve({
                "status": "success", "data": {
                    event: "INSERTED",
                    qrcode_info: {
                        _id: resp.ops[0]._id
                    }
                }
            })
        })
    })
}



/**
 * Find more package info
 * @param {String} packageId - id of the package being searched
 * 
 */
async function findPackageInfo(packageId) {
    return new Promise(function (resolve, reject) {
        global.conn.collection("packages").findOne({ _id: ObjectId(packageId) }).then((packageObj) => {
            if (packageObj != undefined) {
                resolve({
                    "status": "success", "data": {
                        validThru: packageObj.validThru,
                        childStoreIds: packageObj.childStoreIds,
                        totalPacks: packageObj.totalPacks,
                        consumedPacks: packageObj.consumedPacks
                    }
                })
            }
        })
    })
}


/**
 * Find more package info
 * @param {String} storeId - store id to get packages info
 * 
 */
async function findAllPackagesCurrentInStore(storeId) {
    return new Promise(function (resolve, reject) {
        global.conn.collection("packages").find({ childStoreIds: ObjectId(storeId), active: true }).project({ validThru: 1 }).toArray((err, packageObjs) => {

            resolve({
                "status": "success", "data": {
                    warn: "BETAINFO",
                    packageObjs
                }
            })

        })
    })
}


/**
 * Add a store to a package legacy
 * @param {String} storeId - store id to get packages info
 * @param {String} packageId package id to add store to
 */
async function addChildStore(packageId, storeId) {
    return new Promise(function (resolve, reject) {
        global.conn.collection("packages").updateOne({ _id: ObjectId(packageId) }, { $push: { childStoreIds: ObjectId(storeId) } }, { upsert: false }).then(resp => {
            if (resp.result.nModified == 1) {
                resolve({
                    status: "success",
                    data: "UPDATED"
                })
            }
        })
    })
}

/**
 * Consume one pack
 * @param {String} packageId - package id to debit quantity from
 * @param {Number} quantity of items to be consumed from pakcage
 * 
 */
async function consumePacks(packageId, quantity) {
    console.log(packageId, quantity);
    
    return new Promise(function (resolve, reject) {
        global.conn.collection("packages").updateOne({ _id: ObjectId(packageId) }, { $inc: { consumedPacks: quantity  } }, { upsert: false }).then(resp => {
            if (resp.result.nModified == 1) {
                resolve({
                    status: "success",
                    data: "CONSUMED"
                })
            }
        })
    })
}




module.exports = { insertNewPackage, findPackageInfo, findAllPackagesCurrentInStore, addChildStore, consumePacks }
