const dotenv = require("dotenv")
dotenv.config()

const alert = require('alert')

module.exports = ({passport, gitHubStrategy, User}) => {
    return Object.freeze({
    gitHubStrategy: passport.use(new gitHubStrategy({
            clientID: process.env.GITHUB_APP_ID,
            clientSecret: process.env.GITHUB_APP_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'email', 'gender']
        }, 
        (req, token, refreshToken, profile, done) =>{
            process.nextTick(() =>{

                //Checks if User is already registered with Facebook provider

                User.find({'facebook.email' : profile.emails[0].value }, (err, res) => {
                    if(err) throw err
                    
                    if(res.length != 0)
                    {
                        alert('This email has already signed in with Facebook provider')
                    }
                })

                //Checks if User is already registered with Google provider

                User.find({'google.email' : profile.emails[0].value }, (err, res) => {
                    if(err) throw err
                    
                    if(res.length != 0)
                    {
                        alert('This email has already signed in with Google provider')
                    }
                })

            if(!req.user)
            {
                //If the user has not logged in yet from Github

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
                        //Create new User
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
                //Update the existing User
                
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