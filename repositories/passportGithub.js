const dotenv = require("dotenv")
dotenv.config()

module.exports = ({passport, gitHubStrategy, gitHubUser}) => {
    return Object.freeze({
    gitHubStrategy: passport.use(new gitHubStrategy({
            clientID: process.env.GITHUB_APP_ID,
            clientSecret: process.env.GITHUB_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
            profileFields: ['id', 'name', 'email', 'gender']
        }, 
        (token, refreshToken, profile, done) =>{
            process.nextTick(() =>{
                gitHubUser.findOne({ 'uid': profile.id}, (err,user) => {
                    if(err) return done(err)

                    if(user)
                    {
                        console.log("Github User does exist")
                        return done(null, user)
                    }
                    else
                    {
                        var ghUser = new gitHubUser()
                        ghUser.uid = profile.id,
                        ghUser.token = token,
                        ghUser.email = profile.emails[0].value,
                        ghUser.name = profile.displayName,
                        ghUser.gender = profile.gender
            
                        ghUser.save((err) => {
                            if(err) throw err
                            return done(null, ghUser)
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