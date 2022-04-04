const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/facebooklogin", {
    useNewUrlParser : true,
    useUnifiedTopology: true
})

var facebookUserSchema = mongoose.Schema({
    uid: String,
    token: String,
    email: String,
    name: String,
})

module.exports = mongoose.model('FacebookUser', facebookUserSchema)