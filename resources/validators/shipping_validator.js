async function validateTransactionObject(transactions) {
    return new Promise(function(resolve, reject) {
        transactions.forEach(element => {
            if (element.transactionType == 0 && element.productBrand != undefined && element.productType != undefined, element.geolocation != undefined, element.quantity != undefined) {
                resolve()
            } else reject();
        });
    })
}

module.exports = { validateTransactionObject }