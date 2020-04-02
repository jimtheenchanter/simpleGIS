'use strict';

const Polyline = require('../models/polyline');
const Property = require('../models/property');
const User = require('../models/user');

const Polylines = {

    polyline: {  
        handler: async function(request, h) {
           try{ // pass in the polylines
        
              const properties = await Property.find().populate()
                       ;
         return h.view('polylinemain', { 
          title: 'Add a Polyline',
          properties: properties,
      
          });
           }
        catch (err) {
         return h.view('main', {errors: [{message: err.message}]});
     }}
     },

     // save the polyline data from polyline.hbs view
     addPolyline: {
      handler: async function(request, h) {
        try {
          const id = request.auth.credentials.id;
          const user = await User.findById(id);
          const data = request.payload;
               const newPolyline = new Polyline({
            title: data.title,
            latlng: [],
            agent: user._id
                    
          });
          // remove LatLng text and split to make coord objects for array
          let lat_lng_string = data.latlng.replace(/LatLng\(/g,'');
          let value_pairs = lat_lng_string.split('),');
          for(let v in value_pairs){
              let mini_arr = value_pairs[v].split(',');
              let obj = {};
              obj.lat = Number(mini_arr[0])
              if(mini_arr[1].includes(')')){
                  obj.lng = mini_arr[1].replace(')','');
              }else{
                  obj.lng = Number(mini_arr[1]);
              }
              newPolyline.latlng.push(obj)
          };
          console.log(newPolyline.latlng)
          await newPolyline.save();
          return h.redirect('/report');
        } catch (err) {
          return h.view('main', { errors: [{ message: err.message }] });
        }
      }
  },
  }
module.exports = Polylines;