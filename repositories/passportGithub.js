const dotenv = require("dotenv")
dotenv.config()

module.exports = ({passport, gitHubStrategy, User}) => {
    return Object.freeze({
    gitHubStrategy: passport.use(new gitHubStrategy({
            clientID: process.env.GITHUB_APP_ID,
            clientSecret: process.env.GITHUB_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'email', 'gender']
        }, 
        (req, token, refreshToken, profile, done) =>{
            process.nextTick(() =>{
            if(!req.user)
            {
                User.findOne({ 'github.id': profile.id}, (err,user) => {
                    if(err) 
                        return done(err)
                    if(user)
                    {
                        //For No Token
                        if(!user.github.token)
                        {
                            user.github.token = token
                            user.github.id = profile.id
                            user.github.name = profile.displayName
                            user.github.email = profile.emails[0].value
                            
                            user.save((err) => {
                                if(err) throw err
                            })
                        }
                        return done(null, user)
                    }
                    else
                    {
                        var ghUser = new User()
                        ghUser.github.id =  profile.id,
                        ghUser.github.token = token,
                        ghUser.github.email = profile.emails[0].value,
                        ghUser.github.name = profile.displayName
            
                        ghUser.save((err) => {
                            if(err) throw err
                            return done(null, ghUser)
                        })
                    }
                })
            }
            else
            {
                var ghUser = req.user
                ghUser.github.id =  profile.id
                ghUser.github.token = token
                ghUser.github.email = profile.emails[0].value
                ghUser.github.name = profile.displayName

                ghUser.save(function(err){
                    if(err)
                        throw err
                    return done(null, ghUser);
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