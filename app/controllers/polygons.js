'use strict';

const Polyline = require('../models/polyline');
const Property = require('../models/property');
const User = require('../models/user');
const Polygon = require('../models/polygon');
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const Polygons = {

    polygon: {  // displayy main polygon view
        handler: async function(request, h) {
           try{ // pass in the polygons
  
            const properties = await Property.find().populate();
            const mapAPIKey = process.env.mapKey;
       return h.view('polygonmain', { 
          title: 'Add a Polygon',
          mapKey: mapAPIKey,
          properties: properties,
         
          
          
          });
           }
        catch (err) {
         return h.view('main', {errors: [{message: err.message}]});
     }}
     },

     // save the polyline data from polyline.hbs view
     addPolygon: {
      handler: async function(request, h) {
        try {
          const id = request.auth.credentials.id;
          const user = await User.findById(id);
          const data = request.payload;
               const newPolygon = new Polygon({
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
              newPolygon.latlng.push(obj)
          };
          console.log(newPolygon.latlng)
          await newPolygon.save();
          return h.redirect('/report');
        } catch (err) {
          return h.view('main', { errors: [{ message: err.message }] });
        }
      }
  },

  deletePolygon: {
    auth: false,
    handler: async function(request, h) {
         const polygon = await Polygon.deleteOne({ _id: request.params.id });
        if (polygon) {
                    return h.redirect('/report');
        }
         return Boom.notFound('id not found');
    }
  },


  }
module.exports = Polygons;