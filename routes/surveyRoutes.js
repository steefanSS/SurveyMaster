 const requireLogin= require('../middlewares/requireLogin'),
       _ = require ('lodash'),
       Path = require('path-parser'),
       {URL} = require('url'),
       requireCredits= require('../middlewares/requireCredits'),
       mongoose= require('mongoose'),
       Mailer= require ('../services/Mailer'),
       surveyTemplate= require ('../services/emailTemplates/surveyTemplate');

       const Survey= mongoose.model('surveys');

       module.exports = app =>{

        app.get('/api/surveys',requireLogin, async (req,res)=>{
           const surveys= await Survey.find({_user: req.user.id})
               .select({recipients:false});

           res.send(surveys);
        });

        app.get('/api/surveys/:surveyId/:choice',(req,res)=>{
            res.send('Thanks for voting');
        });

        app.post('/api/surveys/webhooks',(req,res) =>{
            //this way there is no need to create a new helper for every iteration through the loop
            const p = new Path('/api/surveys/:surveyId/:choice');
             _.chain(req.body)
                 .map(({email,url})=>{
                    //we take full url and only extract /api/surveys/(surveys.id)/yes(or no)
                 const match = p.test(new URL(url).pathname);
                 if(match){
                     return {email,surveyId:match.surveyId,choice:match.choice}
                 }
                })
                 .compact()
                 .uniqBy('email','surveyId')
                 .each(({surveyId, email,choice}) =>{
                     Survey.updateOne({
                         _id:surveyId,
                         recipients: {
                             $elemMatch: {email: email,responded: false}
                         }
                     },{
                         $inc: {[choice]:1},
                         $set: {'recipients.$.responded': true},
                         lastResponded:new Date()
                     }).exec();
                 })
                 .value();

             res.send({});
           });

        app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
               const { title, subject, body, recipients } = req.body;

               const survey = new Survey({
                   title,
                   subject,
                   body,
                   recipients: recipients.split(',').map(email => ({ email: email.trim() })),
                   _user: req.user.id,
                   dateSent: Date.now()
               });
        //Great place to send an email - we are passing an object that contains subject  and recipient property
            // as a second parameter we are sending content of the actual email 'body'
            const mailer= new Mailer(survey, surveyTemplate(survey));

            try{
            await mailer.send();
            await survey.save();

            //sending back a user with update amount of credits, so that our header can update
            req.user.credits -=1;
            const user = await req.user.save();
            res.send(user);
            }catch (e) {
                res.status(422).send(e);
            }

    });
 };