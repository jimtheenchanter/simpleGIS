'use strict';

const User = require('../models/user');
const Property = require('../models/property');
const Polyline = require('../models/polyline');
const Polygon = require('../models/polygon');
const Note = require('../models/note');
// const Map = require('..models/map');
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}


const Properties = {
  home: {  // dashboard view
           handler: async function(request, h) {
              try{ // pass in the data for the map
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                // const properties = await [Property.findAll];
                const properties = await Property.find().populate('agent');
                const polylines = await Polyline.find().populate('agent');
                const polygons = await Polygon.find().populate('agent');
                const notes = await Note.find();
                const mapAPIKey = process.env.mapKey;
                // const totalProperties = properties.count();
                const today = new Date();
                var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+ today.getFullYear();
            return h.view('home', { 
              title: 'Dashboard',
              mapKey: mapAPIKey,
              properties: properties,
              polygons: polygons,
              polylines: polylines,
              notes: notes,
              totalproperties:properties.length,
              user: user,
              date: date
             });
              }
           catch (err) {
            return h.view('main', {errors: [{message: err.message}]});
        }}
        },

  addPropertyPage: {
    handler: async function(request, h) {
      try{ // pass in the properties
        // const id = request.auth.credentials.id;
        const user = await User.findById;
        const properties = await Property.find().populate();
        const mapAPIKey = process.env.mapKey;
    return h.view('addpropertypage', { 
      title: 'Add a Property',
      mapKey: mapAPIKey,
      properties: properties, //pass in properties for map
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
      const properties = await Property.find().populate('agent'); //get all the  properties
      const u_id = request.auth.credentials.id; // define the user id
      const polylines = await Polyline.find().populate('agent');
      const polygons = await Polygon.find().populate('agent');
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const mapAPIKey = process.env.mapKey;
      //method to only show delete button for current user's properties
       for(let p in properties){
        console.log(properties[p].agent.id)
        if(properties[p].agent.id == u_id){ // if agent for prop id matches current user id
          properties[p].show_delete = true; // show delete boolean true 
        }else{
          properties[p].show_delete = false;
        }}

        //only show edit field for agents own entries
        for(let p in properties){
          console.log(properties[p].agent.id)
          if(properties[p].agent.id == u_id){ // if agent for prop id matches current user id
            properties[p].show_edit = true;  // show delete boolean true 
          }else{
            properties[p].show_edit = false;
          }
        }

        for(let p in polylines){
          console.log(polylines[p].agent.id)
          if(polylines[p].agent.id == u_id){ 
            polylines[p].show_delete = true; 
          }else{
            polylines[p].show_delete = false;
          }}

        for(let p in polygons){
          console.log(polygons[p].agent.id)
          if(polygons[p].agent.id == u_id){ 
            polygons[p].show_delete = true; 
          }else{
            polygons[p].show_delete = false;
          }}

    // pass the property data into the view 
      return h.view('report', {
        title: 'Properties to Date',
        properties: properties, // reference to properties object for map and list
        polylines: polylines,
        polygons: polygons,
        user: user,
        mapkey: mapAPIKey,
        numOfProperties: properties.length,
        numOfPolygons: polygons.length,
        numOfPolylines: polylines.length,
        });
     
      // any errors should redirect back to main page
    }catch (err) {
      return h.view('main', {errors: [{message: err.message}]});
  }} 
  },

addProperty: {
  handler: async function(request, h) {
    try {
      const id = request.auth.credentials.id; // read credentials from cookie
      const user = await User.findById(id); // define current user as that of id
      const data = request.payload; // form payload as data
      const newProperty = new Property({ // create new Property object 
        eircode: data.eircode,           //.. with this data 
        address: data.address,
        long: data.long,
        lat: data.lat,
        color: data.color,
        comment: data.comment,
        agent: user._id
      });
      await newProperty.save(); // save the property
      return h.redirect('/home');
    } catch (err) {
      return h.view('main', { errors: [{ message: err.message }] });
    }
  }
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
      const mapAPIKey = process.env.mapKey;
      const property = await Property.findById(id); // use the property with matching ID
            return h.view('editproperty', { 
        title: 'Edit Property', 
        mapKey: mapAPIKey,
        property: property });
    } catch (err) {
      return h.view('home', { errors: [{ message: err.message }] });
    }
  }
},
// this function keeps throwing error so is unused :(
updateProperty: {
  handler: async function(request, h) {
    try {
      const propertyEdit = request.payload;
      const id = request.params.id;
      const property = await Property.findById(id);
      property.eircode = propertyEdit.eircode; // error property eircode of null
      property.lat = propertyEdit.lat;
      property.long = propertyEdit.long;
         await property.save(id);
        console.log("Update successful")
      return h.redirect('/report');

    } catch (err) {
      return h.view('main', { errors: [{ message: err.message }] });
    }
  }
}}
;

module.exports = Properties;