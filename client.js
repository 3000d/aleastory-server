(function($) {
  var socket = io();

  $('#send-text__form').on('submit', function(e) {
    e.preventDefault();

    console.log('sending message through socket');
    socket.emit('send-text', $('#send-text__input').val());
  });
}(jQuery));