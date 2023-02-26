const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const oauth_link = 'https://developers.google.com/oauthplayground';
const {EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH} = process.env;

// auth object
const auth = new OAuth2(MAILING_ID, MAILING_SECRET, MAILING_REFRESH, oauth_link);

// common function
const setRequiredCredentialsAndSendEmail = (email, subject, htmlBody) => {
   auth.setCredentials({
      refresh_token: MAILING_REFRESH,
   });
   const accessToken = auth.getAccessToken();
   const stmp = nodemailer.createTransport({
      service: 'gmail', auth: {
         type: 'OAuth2',
         user: EMAIL,
         clientId: MAILING_ID,
         clientSecret: MAILING_SECRET,
         refreshToken: MAILING_REFRESH,
         accessToken,
      },
   });
   const mailOptions = {
      from: EMAIL,
      to: email,
      subject: subject,
      html: htmlBody,
   };
   stmp.sendMail(mailOptions, (err, res) => {
      if (err) return err;
      return res;
   });
}

// send verification email
exports.sendVerificationEmail = (email, name, url) => {
   const subject = 'Facebook email verification';
   const htmlBody = `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5990"><img style="width:30px" src="https://i.ibb.co/D86rBdF/logo.png" alt="facebook"><span>Action required: Activate your facebook account.</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141023;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You have recently created an account on Facebook. To complete your registration, please confirm your account.</span></div><a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;text-decoration:none;color:#fff;font-weight:600">Confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to stay in touch with all of your friends, once registered on facebook, you can share photos, organize events and much more.</span></div></div>`;
   return setRequiredCredentialsAndSendEmail(email, subject, htmlBody);
};

// send verification code for reset password
exports.sendVerificationCode = (email, name, code) => {
   const subject = 'Reset Facebook password';
   const htmlBody = `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5990"><img style="width:30px" src="https://i.ibb.co/D86rBdF/logo.png" alt="facebook"><span>Action required: Activate your facebook account.</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141023;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You have recently created an account on Facebook. To complete your registration, please confirm your account.</span></div><a style="width:200px;padding:10px 15px;background:#4c649b;text-decoration:none;color:#fff;font-weight:600">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to stay in touch with all of your friends, once registered on facebook, you can share photos, organize events and much more.</span></div></div>`;
   return setRequiredCredentialsAndSendEmail(email, subject, htmlBody);
};

