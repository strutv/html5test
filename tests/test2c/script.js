

var Test2 = {

  targetFPS: 90,

  run: function () {
    Velosiped.utils.loadImages(['img/Sequence1.png']).then(this.onImagesLoaded.bind(this));
    this.fpsEl = document.getElementById('fps');
    this.stage = new Velosiped.Stage(document.getElementById('test-canvas'));
    Velosiped.Ticker.onTick(this.stage.update);
    Velosiped.Ticker.onTick(this.showFPS.bind(this));
  },

  onImagesLoaded: function (imgs) {
    this.stage.add(new Velosiped.Animation(imgs[0], {
      sheetCols: 6,
      sheetRows: 1,
      loopFromFrame: 0,
      loopToFrame: 5,
      frameFrequency: 4
    }, {x: 0, y: 0}));
    Velosiped.Ticker.start(this.targetFPS);
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
    Test2.run();
  });
});
