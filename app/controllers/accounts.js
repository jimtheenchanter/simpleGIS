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
      const payload = request.payload;
      const newUser = new User({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        master: false
      });
      const user = await newUser.save();
      // request.cookieAuth.set({ id: user.email }); // set a session cookie
      request.cookieAuth.set({ id: user.id });
      return h.redirect('/home');
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
    handler: function(request, h) {
      var agentEmail = request.auth.credentials.id;
      const userDetails = this.users[agentEmail];
      return h.view('settings', { title: 'SimpleGIS Settings', user: userDetails });
    }
  },
  updateSettings: {
    handler: function(request, h) {
      const user = request.payload;
      this.users[user.email] = user;
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