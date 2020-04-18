'use strict';

const Property = require('../models/property');

const Properties = {

    find: {
        auth: false,
        handler: async function(request, h) { // declare async request with handlebars view
            const properties = await Property.find();
            return properties;
        }
    } ,


    findOne: {
        auth: false,
        handler: async function(request, h) {
          const property = await Property.findOne({ _id: request.params.id });
          return property;
        }
      }
}

module.exports = Properties;