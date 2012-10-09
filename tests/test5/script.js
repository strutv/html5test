
window.addEventListener('load', function () {

  var stage = new createjs.Stage('test-canvas');
  var width = stage.canvas.width;
  var height = stage.canvas.height;
  var cols = 5;
  var rows = 3;
  var cellWidth = width / cols;
  var cellHeight = height / rows;

  var imgs = [
    'icons/heart.png',
    'icons/key.png',
    'icons/location.png',
    'icons/music.png',
    'icons/notepad.png',
    'icons/pencil.png',
    'icons/phone.png',
    'icons/pie chart.png',
    'icons/plug.png',
    'icons/shopping cart.png',
    'icons/smile.png',
    'icons/sound.png',
    'icons/star.png',
    'icons/suitcase.png',
    'icons/tag.png',
    'icons/target.png',
    'icons/tools.png',
    'icons/user_female.png',
    'icons/user_male.png',
    'icons/video.png'
  ];

  var bmps, second = 0;

  var preload = new createjs.PreloadJS(false);
  preload.loadManifest(imgs);
  preload.onComplete = onImagesLoaded;

  function onImagesLoaded() {
    imgs = imgs.map(function (src) {
      return preload.getResult(src).result;
    });
    start();
  }

  function start() {
    bmps = [];
    imgs.forEach(function (img, colIndex) {
      var rowIndex, bmp;
      for (rowIndex = 0; rowIndex < cols; rowIndex ++) {
        bmp = new createjs.Bitmap(img);
        bmp.scaleX = bmp.scaleY = 0.25;
        bmp.y = cellHeight * (colIndex + rowIndex);
        bmp.x = cellWidth  * rowIndex;
        bmps.push(bmp);
      }
    });
    bmps.forEach(function (bmp) {
      stage.addChild(bmp);
    });
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(90);
    createjs.Ticker.addListener(tick);
  }

  var speed = {value: 0}; // px per sec

  function tick(elapsedTime, paused) {
    var dy = speed.value * elapsedTime / 1000;
    bmps.forEach(function (bmp) {
      bmp.y += dy;
      if (bmp.y > height) {
        bmp.y -= cellHeight * imgs.length;
      }
    });
    stage.update();
    showFPS(elapsedTime);
  }

  var rateSpan = document.getElementById('fps');
  var speedInput = document.getElementById('speed');

  function showFPS(elapsedTime) {
    second += elapsedTime;
    if (second > 1000) {
      rateSpan.innerHTML = Math.round(createjs.Ticker.getMeasuredFPS());
      second = 0;
    }
  }

  document.getElementById('go').addEventListener('click', function () {

    // go fullscreen
    var docEl = document.documentElement;
    (document.fullScreen     || document.mozfullScreen     || document.webkitIsFullScreen) ||
    (docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen).call(docEl, Element.ALLOW_KEYBOARD_INPUT);

    createjs.Tween.get(speed).to({
      value: (speed.value > 0) ? 0 : speedInput.value
    }, 300, createjs.Ease.circInOut);
  });

});
