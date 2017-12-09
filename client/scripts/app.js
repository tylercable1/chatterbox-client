
var app =  {
  'server' : 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  lastNode : 0,
  username : 'anonymous',
  beenCalled :true,

  init : function() {
    this.fetch();
    setInterval(this.fetch, 6000);

    $(".submit").on('click', function(event) {
      var textNode = $('#textbox')[0].value;
      var user = window.location.search.split('=')[1];
      var newMessage = {
        username: user,
        text: textNode,
        roomname: '4chan'
      };
      app.send(newMessage);
      event.preventDefault();
    });
  },
  
  send : function(message) { 
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', data);
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
        if (app.lastNode !== data.results[0].objectId && app.beenCalled) {
          app.beenCalled = false;
          console.log('hi');
          data.results.forEach(function(node) {
            app.renderMessages(node);
          });
          
        } else {
          var myNode = document.getElementById("chats");
          for (var i = 0; i < myNode.childNodes.length; i++) {
            myNode.removeChild(myNode.lastChild);
          }
          console.log('resfresh');
          data.results.forEach(function(node) {
            app.refreshMessages(node);
          });
        }
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch', data);
      }
    });
  },

  renderMessages : function(data) {
    var $node = $('<div class ="message"></div>');
    $node.append(`<h3 class = 'username'>${escape(data.username)}:</h3>`);
    $node.append(`<h4 class = 'text'>${escape(data.text)}</h4>`);
    this.lastNode = data.objectId;
    $('#chats').append($node);
  }, 
  refreshMessages : function(data) {
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


