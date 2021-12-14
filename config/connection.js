const MongoClient = require('mongodb').MongoClient
const collection = require('./collection')
const config = require('../config.js')
require('dotenv').config()

const state = {
    db: null
}

module.exports.connect = function (done) {
        const url = config.DB_URL
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
