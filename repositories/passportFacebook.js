const dotenv = require("dotenv")
dotenv.config()

module.exports = ({passport, faceBookStrategy, facebookUser}) => {
    return Object.freeze({
    faceBookStrategy: passport.use(new faceBookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'name', 'email', 'gender']
        }, 
        (token, refreshToken, profile, done) =>{
            process.nextTick(() =>{
                facebookUser.findOne({ 'uid': profile.id}, (err,user) => {
                    if(err) return done(err)

                    if(user)
                    {
                        console.log("Facebook User does exist")
                        return done(null, user)
                    }
                    else
                    {
                        var fbUser = new facebookUser()
                        fbUser.uid = profile.id,
                        fbUser.token = token,
                        fbUser.email = profile.emails[0].value,
                        fbUser.name = profile.name.givenName + ' ' + profile.name.familyName,
                        fbUser.gender = profile.gender
            
                        fbUser.save((err) => {
                            if(err) throw err
                            return done(null, fbUser)
                        })
                    }
                })
            })
        })),
    
    serializeUser: passport.serializeUser(async (user, done) => {
            done(null, user.id)
        }),
    
    deSerializeUser: passport.deserializeUser(async (id, done) => {
            facebookUser.findById(id, (err,user) =>{
                done(err, user)
            })
        })
    })
}