const express  = require("express")
const session  = require('express-session')
const app = express()

//Views
app.set("view engine", "ejs")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


//Schema
const facebookUser = require('./model/FacebookUser')


//Passport
const {passport, faceBookStrategy} = require('./middleware/passport')
app.use(session({secret: 'SECRET', resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())


//Passport Facebook functions repository
const passportFacebook = require('./repositories/passportFacebook')
const passportFacebookFunctions = passportFacebook({passport, faceBookStrategy, facebookUser})
passportFacebookFunctions.faceBookStrategy
passportFacebookFunctions.serializeUser
passportFacebookFunctions.deSerializeUser


//Routes
app.use('/', require('./routes/home'))
app.use('/auth/facebook', require('./routes/facebook'))
app.use('/facebook', require("./routes/facebook"))

app.listen(3000, () =>{
    console.log("Listening on port 3000")
})

module.exports = app