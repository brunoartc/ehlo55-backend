var ObjectId = require('mongodb').ObjectId;




/**
 * 
 * @typedef {Object} UpdateSigned
 * @property {Date} updateDate - the initial date of the shipping
 * @property {String} lastUpdateHash - one of the steps in your new habit
 * @property {transactionDescriptor} shippmentUpdateDescriptor - description of the update
 * @property {String} currentHash - the hash of the previous properties stringfyed
 * @property {String} signature - the hash of the previous properties stringfyed
 */


/**
 * Get all shippments active for current blockchain
 */
async function getAllActiveShippment() {
    let shippmentDb = global.conn.collection("shipments")
    return new Promise(function(resolve, reject) {
        shippmentDb.find({ active: true }).project({ _id: 1, lastUpdateHash: 1, adultered: 1 }).toArray((err, shippmentsInfo) => {
            resolve({ "status": "success", "data": shippmentsInfo })
        })
    })
}

/**
 * Insert a new shippment to the current blockchain
 * @param {String} shippment is the hash of the shippment to be added
 */
async function insertNewShippment(shippment) {
    let shippmentDb = global.conn.collection("shipments")
    return new Promise(function(resolve, reject) {
        shippmentDb.insertOne(shippment, (error, resp) => {
            if (error) {
                reject({ "status": "error", "data": error })
            }

            resolve({ "status": "success", "data": "INSERTED" })
        })
    })
}

/**
 * Push new update to shippment
 * @param {Update} update Array containing objective information
 * @param {String} signature Signature of the current update by recived user
 * @param {String} shippmentId _id of the shipment
 * @todo chek user and signature
 * @returns {UpdateSigned} Signed version of update to be signed
 */
async function insertUpdate(update, signature, shippmentId) {
    let shippmentDb = global.conn.collection("shipments")
    return new Promise(function(resolve, reject) {
        shippmentDb.updateOne({ _id: ObjectId(shippmentId) }, { $push: { updates: update } }, { upsert: false }).then(resp => {

            if (resp.result.nModified == 1) {

                shippmentDb.updateOne({ _id: ObjectId(shippmentId) }, { $push: { signatures: signature } }, { upsert: false }).then(resp_inter => {

                    shippmentDb.findOne({ _id: ObjectId(shippmentId) }).then((shipObj) => {
                        if (shipObj.plannedTransactions[shipObj.doneCount].quantity != update.shippmentUpdateDescriptor.quantity) {
                            shippmentDb.updateOne({ _id: ObjectId(shippmentId) }, { $set: { adultered: true } }, { upsert: false }).then(resp_active => {
                                if (resp_active.result.nModified == 1) {

                                    resolve({
                                        "status": "error",
                                        "data": "PRODUCTADULTEREDCONTACTAMBEV"
                                    })


                                }
                            })
                        }
                    })

                    if (resp_inter.result.nModified == 1) {

                        update.signature = signature
                        resolve({
                            "status": "success",
                            "data": { "msg": "INSERTED", "signed_data": update }
                        })


                    } else {
                        reject({ "status": "error", "data": "WRONGTOKENORUNKNOWERROR2" }) //TODO: do better status
                    }
                })

            } else {
                reject({ "status": "error", "data": "WRONGTOKENORUNKNOWERROR" }) //TODO: do better status
            }
        })
    })
}

/**
* Close the shippment block when completed
* @param {String} shippmentId is the shippment id to close
*/
async function checkBlockCloseBlock(shippmentId) {
    let shippmentDb = global.conn.collection("shipments")
    return new Promise(function(resolve, reject) {

        shippmentDb.findOne({ _id: ObjectId(shippmentId) }).then((shippingInfo) => {

            if (shippingInfo.doneCount == shippingInfo.totalPlanned) {
                shippmentDb.updateOne({ _id: ObjectId(shippmentId) }, { $set: { active: false } }, { upsert: false }).then(resp_active => {
                    if (resp_active.result.nModified == 1) {

                        //TODO save file
                        resolve({
                            "status": "success",
                            "data": "DEACTIVATED"
                        })


                    } else {
                        resolve({
                            "status": "fail",
                            "data": "DEACTIVATIONFAILED"
                        })
                    }
                })
            } else {
                resolve({
                    "status": "success",
                    "data": {
                        description: "BLOCK_CHECKED",
                        data: shippingInfo
                    }
                })
            }



        })

    })

}

/**
* Add one to delivered packages when the package is delivered
* @param {String} shippmentId is the shippment id to add to the delivered packages
*/
async function updatePlusDone(shippmentId) {
    let shippmentDb = global.conn.collection("shipments")
    return new Promise(function(resolve, reject) {
        shippmentDb.updateOne({ _id: ObjectId(shippmentId) }, { $inc: { doneCount: +1 } }, { upsert: false }).then(resp_inter => {



            if (resp_inter.result.nModified == 1) {

                shippmentDb.findOne({ _id: ObjectId(shippmentId) }).then((shippingInfo) => {

                    if (shippingInfo.doneCount == shippingInfo.totalPlanned) {
                        resolve({
                            "status": "success",
                            "data": "NEEDDEACTIVATION"
                        })
                    } else {
                        resolve({ "status": "success", "data": "INSERTED_SECOND SIGN" })
                    }



                })

            } else {
                reject({ "status": "error", "data": "WRONGTOKENORUNKNOWERROR2" }) //TODO: do better status
            }
        })
    })

}

/**
 * Signs the delivery of a package
 * @param {String} signature is the digital signature os the shipper
 * @param {String} shippemntId is the shippment id to add the signature
 */
async function signSignature(signature, shippmentId) {
    let shippmentDb = global.conn.collection("shipments")
    return new Promise(function(resolve, reject) {
        shippmentDb.updateOne({ _id: ObjectId(shippmentId) }, { $push: { signatures: signature } }, { upsert: false }).then(resp => {

            if (resp.result.nModified == 1) {
                updatePlusDone(shippmentId).then(() => {
                    checkBlockCloseBlock(shippmentId).then((resp) => resolve(resp))
                })

            } else {
                reject({ "status": "error", "data": "WRONGTOKENORUNKNOWERROR2" }) //TODO: do better status
            }
        })
    })
}



module.exports = { getAllActiveShippment, insertNewShippment, insertUpdate, signSignature, checkBlockCloseBlock }
