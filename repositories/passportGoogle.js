const dotenv = require("dotenv")
dotenv.config()

const alert = require('alert')

module.exports = ({passport, googleStrategy, User}) => {
    return Object.freeze({
    googleStrategy: passport.use(new googleStrategy({
            clientID: process.env.GOOGLE_APP_ID,
            clientSecret: process.env.GOOGLE_APP_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
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

                //Checks if User is already registered with Github provider

                User.find({'github.email' : profile.emails[0].value }, (err, res) => {
                    if(err) throw err
                
                    if(res.length != 0)
                    {
                        alert('This email has already signed in with Github provider')
                    }
                })

            if(!req.user)
            {
                //If the user has not logged in yet from Google

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
                        //Create a new User

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
                //Update the existing User
                
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