'use strict';

const User = require('../models/user');
const Property = require('../models/property');
<<<<<<< HEAD
=======
const Polyline = require('../models/polyline');
// const Map = require('..models/map');
>>>>>>> develop

const Properties = {
  home: {  
           handler: async function(request, h) {
              try{ // pass in the properties
                // const id = request.auth.credentials.id;
                const user = await User.findById;
                
               const properties = await Property.find().populate('agent');
            return h.view('home', { 
              title: 'Add a Property',
              properties: properties, 
              user: user
              
             
             });
              }
           catch (err) {
            return h.view('main', {errors: [{message: err.message}]});
        }}
        },

  report: {
    handler: async function(request, h) {
      try {
<<<<<<< HEAD
      const properties = await Property.find().populate('agent');
      const u_id = request.auth.credentials.id;

       //method to only show delete button for current user's properties
=======
      const properties = await Property.find().populate('agent'); //get all the  properties
      const u_id = request.auth.credentials.id; // define the user id
      const polylines = await Polyline.find().populate('agent');
      //method to only show delete button for current user's properties
>>>>>>> develop
       for(let p in properties){
        console.log(properties[p].agent.id)
        if(properties[p].agent.id == u_id){
          properties[p].show_delete = true;
        }else{
          properties[p].show_delete = false;
<<<<<<< HEAD
        }
    }
=======
        }}

        //only show edit field for agents own entries
        for(let p in properties){
          console.log(properties[p].agent.id)
          if(properties[p].agent.id == u_id){
            properties[p].show_edit = true;
          }else{
            properties[p].show_edit = false;
          }
        }
    // pass the property data into the view 
>>>>>>> develop
      return h.view('report', {
        title: 'Properties to Date',
        properties: properties, // reference to properties object
        polylines: polylines
        
      });
<<<<<<< HEAD
    }catch (err) {
      return h.view('main', {errors: [{message: err.message}]});
  }}
  },


addproperty: {
=======
     
      // any errors should redirect back to main page
    }catch (err) {
      return h.view('main', {errors: [{message: err.message}]});
  }} 
  },

addProperty: {
>>>>>>> develop
  handler: async function(request, h) {
    try {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newProperty = new Property({
        eircode: data.eircode,
        address: data.address,
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
<<<<<<< HEAD
}
,

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

}
=======
},

deleteProperty: {
  auth: false,
  handler: async function(request, h) {
       const property = await Property.deleteOne({ _id: request.params.id });
      if (property) {
                  return h.redirect('/report');
      }
       return Boom.notFound('id not found');
  }
},


showProperty : {
  handler: async function(request, h) {
    try {
      const id = request.params.id;
      const property = await Property.findById(id); // use the property with matching ID
      return h.view('editproperty', { 
        title: 'Edit Property', 
        property: property });
    } catch (err) {
      return h.view('home', { errors: [{ message: err.message }] });
    }
  }
},

updateProperty: {
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
      return h.redirect('/report');

    } catch (err) {
      return h.view('main', { errors: [{ message: err.message }] });
    }
  }
}}
>>>>>>> develop
;

module.exports = Properties;