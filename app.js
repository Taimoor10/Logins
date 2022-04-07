const express = require("express")
const session = require('express-session')
const cookieParser = require("cookie-parser")
const app = express()

//Views
app.set("view engine", "ejs")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cookieParser())

//Schema
const User = require('./model/User')

//Passport
const {passport, faceBookStrategy, gitHubStrategy, googleStrategy} = require('./middleware/passport')
app.use(session({secret: 'SECRET', resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())


//Passport Facebook functions repository
const passportFacebook = require('./repositories/passportFacebook')
const passportFacebookFunctions = passportFacebook({passport, faceBookStrategy, User})
passportFacebookFunctions.serializeUser
passportFacebookFunctions.faceBookStrategy


//Passport Github functions repository
const passportGithub = require('./repositories/passportGithub')
const passportGithubFunctions = passportGithub({passport, gitHubStrategy, User})
passportGithubFunctions.serializeUser
passportGithubFunctions.gitHubStrategy


//Google Functions repository
const passportGoogle = require('./repositories/passportGoogle')
const passportGoogleFunctions = passportGoogle({passport, googleStrategy, User})
passportGoogleFunctions.serializeUser
passportGoogleFunctions.googleStrategy

//Routes

/*Facebook*/
app.use('/', require('./routes/home'))
app.use('/auth/facebook', require('./routes/facebook'))

/*Github*/
app.use('/auth/github', require('./routes/github'))

/*Google*/
app.use('/auth/google', require('./routes/google'))


//Logout from all Accounts
app.use('/logout', (req,res) => {
    passportFacebookFunctions.deSerializeUser
    passportGithubFunctions.deSerializeUser
    passportGoogleFunctions.deSerializeUser

    // req.session.destroy(function (err) {
    //       res.redirect('/');
    // });

    res.redirect('/')
})

//Server
app.listen(3000, () =>{
    console.log("Listening on port 3000")
})

module.exports = app