const router = require("express").Router()
const isLoggedIn = require('../middleware/authorization')
const{passport} = require("../middleware/passport")
module.exports = router

//Google Authorization
router.get('/', passport.authenticate(
    'google', 
    {
        scope: ['email', 'profile']
    }
))

//Google Profile
router.get('/profile', isLoggedIn, (req,res) => {
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

//Google Account Unlink
router.get('/unlink', (req,res) => {
    var user = req.user

    //Sets the token property to null to disconnect the user

    user.google.token = null
    user.save((err) => {
        if(err) throw err
        res.redirect('/auth/google/profile')
    })
})

//Google Callback
router.get('/callback', passport.authenticate(
    'google',
    {
        successRedirect: '/auth/google/profile',
        failureRedirect: '/home'
    }
))