
var app =  {
  'server' : 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  lastNode : 0,
  username : 'anonymous',
  hasNotBeenCalled :true,
  rooms : {},
  existingRooms : {},
  currentRoom : undefined,

  init : function() {
    this.fetch();
    setInterval(this.fetch, 1000);


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

    $(".roomSwitch").on('click', function(event) {
      app.refreshing = false; 
      var selectedRoom = $('.roomList')[0].value;
      if(selectedRoom === 'All'){
        selectedRoom = undefined;
      }
      app.currentRoom = selectedRoom;
      console.log(app.currentRoom)
      app.fetch();
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
        if (app.hasNotBeenCalled) {
          console.log(room)
          app.hasNotBeenCalled = false;
          console.log('hi');
          data.results.forEach(function(node) {
            app.renderMessages(node);
          });
          for (var keys in app.rooms) {
            var room = '<option class="all" id="' + escape(keys) + ' value="' + escape(keys) + '">' + escape(keys) + '</option>';
            app.existingRooms[keys] = 0;
            $('.roomList').append(room);
          }
        } 
        if (app.currentRoom !== undefined){
          app.clearMessages();
          $('body').append('<div id="chats"></div>');
          console.log(data.roomname);
          data.results.forEach(function(node) {
            if (node.roomname === app.currentRoom){
              console.log(node)
              app.refreshMessages(node);
            }
          });
        } else if (app.currentRoom === undefined) {  
          app.clearMessages();
          $('body').append('<div id="chats"></div>');
          console.log('resfresh');
          data.results.forEach(function(node) {
            app.refreshMessages(node);
          });
          
          for (var keys in app.rooms) {
            if (app.existingRooms[keys] === undefined) {
              var room = '<option value="' + escape(keys) + '">' + escape(keys) + '</option>';
              $('.roomList').append(room);
            }
          }
        } 
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch', data);
      }
    });
  },

  renderMessages : function(data) {
    console.log(data)
    var $node = $('<div class ="message"></div>');
    $node.append(`<h3 class = 'username'>${escape(data.username)}:</h3>`);
    $node.append(`<h4 class = 'text'>${escape(data.text)}</h4>`);
 //   this.lastNode = data.objectId;
    if(!this.rooms[data.roomname]){
      this.rooms[data.roomname] = [$node];
    } else {
      this.rooms[data.roomname].push($node);
    }
    $('#chats').append($node);
  }, 
  refreshMessages : function(data) {
    var $node = $('<div class ="message"></div>');
    $node.append(`<h3 class = 'username'>${escape(data.username)}:</h3>`);
    $node.append(`<h4 class = 'text'>${escape(data.text)}</h4>`);
    this.lastNode = data.objectId;
    if(!this.rooms[data.roomname]){
      this.rooms[data.roomname] = [$node];
    } else {
      this.rooms[data.roomname].push($node);
    }
    $('#chats').append($node);    
  },

  clearMessages : function() {

    $('#chats').remove();

  },

  renderRoom : function() {

  },
  renderMessage : function() {

  }
};


