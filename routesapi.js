const Properties = require('./app/api/properties');
const Users = require('./app/api/users');

module.exports = [  
    { method: 'GET', path: '/api/properties', config: Properties.find },
    { method: 'GET', path: '/api/properties/{id}', config: Properties.findOne },
    { method: 'POST', path: '/api/properties', config: Properties.create },
    { method: 'PUT', path: '/api/properties/{id}', config: Properties.update},
    { method: 'DELETE', path: '/api/properties/{id}', config: Properties.deleteOne},

    { method: 'GET', path: '/api/users', config: Users.find },
    { method: 'GET', path: '/api/users/{id}', config: Users.findOne },
    { method: 'POST', path: '/api/users', config: Users.create },
    { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne },
    { method: 'DELETE', path: '/api/users', config: Users.deleteAll },
    { method: 'POST', path: '/api/users/authenticate', config: Users.authenticate },
   


];