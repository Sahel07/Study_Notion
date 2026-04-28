const mongoose = require("mongoose");
const mailSender = require('../utilis/mailSender');

const otpSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp: {
        type:String, 
        required:true,
    },
    createdAt: {
        type:Date,
       default:Date.now(),
       expires:5*60,
    }

  
});

async function sendVerificationEmail(email, otp) {
    //Create a transporter to send emails

    //Define the email options

    //send the email
    try {
        const mailResponse = await mailSender(
            email, 
            "Verification Email from StudyNotion", 
         otp
        );
        console.log("Email sent successfully", mailResponse);
    } catch (error) {
        console.log("Error occured while sending verification email", error);
        throw error;
    } 
}

//Defining a post-save hook to send email after the document has been saved
otpSchema.pre("save", async function(next) {
    console.log("New document saved to the database");

    //only send an email when a new document is created 
   
        await sendVerificationEmail(this.email, this.otp);
    
    next();
}) 

module.exports=mongoose.model("OTP",otpSchema); 