'use strict';
const User = require('../models/user');
const Note = require('../models/note');

const Notes = {
    note: { 
        handler: async function(request, h) {
           try{ // pass in the notes
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
           
            // const properties = await Property.find().populate();
            // const mapAPIKey = process.env.mapKey;
       return h.view('addnote', { 
          title: 'Add a Note',
          user: user,
         
          });
           }
        catch (err) {
         return h.view('main', {errors: [{message: err.message}]});
     }}
     },


addNote: {
  handler: async function(request, h) {
    try {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      const data = request.payload;
      const newNote = new Note({
        comment: data.comment,
        date: Date.now(),
        agent: user._id
      });
      await newNote.save();
      return h.redirect('/dashboard');
    } catch (err) {
      return h.view('main', { errors: [{ message: err.message }] });
    }
  }
},

}


module.exports = Notes;