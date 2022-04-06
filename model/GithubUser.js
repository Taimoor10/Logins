const mongoose = require('../config/mongoose')

var githubUserSchema = mongoose.Schema({
    uid: String,
    token: String,
    email: String,
    name: String,
    gender: String,
})

module.exports = mongoose.model('GithubUser', githubUserSchema)