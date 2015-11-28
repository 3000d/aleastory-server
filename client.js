(function($) {
  var socket = io();

  $('#send-text__form').on('submit', function(e) {
    e.preventDefault();

    console.log('sending message through socket');
    var text = $('#send-text__input').val();
    var title = $('#send-title__input').val();
    socket.emit('send-text', {
      text: text,
      title: title
    });
  });


  $('#send-print-cmd').on('click', function(e) {
    e.preventDefault();

    console.log('sending print command');
    socket.emit('print');
  });

  $('#send-print-img-cmd').on('click', function(e) {
    e.preventDefault();

    console.log('sending print img command');
    socket.emit('print-img');
  })

}(jQuery));