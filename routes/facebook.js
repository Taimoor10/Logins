const router = require("express").Router()
const{passport} = require("../middleware/passport")
const isLoggedIn = require('../middleware/authorization')
module.exports = router

//Facebook Login
router.get('/login', passport.authenticate(
    'facebook', 
    {
        scope: 'email, user_photos'
    }
))

//Facebook Authentication
router.get('/profile', isLoggedIn, async(req,res) => {
    res.render('profile', {
        user: req.user,
        provider: 'facebook'
    })
})

//Facebook Callback
router.get('/callback', passport.authenticate(
    'facebook',
    {
        successRedirect: '/facebook/profile',
        failureRedirect: '/home'
    }
))