'use strict';

// utility for handling Json Web Tokens
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createToken = function (user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.jwt_password, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

exports.decodeToken = function (token) {
  var userInfo = {};
  try {
    var decoded = jwt.verify(token, process.env.jwt_password,);
    userInfo.userId = decoded.id;  // get the userID and email
    userInfo.email = decoded.email;
  } catch (e) {
  }

  return userInfo;
};

exports.validate = async function(decoded, request) {
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return { isValid: false };
    } else {
      return { isValid: true };
    }
  };