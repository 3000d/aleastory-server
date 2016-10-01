(function($) {
  var socket = io('http://' + window.location.hostname + ':8081');
  var uploader = new SocketIOFileUpload(socket);

  var simplemde = new SimpleMDE({
    element: document.getElementById('send-text__input'),
    spellChecker: false,
    toolbar: ['bold', 'italic', 'heading-1', 'quote', 'preview'],
    autosave: {
      enabled: true,
      uniqueId: 'mde_story_text'
    }
  });



  $('body').communication({
    socket: socket,
    editor: simplemde
  });



  // Image upload
  var $imageUpload = $('#image-upload');
  var $imageUploadInput = $('#image-upload-input');
  var $progressBar = $imageUpload.find('.progress');
  var $successMessage = $imageUpload.find('.success-message');
  $progressBar.hide();
  $successMessage.hide();

  //uploader.listenOnInput(document.getElementById('image-upload-input'));

  $imageUploadInput.on('change', function() {
    var file = $(this)[0].files[0];
    var url = URL.createObjectURL(file);
    var img = new Image();
    var _self = this;

    img.onload = function() {
      if(img.width === 384) {
        uploader.submitFiles($(_self)[0].files);
      } else {
        alert('Image width must be 384px');
      }
    };

    img.src = url;

    return false;
  });

  uploader.addEventListener("progress", function(event){
    var percent = event.bytesLoaded / event.file.size * 100;
    $successMessage.hide();
    $progressBar.show().find('.progress-bar').css({
      width: percent.toFixed(0) + '%'
    });
  });

  // Do something when a file is uploaded:
  uploader.addEventListener("complete", function(event){
    $progressBar.hide();
    $successMessage.show();
  });
}(jQuery));