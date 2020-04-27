'use strict';

// require('dotenv').config();
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const Hapi = require('@hapi/hapi');
const utils = require('./app/api/utils.js');
const fs = require('fs');
const server = Hapi.server({
  port: process.env.PORT || 3000,  //
  tls: {
    key: fs.readFileSync('private/webserver.key'),
    cert: fs.readFileSync('private/webserver.crt')
}
});

require('./app/models/db');


// start the synchronous server
async function init() {
// only  start the server if the plugin is successfully loaded
 await server.register(require('hapi-auth-jwt2'));
//  await server.register(require('@hapi/boom'));
 await server.register(require('@hapi/cookie'));
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
  

  server.auth.strategy('standard', 'cookie', {
    cookie: {
    password: process.env.cookie_password,
    name: process.env.cookie_name,    
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000
  },
    redirectTo: '/' // prevent error if going to inaccessible page
  
  });

  
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.jwt_password,
    validate: utils.validate,
    verifyOptions: { algorithms: ['HS256'] },
  })
  
  server.auth.default({
    mode: 'required',
    strategy: 'standard',
  });

  server.route(require('./routes'));
  server.route(require('./routesapi'));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();