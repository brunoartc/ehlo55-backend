

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

module.exports = { insertNewPackage }