'use strict';

const Properties = {
  home: {
        handler: function(request, h) {
      return h.view('home', { title: 'Add a Property' });
    }
  },
  report: {
    handler: function(request, h) 
    {      return h.view('report', { title: 'Properties so far', properties: this.properties });
      }  } ,

  property: {
    handler: function(request, h) {
      const data = request.payload;
      var agentEmail = request.auth.credentials.id; //recover email from cookie
      data.agent = this.users[agentEmail]; // look up DB to recover users deails
      this.properties.push(data);
      return h.redirect('/report');
    }
  }  

    
    };

module.exports = Properties;