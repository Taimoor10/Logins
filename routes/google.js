const router = require("express").Router()
const isLoggedIn = require('../middleware/authorization')
const{passport} = require("../middleware/passport")
module.exports = router

//Google Authorization
router.get('/login', passport.authenticate(
    'google', 
    {
        scope: ['email', 'profile']
    }
))

//Google Profile
router.get('/profile', isLoggedIn, (req,res) => {
    console.log(req.user)
    res.render('profile', {
        user: req.user
    })
})

//Google Account Link
router.get('/connect', passport.authorize(
    'google',
    {
        scope: ['email', 'profile']
    }
))

//Google Callback
router.get('/callback', passport.authenticate(
    'google',
    {
        successRedirect: '/google/profile',
        failureRedirect: '/home'
    }
))