 const requireLogin= require('../middlewares/requireLogin'),
       requireCredits= require('../middlewares/requireCredits');
       mongoose= require('mongoose'),
       Mailer= require ('../services/Mailer'),
       surveyTemplate= require ('../services/emailTemplates/surveyTemplate');

       const Survey= mongoose.model('surveys');

       module.exports = app =>{

        app.get('/api/surveys/thanks',(req,res)=>{
            res.send('Thanks for voting');
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