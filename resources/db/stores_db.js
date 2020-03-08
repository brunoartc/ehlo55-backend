var ObjectId = require('mongodb').ObjectId;

var packageDb = require('./package_db')

/**
 * 
 * @typedef {Object} Pack
 * @property {String} identificationScheme the patter that identifies that Pack physically
 * @property {Number} validThru the expiration date of the pack
 * @property {Number} quantity quantity of the pack on the store
 * @property {Bool} active the product is active on the store?
 * @todo mongo scheme to index validThru
 * 
 */


function makeRandomSchema(length) {
    var result = '';
    var characters = '10';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}




/**
 * Insert new package into the system
 * @param {Pack} pack The new pack in store stock
 * 
 */
async function insertNewPack(packageId, storeId, quantity) {

    return new Promise(function (resolve, reject) {


        packageDb.findPackageInfo(packageId).then((packageInfo) => {

            let pack = {
                validThru: packageInfo.data.validThru,
                identificationScheme: makeRandomSchema(8),
                active: true,
                owner: ObjectId(storeId),
                quantity: parseInt(quantity)
            }


            //TODO make function
            // remove confliting package assume as consumed -- possible bug
            global.conn.collection("packages").findOne({ owner: ObjectId(storeId), active: true, identificationScheme: pack.identificationScheme }).then((packObj) => {

                if (packObj != undefined) {
                    global.conn.collection("storePacks").updateOne({ owner: ObjectId(storeId), active: true, identificationScheme: pack.identificationScheme }, { $set: { active: false } }, { upsert: false }).then(resp => {


                        if (resp.result.nModified == 1) {
                            packageDb.consumePacks(packageId, packObj.quantity)
                        }
                    })

                }
            })





            global.conn.collection("storePacks").insertOne(pack, (error, resp) => {

                if (error) {
                    reject({ "status": "error", "data": "UNKNOWNERROR" })
                }

                packageDb.addChildStore(packageId, storeId)

                resolve({
                    "status": "success", "data": {
                        event: "INSERTED",
                        info: {
                            identificationScheme: pack.identificationScheme
                        }
                    }
                })
            })
        })




    })
}


async function removeFromStockHint(storeId) {
    return new Promise(function (resolve, reject) {
        global.conn.collection("storePacks").find({ owner: ObjectId(storeId), active: true, validThru: { $gte: new Date() } }).sort({ validThru: 1 }).project({ identificationScheme: 1 }).toArray((err, packObjs) => {

            resolve({
                "status": "success", "data": {
                    packObjs
                }
            })

        })
    })

}


async function deactivatePack(packIdentificationScheme, storeId) {
    console.log(packIdentificationScheme, storeId);

    return new Promise(function (resolve, reject) {
        global.conn.collection("storePacks").updateOne({ owner: ObjectId(storeId), active: true, identificationScheme: packIdentificationScheme }, { $set: { active: false } }, function(err, resp) {
            
            if (resp.result.nModified == 1) {
                resolve({ status: "success", data: "DEACTIVATED" })
            } else {
                resolve({ status: "error", data: "UNKNOWNPACK" })
            }
        })

    })

}





module.exports = { insertNewPack, removeFromStockHint, deactivatePack }