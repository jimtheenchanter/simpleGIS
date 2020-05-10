'use strict';

const Boom = require('@hapi/boom');
const User = require('../models/user');
const Property = require('../models/property');
const Polyline = require('../models/polyline');
const Polygon = require('../models/polygon');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Joi = require('joi');


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
    validate: {
      //  schema which defines rules that our fields must adhere to. 
      payload: Joi.object(  // must define a Joi object
        {
        firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/).required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(), 
        password: Joi.string().min(6).required()
        })
      ,
    options: {
        abortEarly: false,
      },
// handler to invoke of one or more of the fields fails the validation
    failAction: function(request, h, error) {
        return h
          .view('signup', {
            title: 'Sign up error',
            errors: error.details
          })
          .takeover()
          .code(400);
          }
        },

    handler: async function(request, h) {
      try {
        const payload = request.payload; // accepts data from form
        let user = await User.findByEmail(payload.email); //declares user
        if (user) {  // check if user email already exists
          const message = 'Email address is already registered';
          throw Boom(message);
        }

        const hash = await bcrypt.hash(payload.password, saltRounds); // 
        // var d = Date(Date.now()); 
        var d = new Date();
        var a = d.toDateString();

        const newUser = new User({ //create new user based on user model
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash,
          admin: false,
          date: a,
        });
        user = await newUser.save(); // save newuser data as user
        request.cookieAuth.set({ id: user.id });  // set a cookie based on user id
        return h.redirect('/login'); // redirect to login screen
      } catch (err) {
        return h.view('signup', { errors: [{ message: err.message }] });
      }
    }
  },

  showAdduser: {
    auth: false,
    handler: function(request, h) {
      return h.view('addusermain', { title: 'Add new user' });
    }
  },

  adduser: {
    auth: false,
    validate: {
      //  schema which defines rules that our fields must adhere to. 
      payload: Joi.object(  // must define a Joi object
        {
        firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/).required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(), 
        password: Joi.string().min(6).required()
        })
      ,
    options: {
        abortEarly: false,
      },
// handler to invoke of one or more of the fields fails the validation
    failAction: function(request, h, error) {
        return h
          .view('signup', {
            title: 'Sign up error',
            errors: error.details
          })
          .takeover()
          .code(400);
          }
        },

    handler: async function(request, h) {
      try {
        const payload = request.payload; // accepts data from form
        let user = await User.findByEmail(payload.email); //declares user
        if (user) {  // check if user email already exists
          const message = 'Email address is already registered';
          throw Boom(message);
        }

        const hash = await bcrypt.hash(payload.password, saltRounds); // 

        const newUser = new User({ //create new user based on user model
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash,
          admin: payload.admin,
          date: Date.now(),
        });
        user = await newUser.save(); // save newuser data as user
        // request.cookieAuth.set({ id: user.id });  // set a cookie based on user id
        return h.redirect('addusermain'); // redirect to login screen
      } catch (err) {
        return h.view('addusermain', { errors: [{ message: err.message }] });
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
    validate: {
      payload: Joi.object( {
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      }),
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('login', {
            title: 'Sign in error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      // take in the email and password from the form fields
      const { email, password} = request.payload;
      try {
        let user = await User.findByEmail(email); //validate that the user exists in the database
           if (!user) { //if email not recognised - send error message
             const message = 'Email address is not registered';
             throw new Boom(message);
           }
            // user.comparePassword(password);
            if (!await user.comparePassword(password)) {         // EDITED (next few lines)
              const message = 'Password mismatch';
              throw new Boom(message);
            } else {


            request.cookieAuth.set({ id: user.id });
           
        return h.redirect('/home', {
          title: 'Home',
          user: user

        });
      }
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
    validate: {
      payload: Joi.object ({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string().required()
      }),
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
            .view('settings', {
              title: 'Update settings error',
              errors: error.details
            })
            .takeover()
            .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const hash = await bcrypt.hash(userEdit.password, saltRounds); 

        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        // user.password = userEdit.password;
        user.password = hash;
        await user.save();
          console.log("Update successful")
        return h.redirect('/home');

      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },

  showUsers: {
    handler: async function(request, h) {
      try {
      // const properties = await Property.find().populate('agent'); //get all the  properties
      // const u_id = request.auth.credentials.id; // define the user id
      // const polylines = await Polyline.find().populate('agent');
      // const polygons = await Polygon.find().populate('agent');
      // const id = request.auth.credentials.id;
      const users = await User.find();  
    // pass the property data into the view 
      return h.view('showusers', {
        title: 'All registered Users',
        users: users
        
      });
     
      // any errors should redirect back to main page
    }catch (err) {
      return h.view('main', {errors: [{message: err.message}]});
  }} 
  },


  deleteUser: {
    auth: false,
    handler: async function(request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
        if (user) { 
         return h.redirect('/showusers');
        }
         return Boom.notFound('id not found');
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