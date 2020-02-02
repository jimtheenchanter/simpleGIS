'use strict';

const Property = require('../models/property')

const Properties = {
  home: {
        handler: function(request, h) {
      return h.view('home', { title: 'Add a Property' });
    }
  },

  report: {
    handler: async function(request, h) {
      const donations = await Property.find()
      return h.view('report', {
        title: 'Properties to Date',
        properties: properties
      });
    }
  },

  property: {
    handler: async function(request, h) {
      const data = request.payload;
      const newProperty = new Property({
        eircode: data.eircode,
        long: data.long,
        lat: data.lat,
        address: data.address,
        method: data.values
      });
      await newProperty.save();
      return h.redirect('/report');
    }
  }
};

module.exports = Properties;