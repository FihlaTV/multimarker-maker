var Board = require('./marker-maker');

(function($) {
  var width, height;
  var board, cancelBtn, downloadBtn, markerSelector;

  var print = function() {
    board.print();
  };

  var addMarkersToList = function(selectEl) {
    var selector = $(selectEl);
    if (selector.length == 0) {
      console.error('selector not found');
      return;
    }
    for (var i=0; i < 64; i++) {
      var option = '<option value="' + i +'">' + i + '</option>';
      $(option).appendTo(selector);
    }
  };

  var init = function() {
    console.log(':::   init   :::');
    width = $( window ).width();
    height = $( window ).height();
    cancelBtn = $('.clear-btn');
    downloadBtn = $('.print-btn');
    markerSelector = $('#markerAddition');

    board = Board({
      id: 'board'
    });

    downloadBtn.click(function(evt) {
      evt.preventDefault();
      board.print();
    });

    cancelBtn.click(function(evt) {
      evt.preventDefault();
      board.clear();
    });

    markerSelector.change(function(evt) {
      var selector = $(evt.currentTarget);
      var markerID = selector.val();
      board.addMarker(markerID);
      selector.get(0).selectedIndex = 0;
    });

    addMarkersToList(markerSelector);

  };

  $(function() {
    init();
  });
})(jQuery);
