var _ = require('lodash');

var MultiMarker = {
  markers: {}
};
var options;

var downloadAll = function() {
  console.log('downloadAll');
  // window.open(MultiMarker.game.canvas.toDataURL('image/png'));
  var markerLayout = MultiMarker.game.canvas.toDataURL('image/png');
  var doc = new jsPDF('landscape');
  doc.addImage(markerLayout, 'PNG', 20, 20, 198, 153);
  doc.save();

  var blob = new Blob([craftDat()], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "multimarker.dat");
};

var preload = function(game) {
  for (var i = 0; i < 63; i++) {
    game.load.image(i, 'img/barcodes/' + i +'.png');
  }
};

var removeMarker = function(markerID) {
  if (MultiMarker.markers[markerID]) {
    MultiMarker.markers[markerID].destroy();
    delete MultiMarker.markers[markerID];
  }
};

var removeAllMarkers = function() {
  $.each(MultiMarker.markers, function(id, markers) {
    removeMarker(id);
  });
};

var addMarker = function(id, x, y) {
  var xPos = (x == undefined) ? 0 : x;
  var yPos = (y == undefined) ? 0 : y;
  var idString = id + '';
  var marker = MultiMarker.game.add.sprite(xPos, yPos, idString);
  // console.log('adding marker', idString, xPos, yPos);
  marker.scale.set(options.scaleFactor);
  marker.smoothed = false;
  marker.inputEnabled = true;
  marker.input.enableDrag();
  marker.input.enableSnap(5, 5, true, true);
  marker.events.onDragStop.add(onDragStopHandler);
  MultiMarker.markers[idString] = marker;

  // MultiMarker.game.input.onTap.add(onTapHandler, marker);
  marker.events.onInputDown.add(onTapHandler, this);
  // marker.events.onTap.add(onTapHandler, this);
  return marker;
};

var onDragStopHandler = function() {
  // console.log('a', arguments);
};


var onTapHandler = function(sprite, pointer) {
  if (pointer.msSinceLastClick < MultiMarker.game.input.doubleTapRate) {
    removeMarker(sprite.key);
  }
};

var create =  function(game) {
  game.stage.backgroundColor = "#FFFFFF";

  // Generate 4x3
  var spacer = 60;
  var x = spacer;
  var y = spacer;
  var xSpace = spacer;
  var ySpace = spacer;
  for (var i = 0; i < 12; i++) {
    var marker = addMarker(i, x, y);
    x += xSpace + marker.width;
    if (i % 4 > 2) {
      y += ySpace +  marker.height;
      x = xSpace;
    }
  }

  // Auto size on small screens
  if (window.innerWidth < 992) {
    // Let game scale with screen
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
  }


  // game.input.onTap.add(onTapHandler, this);

  // console.log(game);

  // var style = { font: "16px Courier", fill: "#f00", tabs: [ 164, 120, 80 ] };
  // var text2 = game.add.text(32, 120, 's', style);
  //
  // var markerDetails = _.map(MultiMarker.markers, function(marker, id) {
  //   console.log(marker);
  //   return [
  //     id,
  //     marker.position.x,
  //     marker.position.y
  //   ];
  // });
  // markerDetails.unshift(['---', '---', '---']);
  // markerDetails.unshift(['ID', 'x', 'y']);
  // text2.parseList(markerDetails);
};

var craftDat = function() {
  var txt = '';

  var addLine = function(line) {
    txt += line + '\r\n';
    return txt;
  };

  addLine('# heading');
  addLine('');

  // Total number of markers
  addLine(_.size(MultiMarker.markers));
  addLine('');

  // Add id
  _.each(MultiMarker.markers, function(marker, id) {
    // Ensure leading 0 on singles
    var idNumber = (id.length > 1) ? id : '0' + id;
    addLine('# marker ' + idNumber);
    // Id of marker
    console.log('---', idNumber);
    addLine(idNumber);
    addLine(options.markerWidth);
    // Matrix
    var x = marker.position.x/2; // * -1
    var y = marker.position.y/2 * -1;
    addLine('1.0000 0.0000 0.0000 ' + x);//'0.0000');
    addLine('0.0000 1.0000 0.0000 ' + y);//'0.0000');
    addLine('0.0000 0.0000 1.0000 ' + '0.0000');
    addLine('');
  });
  return txt;
};

var defaultOptions = {
  markerWidth: 40,
  width: 792,
  height: 612,
  scaleFactor: 8,
  id: 'board',
  callbacks: {
    preload: preload,
    create: create
    // render: render
  }
};

MultiMarker.addMarker = addMarker;
MultiMarker.print = downloadAll;
MultiMarker.clear = removeAllMarkers;

module.exports = function(opts) {
  options = _.defaults(opts, defaultOptions);
  console.log('creating board', options);
  MultiMarker.game = new Phaser.Game(
    options.width,
    options.height,
    Phaser.AUTO,
    // Phaser.CANVAS,
    options.id,
    options.callbacks,
    true // set transparent
  );
  MultiMarker.game.preserveDrawingBuffer = true;
  // MultiMarker.game.canvas.globalAlpha   = 0;
  console.log('-----------');
  console.log(MultiMarker.game);



  return MultiMarker;
};
