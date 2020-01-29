const Properties = require('./app/controllers/properties');

module.exports = [
{ method: 'GET', path: '/', config: Properties.index },
{ method: 'GET', path: '/signup', config: Properties.signup },
{ method: 'GET', path: '/login', config: Properties.login },


{    method: 'GET',
     path: '/{param*}',
     handler: { directory: {
                path: './public'  } } },


];