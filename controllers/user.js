const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {generateToken} = require('../helpers/tokens');
const {sendVerificationEmail} = require('../helpers/mailer');
const {validateEmail, validateLength, validateUsername} = require('../helpers/validation');

// user register
exports.register = async (req, res) => {
   try {
      const {first_name, last_name, email, username, password, bYear, bMonth, bDay, gender} = req.body;

      if (!validateEmail(email)) {
         return res.status(400).json({
            message: 'Invalid email address',
         });
      }

      const check = await User.findOne({email});
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

      const emailVerificationToken = generateToken({id: user._id.toString()}, '10m');

      const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
      sendVerificationEmail(user.email, user.first_name, url);
      const token = generateToken({id: user._id.toString()}, '7d')
      res.send({
         id: user._id,
         username: user.username,
         picture: user.picture,
         first_name: user.first_name,
         last_name: user.last_name,
         token: token,
         verified: user.verified,
         message: 'Registration successfull. Activation email has been sent to your email. Please activateForm your account.'
      })

   } catch (error) {
      res.status(500).json({message: error.message});
   }
}

// activateForm user account
exports.activateAccount = async (req, res) => {
   try {
      const requestedUser = req.user.id;
      const {token} = req.body;
      const user = jwt.verify(token, process.env.TOKEN_SECRET);
      if (requestedUser !== user.id) {
         return res.status(400).json({message: "You don't have the authorization to complete this action!"})
      }
      const check = await User.findById(user.id);
      if (check.verified) {
         return res.status(400).json({message: 'This email has already been activated!'})
      } else {
         await User.findByIdAndUpdate(user.id, {verified: true});
         return res.status(200).json({message: 'Account has been activated successfully!'});
      }
   } catch (error) {
      res.status(500).json({message: error.message});
   }
}

// login user
exports.login = async (req, res) => {
   try {
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if (!user) {
         return res.status(400).json({message: 'User not found'});
      }
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
         return res.status(400).json({message: 'Invalid credentials. Please try again.'});
      }
      const token = generateToken({id: user._id.toString()}, '7d')
      res.send({
         id: user._id,
         username: user.username,
         picture: user.picture,
         first_name: user.first_name,
         last_name: user.last_name,
         token: token,
         verified: user.verified,
      })
   } catch (error) {
      res.status(500).json({message: error.message});
   }
}

// auth
exports.auth = async (req, res) => {
   res.json("welcome")
}