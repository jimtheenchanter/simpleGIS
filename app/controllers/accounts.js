'use strict';

const Boom = require('@hapi/boom');
const User = require('../models/user');
const Joi = require('@hapi/joi');


const Accounts = {
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view('main', { title: 'Welcome to SimpleGIS' });
    }
  },

  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up for SimpleGIS' });
    }
  },

  signup: {
    auth: false,
    // validate: {
    //   payload: 
    //     {
    //     firstName: Joi.string().required(),
    //     lastName: Joi.string().required(),
    //     email: Joi.string()
    //       .email()
    //       .required(), 
    //     password: Joi.string().required()
    //     }
    //   ,
    // options: {
    //     abortEarly: false,
    //   },

    // failAction: function(request, h, error) {
    //     return h
    //       .view('signup', {
    //         title: 'Sign up error',
    //         errors: error.details
    //       })
    //       .takeover()
    //       .code(400);
    //       }
    //     },

    handler: async function(request, h) {
      try {
        const payload = request.payload; // accepts data from form
        let user = await User.findByEmail(payload.email); //declares user
        if (user) {  // check if user email already exists
          const message = 'Email address is already registered';
          throw Boom(message);
        }
        const newUser = new User({ //create new user based on user model
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password
        });
        user = await newUser.save(); // save newuser data as user
        request.cookieAuth.set({ id: user.id });  // set a cookie based on user id
        return h.redirect('/login'); // redirect to login screen
      } catch (err) {
        return h.view('signup', { errors: [{ message: err.message }] });
      }
    }
  },

  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view('login', { title: 'Login to Simple GIS' });
    }
  },

  login: {
    auth: false,
    handler: async function(request, h) {
      // take in the email and password from the form fields
      const { email, password} = request.payload;
      try {
        let user = await User.findByEmail(email); //validate that the user exists in the database
           if (!user) { //if email not recognised - send error message
             const message = 'Email address is not registered';
             throw Boom.message(message);
           }
            user.comparePassword(password);
            request.cookieAuth.set({ id: user.id });
           
        return h.redirect('/home', {
          title: 'Home',
          user: user

        });
      } 
      catch (err) {
        // Refresh login throwing boom error
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },

  showSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        return h.view('settings', { 
          title: 'Account Settings', 
          user: user });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },

  updateSettings: {
    // validate: {
    //   payload: {
    //     firstName: Joi.string().required(),
    //     lastName: Joi.string().required(),
    //     email: Joi.string()
    //         .email()
    //         .required(),
    //     password: Joi.string().required()
    //   },
    //   options: {
    //     abortEarly: false
    //   },
    //   failAction: function(request, h, error) {
    //     return h
    //         .view('settings', {
    //           title: 'Sign up error',
    //           errors: error.details
    //         })
    //         .takeover()
    //         .code(400);
    //   }
    // },
    handler: async function(request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        user.password = userEdit.password;
        await user.save();
          console.log("Update successful")
        return h.redirect('/home');

      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },

  logout: {
    handler: function(request, h) {
     //clear cookie on logout
      request.cookieAuth.clear(); 
      return h.redirect('/');
    }
   }
  };

module.exports = Accounts;