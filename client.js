(function($) {
  var socket = io.connect('http://localhost:8080');

  $('#send-text__form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('send-text', $('#send-text__input').val());
  });
}(jQuery));