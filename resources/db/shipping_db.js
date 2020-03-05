/**
 * Get all shippments active for current blockchain
 */
async function getAllActiveShippment() {
    return new Promise(function(resolve, reject) {
        global.conn.collection("shipments").find({ active: 1 }).project({ _id: 1 }).toArray((err, shippmentsInfo) => {
            resolve({ "status": "success", "data": shippmentsInfo })
        })
    })
}

/**
 * Get all shippments active for current blockchain
 */
async function insertNewShippment(shippment) {
    return new Promise(function(resolve, reject) {
        global.conn.collection("shipments").insertOne(shippment, (error, resp) => {
            if (error) {
                reject({ "status": "error", "data": error })
            }

            resolve({ "status": "success", "data": "INSERTED" })
        })
    })
}

module.exports = { getAllActiveShippment, insertNewShippment }