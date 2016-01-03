(function($) {

  var simplemde = new SimpleMDE({
    element: document.getElementById('send-text__input'),
    spellChecker: false,
    toolbar: ['bold', 'italic', 'heading-1', 'quote', 'preview'],
    autosave: {
      enabled: true,
      uniqueId: 'mde_story_text'
    }
  });

  var socket = io('http://localhost:8081');

  $('body').communication({
    socket: socket,
    editor: simplemde
  });

}(jQuery));