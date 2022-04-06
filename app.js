const express  = require("express")
const session  = require('express-session')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()

//Views
app.set("view engine", "ejs")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


//Cors
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true
}))

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
app.use('/facebook', require("./routes/facebook"))

/*Github*/
app.use('/auth/github', require('./routes/github'))
app.use('/github', require('./routes/github'))

/*Google*/
app.use('/auth/google', require('./routes/google'))
app.use('/google', require('./routes/google'))


//Logout from all Accounts
app.use('/logout', (req,res) => {
        req.logOut();
        res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    req.session.destroy(function (err) {
         res.redirect('/');
    });
})


//Server
app.listen(3000, () =>{
    console.log("Listening on port 3000")
})

module.exports = app