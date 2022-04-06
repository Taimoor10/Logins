const dotenv = require("dotenv")
dotenv.config()

module.exports = ({passport, googleStrategy, User}) => {
    return Object.freeze({
    googleStrategy: passport.use(new googleStrategy({
            clientID: process.env.GOOGLE_APP_ID,
            clientSecret: process.env.GOOGLE_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'email', 'gender']
        }, 
        (req, token, refreshToken, profile, done) =>{
            process.nextTick(() =>{
            if(!req.user)
            {
                User.findOne({ 'google.id': profile.id}, (err,user) => {
                    if(err) 
                        return done(err)
                    if(user)
                    {
                        //For No Token
                        if(!user.google.token)
                        {
                            user.google.token = token
                            user.google.id = profile.id
                            user.google.name = profile.displayName
                            user.google.email = profile.emails[0].value
                            
                            user.save((err) => {
                                if(err) throw err
                            })
                        }
                        return done(null, user)
                    }
                    else
                    {
                        var googleUser = new User()
                        googleUser.google.id =  profile.id,
                        googleUser.google.token = token,
                        googleUser.google.email = profile.emails[0].value,
                        googleUser.google.name = profile.displayName
            
                        googleUser.save((err) => {
                            if(err) throw err
                            return done(null, googleUser)
                        })
                    }
                })
            }
            else
            {
                var googleUser = req.user
                googleUser.google.id =  profile.id
                googleUser.google.token = token
                googleUser.google.email = profile.emails[0].value
                googleUser.google.name = profile.displayName

                googleUser.save(function(err){
                    if(err)
                        throw err
                    return done(null, googleUser);
                })
            }
        })
    })),
    
    serializeUser: passport.serializeUser(async (user, done) => {
            done(null, user.id)
        }),
    
    deSerializeUser: passport.deserializeUser(async (id, done) => {
            User.findById(id, (err,user) =>{
                done(err, user)
            })
        })
    })
}