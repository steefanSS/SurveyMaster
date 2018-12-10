const keys = require('../config/keys'),
      stripe= require('stripe')(keys.stripSecretKey),
      requireLogin= require('../middlewares/requireLogin');


module.exports = app => {

    app.post('/api/stripe', requireLogin, async (req,res)=>{

       const charge = await stripe.charges.create({
            amount:500,
            currency:'usd',
            description:'$5 USD for 5 credits',
            source: req.body.id
        })

        //add 5 credits to user model and to make sure we using everything up to date,
        //we are using async on the same user model (they two separated objects)
        req.user.credits +=5;
        const user = await req.user.save();

        res.send(user);
    });
};