const dotenv = require("dotenv")
dotenv.config()

module.exports = ({passport, faceBookStrategy, User}) => {
    return Object.freeze({
    faceBookStrategy: passport.use(new faceBookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'name', 'email', 'gender']
        }, 
        (req, token, refreshToken, profile, done) => {
            process.nextTick(() =>{
                if(!req.user){
					User.findOne({'facebook.id': profile.id}, function(err, user){
		    			if(err)
		    				return done(err);
		    			if(user)
                        {
                            console.log("Facebook User does exist")
		    				return done(null, user)
                        }
		    			else {
		    				var fbUser = new User()
		    				fbUser.facebook.id = profile.id
		    				fbUser.facebook.token = token
		    				fbUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
		    				fbUser.facebook.email = profile.emails[0].value

		    				fbUser.save(function(err){
		    					if(err)
		    						throw err;
		    					return done(null, fbUser)
		    				})
		    			}
		    		});
	    		}

	    		else {

	    			var fbUser = req.user
	    			fbUser.facebook.id = profile.id
	    			fbUser.facebook.token = token
	    			fbUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
	    			fbUser.facebook.email = profile.emails[0].value

	    			fbUser.save(function(err){
	    				if(err)
	    					throw err
	    				return done(null, fbUser);
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