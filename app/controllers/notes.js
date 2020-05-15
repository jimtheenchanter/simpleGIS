'use strict';
const User = require('../models/user');
const Note = require('../models/note');

const Notes = {
    note: { 
        handler: async function(request, h) {
           try{ // pass in the notes
            const id = request.auth.credentials.id;
            // const properties = await Property.find().populate('agent')
            const user = await User.findById(id);
            const notes = await Note.find().populate('agent');
            // .populate('agent')
            // const properties = await Property.find().populate();
            // const mapAPIKey = process.env.mapKey;
       return h.view('notemain', { 
          title: 'Add a Note',
          user: user,
          notes: notes,
         
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
      const today = new Date();
      var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+ today.getFullYear();
      const newNote = new Note({
        comment: data.comment,
        // date: Date.now(),
        date: date,
        agent: user._id
      });
      await newNote.save();
      return h.redirect('notemain');
    } catch (err) {
      return h.view('home', { errors: [{ message: err.message }] });
    }
  }
},


deleteNote: {
  auth: false,
  handler: async function(request, h) {
       const note = await Note.deleteOne({ _id: request.params.id });
      if (note) {
                  return h.redirect('/notemain');
      }
       return Boom.notFound('id not found');
  }
},

}



module.exports = Notes;