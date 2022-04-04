const router = require("express").Router()
const{passport} = require("../middleware/passport")
module.exports = router

//Facebook Login
router.get('/login', passport.authenticate(
    'facebook', 
    {
        scope: 'email, user_photos'
    }
))

//Facebook Authentication
router.get('/profile', isLoggedIn, (req,res) => {
    console.log(req.user)
    res.render('profile', {
        user: req.user
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

//Facebook Logout
router.get('/logout', (req,res) =>{
    req.logout()
    res.redirect('/')
})

//Login Authentication
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next()
    res.redirect('/')
}
