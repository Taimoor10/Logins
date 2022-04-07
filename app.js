const express = require("express")
const session = require('express-session')
const cookieParser = require("cookie-parser")
const app = express()
const {passport, faceBookStrategy, gitHubStrategy, googleStrategy} = require('./middleware/passport')

//Schema
const User = require('./model/User')


//Passport Facebook functions repository

const passportFacebook = require('./repositories/passportFacebook')
const passportFacebookFunctions = passportFacebook({passport, faceBookStrategy, User})


//Passport Github functions repository

const passportGithub = require('./repositories/passportGithub')
const passportGithubFunctions = passportGithub({passport, gitHubStrategy, User})

//Google Functions repository

const passportGoogle = require('./repositories/passportGoogle')
const passportGoogleFunctions = passportGoogle({passport, googleStrategy, User})


//Setting views and body parser

app.set("view engine", "ejs")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cookieParser())


//Passport and Session settings

app.use(session({secret: 'SECRET', resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

passportFacebookFunctions.serializeUser
passportFacebookFunctions.deSerializeUser
passportGithubFunctions.serializeUser
passportGithubFunctions.deSerializeUser
passportGoogleFunctions.serializeUser
passportGoogleFunctions.deSerializeUser

passportFacebookFunctions.faceBookStrategy
passportGithubFunctions.gitHubStrategy
passportGoogleFunctions.googleStrategy


//Routes
app.use('/', require('./routes/home'))

/*Facebook*/
app.use('/auth/facebook', require('./routes/facebook'))

/*Github*/
app.use('/auth/github', require('./routes/github'))

/*Google*/
app.use('/auth/google', require('./routes/google'))


//Logout from all Accounts
app.use('/logout', (req,res) => {
    req.logOut()
    res.redirect('/')
})

//Server
app.listen(3000, () =>{
    console.log("Listening on port 3000")
})

module.exports = app