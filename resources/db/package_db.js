var ObjectId = require('mongodb').ObjectId;

/**
 * 
 * @typedef {Object} Package
 * @property {Date} validThru the expiration date of the package
 * @property {Number} totalPacks the total number of packs of the product
 * @property {Number} consumedPacks the total number of consumed Packs
 * @property {Bool} active the package has any Packs left ?
 * @property {String} geolocation the geolocation of the package (lat|log)
 * @property {String[]} childStoreId the Id where the known packs are located
 * 
 */





/**
 * Insert new package into the system
 * @param {Package} package The new package entry to be inserted
 * 
 */
async function insertNewPackage(shippment) {
    return new Promise(function (resolve, reject) {
        global.conn.collection("packages").insertOne(shippment, (error, resp) => {

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
            if (packageId != undefined) {
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
        global.conn.collection("packages").find({ childStoreId: ObjectId(storeId), active: true }).project({ validThru: 1 }).toArray((err, packageObjs) => {

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
 * Find more package info
 * @param {String} storeId - store id to get packages info
 * 
 */
async function addChildStore(packageId, storeId) {
    return new Promise(function (resolve, reject) {
        global.conn.collection("packages").updateOne({ _id: ObjectId(packageId) }, { $push: { childStoreId: ObjectID(storeId) } }, { upsert: false }).then(resp => {
            if (resp.result.nModified == 1) {
                resolve({
                    status: success,
                    data: UPDATED
                })
            }
        })
    })
}




module.exports = { insertNewPackage, findPackageInfo, findAllPackagesCurrentInStore, addChildStore }