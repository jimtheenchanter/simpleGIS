'use strict';

const Polyline = require('../models/polyline');

const Polylines = {

    polyline: {  
        handler: async function(request, h) {
           try{ // pass in the properties
             // const user = await User.findById;
             // const properties = await Property.find().populate('agent');
         return h.view('polylinemain', { 
           title: 'Add a Polyline',
           // properties: properties
           // user: user
          });
           }
        catch (err) {
         return h.view('main', {errors: [{message: err.message}]});
     }}
     },





    addPolyline: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        // const user = await User.findById(id);
        const data = request.payload;
        const newPolyline = new Polyline({
          
          long: data.long,
          lat: data.lat,
         
        });
        await newPolyline.save();
        return h.redirect('/report');
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
},
  }
module.exports = Polylines;