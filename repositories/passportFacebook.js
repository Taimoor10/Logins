const dotenv = require("dotenv")
dotenv.config()

const alert = require('alert')

module.exports = ({passport, faceBookStrategy, User}) => {
return Object.freeze({
	faceBookStrategy: passport.use(new faceBookStrategy({
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK_URL,
			passReqToCallback: true,
			profileFields: ['id', 'displayName', 'name', 'email', 'gender']
		}, 
		(req, token, refreshToken, profile, done) => {
			process.nextTick(() =>{

					User.find({'google.email' : profile.emails[0].value }, (err, res) => {
						if(err) throw err
	
						if(res.length != 0)
						{
							alert('This email has already signed in with Google provider')
						}
					})

					User.find({'github.email' : profile.emails[0].value }, (err, res) => {
						if(err) throw err
				
						if(res.length != 0)
						{
							alert('This email has already signed in with Github provider')
						}
					})

				if(!req.user){
					User.findOne({'facebook.id': profile.id}, function(err, user){
						if(err)
							return done(err);
						if(user)
						{	
							//For No Token
							if(!user.facebook.token)
							{
								user.facebook.token = token
								user.facebook.id = profile.id
								user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
								user.facebook.email = profile.emails[0].value
								
								user.save((err) => {
									if(err) throw err
								})
							}
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
					//In case of user already logged in with facebook
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