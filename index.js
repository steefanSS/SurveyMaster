const express = require ('express'),
      mongoose = require ('mongoose'),
      keys = require('./config/keys'),
      cockieSession= require('cookie-session'),
      passport= require('passport');

//because we are not exporting module, returning anything (also order matters)
require ('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI,{useNewUrlParser:true});

const app =express();
app.use(
    cockieSession({
        maxAge: 30*24*60*60*1000, //last 30 daus before it expires (in miliseconds)
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

//our auth routes
require('./routes/authRoutes')(app);

//Heroku dynamic port binding
const PORT =process.env.PORT || 5000;
app.listen(PORT)
console.log("Server is listening port :",PORT);
