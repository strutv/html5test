

var Test3 = {

  numAnimations: 100,

  targetFPS: 90,

  stageRows: 10,
  stageCols: 10,

  run: function () {
    this.loadImages().then(this.onImagesLoaded.bind(this));
    this.fpsEl = document.getElementById('fps');
    this.stage = new Velosiped.Stage(document.getElementById('test-canvas'));
    Velosiped.Ticker.onTick(this.stage.update);
    Velosiped.Ticker.onTick(this.showFPS.bind(this));
  },

  onImagesLoaded: function (imgs) {
    this.buildStage(imgs);
    Velosiped.Ticker.start(this.targetFPS);
  },

  loadImages: function () {
    var i, numbers = [];
    for (i = 1; i <= this.numAnimations; i++) {
      numbers.push(i);
    }
    var srcs = numbers.map(function (index) {
      return 'img/Sequence'+index+'.png';
    });
    return Velosiped.utils.loadImages(srcs);
  },

  buildStage: function (imgs) {
    var cellWidth  = this.stage.width / this.stageCols >> 0;
    var cellHeight = this.stage.height / this.stageRows >> 0;
    imgs.forEach(function (img, i) {
      var options = {
        sheetCols: 6,
        sheetRows: 9,
        loopFromFrame: 0,
        loopToFrame: 51,
        frameFrequency: 4
      };
      var position = {
        x: cellWidth  * (i % this.stageCols),
        y: cellHeight * (i / this.stageCols >> 0)
      };
      var animation = new Velosiped.Animation(img, options, position);
      this.stage.add(animation);
    }, this);
  },

  nextTime: null,

  showFPS: function (t, dt, frame) {
    if (t > this.nextTime) {
      this.nextTime += 1000;
      this.fpsEl.innerHTML = Velosiped.Ticker.getMeasuredFPS();
    }
  }

};

window.addEventListener('load', function () {
  document.getElementById('run-btn').addEventListener('click', function (e) {
    e.currentTarget.disabled = true;
    Test3.run();
  });
});
