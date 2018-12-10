const express = require ('express'),
      mongoose = require ('mongoose'),
      keys = require('./config/keys'),
      cockieSession= require('cookie-session'),
      passport= require('passport'),
      bodyParser= require('body-parser');

//because we are not exporting module, returning anything (also order matters)
require ('./models/User');
require('./services/passport');



mongoose.connect(keys.mongoURI,{useNewUrlParser:true});

const app =express();

app.use(bodyParser.json());
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
require('./routes/billingRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    //Express will serve app production assets
    app.use(express.static('client/build'));

    //Express will server up the index.html file
    //if it doesn't recognize route
    const path= require ('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })

}

//Heroku dynamic port binding
const PORT =process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is listening port :",PORT);
