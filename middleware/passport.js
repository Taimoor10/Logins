const passport = require("passport")
const faceBookStrategy = require('passport-facebook').Strategy
const gitHubStrategy = require('passport-github2').Strategy  

module.exports = {passport, faceBookStrategy, gitHubStrategy}
