const router = require("express").Router()
const isLoggedIn = require('../middleware/authorization')
const{passport} = require("../middleware/passport")
module.exports = router

//Github Login
router.get('/', (req,res) => {
    res.send("take this")
})

//Github Authorization
router.get('/login', passport.authenticate(
    'github', 
    {
        scope: ['user', 'user:email']
    }
))

//Github Profile
router.get('/profile', isLoggedIn, (req,res) => {
    console.log(req.user)
    res.render('profile', {
        user: req.user,
        provider: 'github'
    })
})

//Github Callback
router.get('/callback', passport.authenticate(
    'github',
    {
        successRedirect: '/github/profile',
        failureRedirect: '/home'
    }
))