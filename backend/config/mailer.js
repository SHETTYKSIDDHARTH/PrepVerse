import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail's SMTP server
  auth: {
    user: process.env.EMAIL_USER,  // Your email address (e.g., 'youremail@gmail.com')
    pass: process.env.EMAIL_PASS,  // Your email password or app password
  },
});

// Send email function
export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: to,                       
    subject: subject,             
    text: text                    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
