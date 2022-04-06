//Login Authentication
async function isLoggedIn(req, res, next) {
    if(req.user)
    {
        return next()
    }
    res.redirect('/')
}

module.exports = isLoggedIn