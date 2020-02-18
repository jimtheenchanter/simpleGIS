'use strict';

const Accounts = require('./app/controllers/accounts');
const Properties = require('./app/controllers/properties');

module.exports = [
{ method: 'GET', path: '/', config: Accounts.index },
{ method: 'GET', path: '/signup', config: Accounts.showSignup},
{ method: 'GET', path: '/login', config: Accounts.showLogin },
{ method: 'GET', path: '/logout', config: Accounts.logout },
{ method: 'POST', path: '/signup', config: Accounts.signup },
{ method: 'POST', path: '/login', config: Accounts.login },
{ method: 'GET', path: '/settings', config: Accounts.showSettings },
{ method: 'POST', path: '/settings', config: Accounts.updateSettings },
// { method: 'GET', path: '/', config: Properties.index },
{ method: 'GET', path: '/home', config: Properties.home },
{ method: 'GET', path: '/report', config: Properties.report },
{ method: 'POST', path: '/property', config: Properties.addproperty },
{ method: 'POST', path: '/deleteproperty/{id}', config: Properties.deleteproperty },

// routes for static pages

{    method: 'GET',
     path: '/{param*}',
     handler: { 
         directory: {
           path: './public'  } 
                            },
             options: { auth: false }
            }
];