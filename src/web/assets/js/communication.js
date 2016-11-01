(function($) {
  $.fn.communication = function(params) {
    var socket = params.socket;
    let $fileList = $('#file-list');

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

    // on load
    socket.emit('get-data-location');
    socket.emit('get-file-list');

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

    $fileList.on('click', 'a[data-action="print"]', function(e) {
      e.preventDefault();

      var filename = $(this).parent().find('.filename').html();
      console.log('sending print file command for', filename);
      socket.emit('print-file', filename);
    });

    // Data location
    $('#list__location__form').on('submit', function(e) {
      e.preventDefault();

      console.log('sending change data location');
      socket.emit('set-data-location', $(this).find('#location-input').val());
    });

    $('#google-poetry__form').on('submit', function(e) {
      e.preventDefault();

      var googlePoetryQuery = $(this).find('#google-poetry-input').val();

      if(googlePoetryQuery.length) {
        console.log('sending google poetry');
        socket.emit('send-google-poetry', googlePoetryQuery);
      }
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


    socket.on('data-location', function(data) {
      $('#location-input').val(data);
    });

    socket.on('file-list', function(data) {
      if(!data.length) {
        $fileList.html("No image or md file found. Extensions accepted: 'jpg', 'jpeg', 'png', 'gif', 'JPG', 'md'");
        return;
      }

      var items = '';
      for(var i = 0; i < data.length; i++) {
        items += '<li class="list-group-item">' +
          '<span class="filename">' + data[i] + '</span>' +
          '<a href="#" data-action="print" class="print badge bg-primary">' +
          '<i class="fa fa-print"></i>' +
          '</a>' +
          '</li>';
      }

      $fileList.html(items);
    });
  }

}(jQuery));