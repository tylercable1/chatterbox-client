
var app =  {
  
  lastNode : 0,
  
  init : function() {
    this.fetch();
    setInterval(this.fetch, 5000);
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

  fetch : function(serverURL = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages', room) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: serverURL,
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        if(app.lastNode !== data.results[0].objectId){
          $('#chats').remove();
          console.log('hi')
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
    $node.append(`<h3 class = 'username'>${data.username}:</h3>`);
    $node.append(`<h4 class = 'text'>${data.text}</h4>`);
    this.lastNode = data.objectId;
    $('#chats').prepend($node);
  }
};


