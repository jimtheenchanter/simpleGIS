'use strict';

require('dotenv').config();

// configure interface to interact with database 
const Mongoose = require('mongoose');
Mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });
const db = Mongoose.connection;

db.on('error', function(err) {
  console.log(`database connection error: ${err}`);
});

db.on('disconnected', function() {
  console.log('database disconnected');
});

db.once('open', function() {
  console.log(`database connected to ${this.name} on ${this.host}`);
})