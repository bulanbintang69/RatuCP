const MongoClient = require('mongodb').MongoClient
const collection = require('./collection')
require('dotenv').config()

const state = {
    db: undefined
}

module.exports.connect = function (done) {
        const url = process.env.DB_URL
        const dbname = 'RatuMediaFile'

    MongoClient.connect(url,{ useUnifiedTopology: true } , (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })

    
}

module.exports.get = function () {
    return state.db
}