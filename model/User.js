const mongoose = require('../config/mongoose')

var userData = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        gender: String,
    },

    github: {
        id: String,
        token: String,
        email: String,
        name: String,
        gender: String,
    }
})

module.exports = mongoose.model('User', userData)