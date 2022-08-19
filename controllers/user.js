const { validateEmail, validateLength, validateUsername } = require('../helpers/validation');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/tokens');
const { sendVerificationEmail } = require('../helpers/mailer');

exports.register = async (req, res) => {
   try {
      const { first_name, last_name, email, username, password, bYear, bMonth, bDay, gender } = req.body;

      if (!validateEmail(email)) {
         return res.status(400).json({
            message: 'Invalid email address',
         });
      }

      const check = await User.findOne({ email });
      if (check) {
         return res.status(400).json({
            message: 'This email address already exists, try with a different email address',
         });
      }

      if (!validateLength(first_name, 3, 15)) {
         return res.status(400).json({
            message: 'First name must be between 3 to 15 characters',
         });
      }

      if (!validateLength(last_name, 3, 15)) {
         return res.status(400).json({
            message: 'Last name must be between 3 to 15 characters',
         });
      }

      if (!validateLength(password, 6, 20)) {
         return res.status(400).json({
            message: 'Password must be between 3 to 15 characters',
         });
      }

      const cryptedPassword = await bcrypt.hash(password, 12);
      let tempUsername = first_name + last_name;
      let newUsername = await validateUsername(tempUsername);

      const user = await new User({
         first_name, last_name, email, username: newUsername, password: cryptedPassword, bYear, bMonth, bDay, gender,
      }).save();

      const emailVerificationToken = generateToken({ id: user._id.toString() }, '30m');

      const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`; console.log("url here===> ", url)
      sendVerificationEmail(user.email, user.first_name, url);
      const token = generateToken({ id: user._id.toString() }, '7d')
      res.send({
         id: user._id,
         username: user.username,
         picture: user.picture,
         first_name: user.first_name,
         last_name: user.last_name,
         token: token,
         verified: user.verified,
         message: 'Registration successfull. Activation email has been sent to your email. Please activate your account.'
      })

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}