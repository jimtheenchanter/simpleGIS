'use strict';

const User = require('../models/user');

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
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = 'Email address is already registered';
          throw new Boom(message);
        }
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/home');
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
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = 'Email address is not registered';
          throw new Boom(message);
        }
        user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/home');
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },

  showSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        return h.view('settings', { title: 'Donation Settings', user: user });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },

  updateSettings: {
    handler: async function(request, h) {
      const userEdit = request.payload;
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      user.firstName = userEdit.firstName;
      user.lastName = userEdit.lastName;
      user.email = userEdit.email;
      user.password = userEdit.password;
      await user.save();
      return h.redirect('/settings');
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