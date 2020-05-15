'use strict';
// import required controllers
const Accounts = require('./app/controllers/accounts');
const Properties = require('./app/controllers/properties');
const Polylines = require('./app/controllers/polylines');
const Polygons = require('./app/controllers/polygons');
const Notes = require('./app/controllers/notes');

module.exports = [
  // routes to handle account functions
{ method: 'GET', path: '/', config: Accounts.index },
{ method: 'GET', path: '/signup', config: Accounts.showSignup},
{ method: 'GET', path: '/login', config: Accounts.showLogin },
{ method: 'GET', path: '/logout', config: Accounts.logout },
{ method: 'POST', path: '/signup', config: Accounts.signup },
{ method: 'POST', path: '/adduser', config: Accounts.adduser },
{ method: 'GET', path: '/addusermain', config: Accounts.showAdduser },
{ method: 'POST', path: '/login', config: Accounts.login },
{ method: 'GET', path: '/settings', config: Accounts.showSettings },
{ method: 'POST', path: '/settings', config: Accounts.updateSettings },
{ method: 'GET', path: '/showusers', config: Accounts.showUsers},
{ method: 'GET', path: '/deleteuser/{id}', config: Accounts.deleteUser},
  // routes to handle property functions
{ method: 'GET', path: '/home', config: Properties.home }, //addproperty
// { method: 'GET', path: '/dashboard', config: Accounts.}
{ method: 'GET', path: '/report', config: Properties.report },
{ method: 'GET', path: '/addpropertypage', config: Properties.addPropertyPage},
{ method: 'GET', path: '/editproperty/{id}', config: Properties.showProperty },
{ method: 'POST', path: '/editproperty', config: Properties.updateProperty },
{ method: 'GET', path: '/deleteproperty/{id}', config: Properties.deleteProperty },
{ method: 'POST', path: '/property', config: Properties.addProperty },

{ method: 'GET', path: '/polylinemain', config: Polylines.polyline},
{ method: 'POST', path: '/polyline', config: Polylines.addPolyline },
{ method: 'GET', path: '/deletepolyline/{id}', config: Polylines.deletePolyline },

{ method: 'GET', path: '/polygonmain', config: Polygons.polygon},
{ method: 'POST', path: '/polygon', config: Polygons.addPolygon },
{ method: 'GET', path: '/deletepolygon/{id}', config: Polygons.deletePolygon },

{ method: 'GET', path: '/notemain', config: Notes.note },
{ method: 'POST', path: '/addnote', config: Notes.addNote },
{ method: 'GET' , path: '/deletenote/{id}', config: Notes.deleteNote },
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