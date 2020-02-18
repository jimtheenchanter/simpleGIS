'use strict';

const User = require('../models/user');
const Property = require('../models/property');

const Properties = {
  home: {
        handler: function(request, h) {
         return h.view('home', { title: 'Add a Property' });
    }
  },

  report: {
    handler: async function(request, h) {
      const properties = await Property.find().populate('agent');
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

addproperty: {
  handler: async function(request, h) {
    try {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newProperty = new Property({
        eircode: data.eircode,
        long: data.long,
        lat: data.lat,
        agent: user._id
      });
      await newProperty.save();
      return h.redirect('/report');
    } catch (err) {
      return h.view('main', { errors: [{ message: err.message }] });
    }
  }
},

deleteproperty: {
  auth: false,
  handler: async function(request, h) {
      // const c_property =  await Property.findById(request.params.id);
      // const c_image_id = c_poi.cloudinary_id;
      // await ImageStore.deleteImage(c_image_id);
      const property = await Property.deleteOne({ _id: request.params.id });
      if (property) {
          //return { success: true };
          return h.redirect('/report');
      }
      //return.redirect('/report');
      return Boom.notFound('id not found');
  }
}
};

module.exports = Properties;