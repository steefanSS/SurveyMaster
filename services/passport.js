const passport = require ('passport'),
      GoogleStrategy = require('passport-google-oauth20').Strategy,
      mongoose= require('mongoose'),
      keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user,done)=> {
    done(null, user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id)
        .then(user => {
            done(null,user)
        });
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy:true
},
    async (accessToken,refreshToken,profile,done)=>{
    const existingUser= await User.findOne({googleID:profile.id})

            if(existingUser){
                //we already have a record with a give profile id
                done(null, existingUser);
            }else {
                //we don't have a record with a given profile id, create new
                const user = await new User ({googleID:profile.id}).save();
            done(null,user);
            }

}));