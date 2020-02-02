'use strict';

require('dotenv').config();
// const dotenv = require('dotenv');
// const result = dotenv.config();
// if (result.error) {
//   console.log(result.error.message);
//   process.exit(1);
// }
const Hapi = require('@hapi/hapi');

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

require('./app/models/db');

// server.bind({
//   users: {},
//   properties: []
  
// });

// start the synchronous server
async function init() {
// only  start the server if the plugin is successfully loaded
//  await server.register(require('hapi-auth-cookie'));
 await server.register(require('@hapi/cookie'));
  await server.register(require('@hapi/inert'));
  await server.register(require('@hapi/vision'));
  

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false
  });
  

  server.auth.strategy('session', 'cookie', {
    cookie: {
    password: process.env.cookie_password,
    name: process.env.cookie_name,    
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000
   },
    redirectTo: '/' // prevent error if going to inaccessible page
    
  });

  
  server.auth.default({
    mode: 'required',
    strategy: 'session',
  });

  server.route(require('./routes'));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();