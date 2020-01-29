'use strict';

const Properties = {
  home: {
    handler: function(request, h) {
      return h.view('home', { title: 'Add a Property' });
    }
  },
  report: {
    handler: function(request, h) 
    {      return h.view('report', { title: 'Properties so far', donations: this.donations });
      }  } ,

  property: {
    handler: function(request, h) {
      const data = request.payload;
      this.properties.push(data);
      return h.redirect('/report');
    }
  }  

    
    };

module.exports = Properties;