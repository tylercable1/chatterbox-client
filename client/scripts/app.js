
var app =  {
  'server' : 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  lastNode : 0,
  
  init : function() {
    this.fetch();
    setInterval(this.fetch, 6000);

    $("#submit").submit(function(event) {
      
      alert( "Handler for .submit() called.");
      event.preventDefault();
    });
  },
  
  send : function(message) { 
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch : function(serverURL = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages') {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: serverURL,
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        if (app.lastNode !== data.results[0].objectId) {
          console.log('hi');
          data.results.forEach(function(node) {
            app.renderMessage(node);
          });
        }
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  renderMessage : function(data) {
    var $node = $('<div class ="message"></div>');
    $node.append(`<h3 class = 'username'>${escape(data.username)}:</h3>`);
    $node.append(`<h4 class = 'text'>${escape(data.text)}</h4>`);
    this.lastNode = data.objectId;
    $('#chats').prepend($node);
  },

  clearMessages : function() {

    $('#chats').remove();

  },

  renderRoom : function() {

  }
};


