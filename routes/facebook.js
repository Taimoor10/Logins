const router = require("express").Router()
const{passport} = require("../middleware/passport")
const isLoggedIn = require('../middleware/authorization')
module.exports = router

//Facebook Login
router.get('/', passport.authenticate(
    'facebook',
    {
        scope: 'email, user_photos'
    }
))

//Facebook Authentication
router.get('/profile', isLoggedIn, async(req,res) => {
    res.render('profile', {
        user: req.user
    })
})

//Facebook Account Link
router.get('/connect', passport.authorize(
    'facebook',
    {
        scope: 'email, user_photos'
    }
))

//Facebook Account Unlink
router.get('/unlink', (req,res) => {
    var user = req.user

    user.facebook.token = null
    user.save((err) => {
        if(err) throw err
        res.redirect('/facebook/profile')
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