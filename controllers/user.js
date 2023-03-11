const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Code = require('../models/Code');
const {sendResponse} = require("../helpers/utils");
const {generateToken} = require('../helpers/tokens');
const {generateCode} = require("../helpers/generateCode");
const {sendVerificationEmail, sendVerificationCode} = require('../helpers/mailer');
const {validateEmail, validateLength, validateUsername} = require('../helpers/validation');

// user register
exports.register = async (req, res) => {
   try {
      const {first_name, last_name, email, password, bYear, bMonth, bDay, gender} = req.body;

      if (!validateEmail(email)) {
         return sendResponse(res, 400, 'Invalid email address');
      }

      const check = await User.findOne({email});
      if (check) {
         return sendResponse(res, 400, 'This email address already exists, try with a different email address');
      }

      if (!validateLength(first_name, 3, 15)) {
         return sendResponse(res, 400, 'First name must be between 3 to 15 characters');
      }

      if (!validateLength(last_name, 3, 15)) {
         return sendResponse(res, 400, 'Last name must be between 3 to 15 characters');
      }

      if (!validateLength(password, 6, 20)) {
         return sendResponse(res, 400, 'Password must be between 3 to 15 characters');
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

      return sendResponse(res, 200, 'Registration successful. Activation email has been sent to your email. Please activateForm your account.',
         {
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
         });

   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}

// activateForm user account
exports.activateAccount = async (req, res) => {
   try {
      const requestedUser = req.user.id;
      const {token} = req.body;
      const user = jwt.verify(token, process.env.TOKEN_SECRET);
      if (requestedUser !== user.id) {
         return sendResponse(res, 400, 'You don\'t have the authorization to complete this action!');
      }
      const check = await User.findById(user.id);
      if (check.verified) {
         return sendResponse(res, 400, 'This email has already been activated!');
      } else {
         await User.findByIdAndUpdate(user.id, {verified: true});
         return sendResponse(res, 200, 'Account has been activated successfully!');
      }
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}

// login user
exports.login = async (req, res) => {
   try {
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if (!user) {
         return sendResponse(res, 400, 'User not found');
      }
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
         return sendResponse(res, 400, 'Invalid credentials. Please try again.');
      }
      const token = generateToken({id: user._id.toString()}, '7d')
      return sendResponse(res, 200, 'Login successful.',
         {
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
         });
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}

// auth
exports.auth = async (req, res) => {
   res.json("welcome")
}

// send verification email
exports.sendVerificationEmail = async (req, res) => {
   try {
      const id = req.user.id;
      const user = await User.findById(id);
      if (user.verified) {
         return sendResponse(res, 400, 'This email has already been activated!');
      }
      const emailVerificationToken = generateToken({id: user._id.toString()}, '10m');
      const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
      sendVerificationEmail(user.email, user.first_name, url);
      return sendResponse(res, 200, 'Email verification link has been sent to your email!');
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}

// find user for resetting password
exports.findUser = async (req, res) => {
   try {
      const {email} = req.body;
      const user = await User.findOne({email}).select("-password"); // take everything without password
      if (!user) {
         return sendResponse(res, 400, 'Account does not exist!');
      }
      return sendResponse(res, 200, 'User found.',
         {
            email: user.email,
            picture: user.picture
         });
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}

// generate code and send email
exports.sendResetPasswordCode = async (req, res) => {
   try {
      const {email} = req.body;
      const user = await User.findOne({email}).select("-password");
      await Code.findOneAndRemove({user: user._id});
      const code = generateCode(5);
      await new Code({
         code,
         user: user._id,
      }).save();
      sendVerificationCode(user.email, user.first_name, code);
      return sendResponse(res, 200, "Reset password code has been sent to your email.");
   } catch (err) {
      return sendResponse(res, 500, err.message);
   }
}

// validate reset password code
exports.validateResetPasswordCode = async (req, res) => {
   try {
      const {email, code} = req.body;
      const user = await User.findOne({email});
      const dbCode = await Code.findOne({user: user._id});
      if (dbCode.code !== code) {
         return sendResponse(res, 400, "Verification code is wrong.");
      }
      return sendResponse(res, 200, "Ok.");
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}