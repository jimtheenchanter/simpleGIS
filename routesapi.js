const Properties = require('./app/api/properties');

module.exports = [  
    { method: 'GET', path: '/api/properties', config: Properties.find },
    { method: 'GET', path: '/api/properties/{id}', config: Properties.findOne }
];