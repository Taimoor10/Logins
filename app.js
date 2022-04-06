const express  = require("express")
const session  = require('express-session')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const cookieSession = require('cookie-session')
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
const {passport, faceBookStrategy, gitHubStrategy} = require('./middleware/passport')
app.use(session({secret: 'SECRET', resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())


//Passport Facebook functions repository
const passportFacebook = require('./repositories/passportFacebook')
const passportFacebookFunctions = passportFacebook({passport, faceBookStrategy, User})
passportFacebookFunctions.serializeUser
passportFacebookFunctions.deSerializeUser
passportFacebookFunctions.faceBookStrategy


//Passport Github functions repository
const passportGithub = require('./repositories/passportGithub')
const passportGithubFunctions = passportGithub({passport, gitHubStrategy, User})
passportGithubFunctions.serializeUser
passportGithubFunctions.deSerializeUser
passportGithubFunctions.gitHubStrategy


//Routes
/*Facebook*/
app.use('/', require('./routes/home'))
app.use('/auth/facebook', require('./routes/facebook'))
app.use('/facebook', require("./routes/facebook"))

/*Github*/
app.use('/auth/github', require('./routes/github'))
app.use('/github', require('./routes/github'))

//Logout
app.use('/logout', (req,res) => {
    req.session = null
    req.logout()
    res.redirect('/')
})

app.listen(3000, () =>{
    console.log("Listening on port 3000")
})

module.exports = app