//Login Authentication

/*
req.user property verifies that whether the user is coming in logged in or not.
If the user is logged in, then req.user is populated and not populated in case of not logged in
 */
async function isLoggedIn(req, res, next) {
    if(req.user)
    {
        return next()
    }
    res.redirect('/')
}

module.exports = isLoggedIn