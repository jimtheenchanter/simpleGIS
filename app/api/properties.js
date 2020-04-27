'use strict';

const Property = require('../models/property');
const Boom = require('@hapi/boom');

const Properties = {

    find: {
      auth: {
        strategy: 'jwt',
      },
        handler: async function(request, h) { // declare async request with handlebars view
            const properties = await Property.find();
            return properties;
        }
    } ,


    findOne: {
      auth: {
        strategy: 'jwt',
      },
        handler: async function(request, h) {
            // try and catch statement to to handle _id of any length
          try{
            const property = await Property.findOne({ _id: request.params.id });
            const message = 'No Property with this id';
            if (!property) {
              
              return Boom.notFound(message);
            }
             return property;
        } catch (err) {
            return Boom.notFound(message);
        }
      }
    },

    create: {
      auth: {
        strategy: 'jwt',
      },
        handler: async function(request, h) {
          const newProperty = new Property(request.payload);
          const property = await newProperty.save();
          if (property) {
            return h.response(property).code(201);
          }
          return Boom.badImplementation('error creating property');
        }
      },
    
      deleteAll: {
        auth: {
          strategy: 'jwt',
        },
        handler: async function(request, h) {
          await Property.remove({});
          return { success: true };
        }
      },
    
      deleteOne: {
        auth: {
          strategy: 'jwt',
        },
        handler: async function(request, h) {
          const property = await Property.remove({ _id: request.params.id });
          if (property) {
            return { success: true };
          }
          return Boom.notFound('id not found');
        }
      },

    update: {
        handler: async function(request, h) {
        try {
          const propertyEdit = request.payload;
          const id = request.params.id;
          const property = await Property.findById(id);
          property.eircode = propertyEdit.eircode;
          property.lat = propertyEdit.lat;
          property.long = propertyEdit.long;
       
          await property.save();
            console.log("Update successful")
          return h.redirect('/home');
    
        } catch (err) {
          return h.view('main', { errors: [{ message: err.message }] });
        }
      }

    }
}

module.exports = Properties;