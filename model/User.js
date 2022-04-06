const mongoose = require('../config/mongoose')

var userData = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
    },

    github: {
        id: String,
        token: String,
        email: String,
        name: String,
    },

    google: {
        id: String,
        token: String,
        email: String,
        name: String,
    }
})

module.exports = mongoose.model('User', userData)