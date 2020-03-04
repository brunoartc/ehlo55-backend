var url = "mongodb://localhost:27017/";
var mongoClient = require("mongodb").MongoClient;
mongoClient.connect(url)
    .then(conn => global.conn = conn.db("ehlo"))
    .catch(err => console.log(err))