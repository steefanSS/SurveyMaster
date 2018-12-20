const mongoose = require('mongoose');
const {Schema}= mongoose;
const RecipientSchema= require('./Recipient');

//Recipients are sub-document collection. Also we referencing each Survey model to User model for practical reason.
//mongodb has limited size of a document, so this way we are assuring that Users who are creating a lot of surveys
//don't hit the limit

const surveySchema = new Schema({
    title: String,
    body: String,
    subject: String,
    recipients: [RecipientSchema],
    yes:{type:Number, default:false},
    no:{type:Number, default:false},
    _user:{type: Schema.Types.ObjectId, ref:'User'},
    dateSent:Date,
    lastResponded:Date
});

mongoose.model('surveys', surveySchema);