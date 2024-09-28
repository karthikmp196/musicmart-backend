const nodemailer = require('nodemailer')

const sendOtpMail=async(email,otp)=>{
    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.SENDER_EMAIL,
            pass:process.env.SENDER_EMAIL_PASSWORD
        }
    });
    try{
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Email verification',
            html:
            `<b>your email verification otp is ${otp}</b>`
        }
    

    transporter.sendMail(mailOptions,function(err,info){
        if(err)
            console.log(err);
        else{
            console.log("email sent successfully");
        }
            
      })
}
catch (error) {
    console.log('Error sending email: ', error);
    throw error;
    }
};

module.exports = sendOtpMail
    