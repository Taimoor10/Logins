const mongoose = require('../config/mongoose')

var facebookUserSchema = mongoose.Schema({
    uid: String,
    token: String,
    email: String,
    name: String,
    gender: String,
})

module.exports = mongoose.model('FacebookUser', facebookUserSchema)