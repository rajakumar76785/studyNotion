const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require('../mail/templates/emailVerificationTemplate');
const nodemailer = require('nodemailer');
require('dotenv').config();

const OTPSchema = new mongoose.Schema({

       email:{
            type:String,
            required:true,
       },
       otp:{
            type:String,
            required:true,
       },
       createdAt:{
            type:Date,
            default: Date.now(),
            expires: 5*60*1000*100,
       }

});

//a function to send mail

async function sendVerificationEmail(email, otp){
     try{
          const mailResponse = await mailSender(email,"Verification Email from StudyNotion",emailTemplate(otp));
          console.log("Email Sent Successfully: ", mailResponse);
     }catch(error){
          console.log("error while sending mail ",error);
          throw error;
     }
}

OTPSchema.pre("save", async function(next) {
     console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

/*
OTPSchema.post('save',async function (doc){
     try{
         console.log("Doc is this",doc);
         //create transporter
         let transporter = nodemailer.createTransport({
             host: process.env.MAIL_HOST,
             auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
             },
             tls: {
               rejectUnauthorized: false // Allow self-signed certificates
             }
         });
 
         let info = await transporter.sendMail({
             from:'Raja Kumar',
             to:doc.email,
             subject:"regarding otp",
             html: emailTemplate(doc.otp),
         });
         console.log("INFO",info);
     }catch(error){
         console.error(error);
     }
 })
 */

module.exports = mongoose.model("OTP",OTPSchema);