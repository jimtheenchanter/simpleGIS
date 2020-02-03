'use strict';

const User = require('../models/user');
const Property = require('../models/property')

const Properties = {
  home: {
        handler: function(request, h) {
         return h.view('home', { title: 'Add a Property' });
    }
  },

  report: {
    handler: async function(request, h) {
      const properties = await Property.find().populate('agent')
      return h.view('report', {
        title: 'Properties to Date',
        properties: properties
      });
    }
  },

//   property: {
//     handler: async function(request, h) {
//       const id = request.auth.credentials.id;
//       const user = await User.findById(id);
//       const data = request.payload;
//       const newProperty = new Property({
//         eircode: data.eircode,
//         long: data.long,
//         lat: data.lat,
//         // agent: user._id
//         agent: user.firstName
//               });

//       await newProperty.save();
//       return h.redirect('/report');
//     }
//   }
// };

property: {
  handler: async function(request, h) {
    try {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newProperty = new Property({
        eircode: data.eircode,
        long: data.long,
        agent: user._id
      });
      await newProperty.save();
      return h.redirect('/report');
    } catch (err) {
      return h.view('main', { errors: [{ message: err.message }] });
    }
  }
}
};

module.exports = Properties;