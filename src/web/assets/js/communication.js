(function($) {
  $.fn.communication = function(params) {
    var socket = params.socket;

    $('#send-text__form').on('submit', function(e) {
      e.preventDefault();

      console.log('sending message through socket');
      var text = params.editor.value();
      var title = $('#send-title__input').val();
      socket.emit('send-text', {
        text: text,
        title: title
      });
    });


    /*
     EMIT
     */

    $('#send-print-cmd').on('click', function(e) {
      e.preventDefault();

      console.log('sending print command');
      socket.emit('print');
    });

    $('#send-print-img-cmd').on('click', function(e) {
      e.preventDefault();

      console.log('sending print img command');
      socket.emit('print-img');
    });

    $('#send-button-push').on('click', function(e) {
      e.preventDefault();

      console.log('sending button push');
      socket.emit('button-push');
    });


    /*
     RECEIVE
     */

    socket.on('led-state-changed', function(data) {
      var $led;

      if(data.led == "green") {
        $led = $('#green-led');
      } else if(data.led == "red") {
        $led = $('#red-led');
      }

      if(data.state) { // led turned on
        $led.removeClass('turned-off').addClass('turned-on');
      } else { // led turned off
        $led.removeClass('turned-on').addClass('turned-off');
      }

    });

    socket.on('printing-done', function(data) {
      console.log(data.htmlText);
    });
  }

}(jQuery));