'use strict';

// initiate dotenv for accessing environment variables
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}


const Hapi = require('@hapi/hapi');
const utils = require('./app/api/utils.js');
const fs = require('fs'); // allow file transfer
const server = Hapi.server({
  port: process.env.PORT || 3000,  //
  tls: {
    key: fs.readFileSync('private/jobserver.key'),
    cert: fs.readFileSync('private/jobserver.crt')
}
});

require('./app/models/db');

// start the synchronous server
async function init() {
// only  start the server if the plugin is successfully loaded
 await server.register(require('hapi-auth-jwt2'));
  await server.register(require('@hapi/cookie')); // to manage cookies
  await server.register(require('@hapi/inert'));
  await server.register(require('@hapi/vision'));
  
// this is how the views are handled with handlebars
  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname, 
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials', 
    layout: true,
    isCached: false,
    allowAbsolutePaths:true,
    allowInsecureAccess: true

  });
  
// cookie management implementation
  server.auth.strategy('standard', 'cookie', {
    cookie: {
    password: process.env.cookie_password,  // password stored in as environment variable
    name: process.env.cookie_name,    
    isSecure: true,
    ttl: 24 * 60 * 60 * 1000
  },
    redirectTo: '/' // prevent error if going to inaccessible page
  });

 // authentication token strategy 
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.jwt_password,
    validate: utils.validate, // validate function from util API
    verifyOptions: { algorithms: ['HS256'] },
  });
  
  server.auth.default({
    mode: 'required',
    strategy: 'standard',
  });

  server.route(require('./routes'));
  server.route(require('./routesapi')); // endpoints for testing and tertiary apps
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();