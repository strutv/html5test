

Velosiped = {};
Velosiped.utils = {};


Velosiped.utils.loadImages = function (srcs) {
  var imgs = [];
  var onCompleteCallback = null;
  srcs.forEach(function (src) {
    var img = new Image;
    img.src = src;
    img.onload = function () {
      imgs.push(img);
      if (imgs.length == srcs.length) {
        onCompleteCallback && onCompleteCallback(imgs);
      }
    };
  });
  return {then: function (callback) {
    onCompleteCallback = callback;
  }};
};


Velosiped.Animation = function (spriteImg, options, position) {
  var width = spriteImg.width;
  var height = spriteImg.height;
  var frameWidth  = width / options.sheetCols;
  var frameHeight = height / options.sheetRows;
  var source = document.createElement('canvas');
  source.width = width;
  source.height = height;
  source.getContext('2d').drawImage(spriteImg, 0, 0);
  var scale = 1; // no scaling
  var i;
  this.loopFromFrame = options.loopFromFrame;
  this.loopToFrame = options.loopToFrame;
  this.currentFrameIndex = this.loopFromFrame;
  this.frameFrequency = options.frameFrequency;
  this.frameFrequencyCounter = 1;
  this.frames = [];
  for (i = 0; i < options.sheetCols*options.sheetRows; i++) {
    var x = (i % options.sheetCols) * frameWidth;
    var y = (i / options.sheetCols >> 0) * frameHeight;
    this.frames.push([source, x, y, frameWidth, frameHeight, position.x, position.y, frameWidth*scale, frameHeight*scale]);
  }
};
Velosiped.Animation.prototype = {
  draw: function (ctx, t, dt, frame) {
    ctx.drawImage.apply(ctx, this.frames[this.currentFrameIndex]);
    this.frameFrequencyCounter++;
    if (this.frameFrequencyCounter > this.frameFrequency) {
      this.frameFrequencyCounter = 1;
      this.currentFrameIndex++;
      if (this.currentFrameIndex > this.loopToFrame) {
        this.currentFrameIndex = this.loopFromFrame;
      }
    }
  }
};


Velosiped.Stage = function (canvas) {
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext("2d");
  this.update = this.update.bind(this);
};
Velosiped.Stage.prototype = {
  _animations: [],
  add: function (animation) {
    this._animations.push(animation);
  },
  update: function (t, dt, frame) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this._animations.forEach(function (animation) {
      animation.draw(this.ctx, t, dt, frame);
    }, this);
  }
};


Velosiped.Ticker = {
  _listeners: [],
  _times: [],
  frameNum: null,
  startTime: null,
  lastTime: null,
  currentFPS: 0,
  start: function (targetFPS) {
    this.interval = 1000 / targetFPS >> 0;
    this.frameNum = 0;
    this.startTime = Date.now();
    this.lastTime = this.startTime;
    this.handleFrame = this.handleFrame.bind(this);
    this.handleFrame();
  },
  handleFrame: function () {
    setTimeout(this.handleFrame, this.interval);
    var now = Date.now();
    var t = now - this.startTime;
    var dt = this.lastTime ? now - this.lastTime : null;
    this.frameNum++;
    this._times.push(t);
    this._times.length > 100 && this._times.shift();
    this._listeners.forEach(function (listener) {
      listener(t, dt, this.frameNum);
    }, this);
    this.lastTime = now;
  },
  onTick: function (handler) {
    this._listeners.push(handler);
  },
  getMeasuredFPS: function () {
    var
      frames = this._times.length,
      time = this._times[frames-1] - this._times[0];
    return ((1000 * frames / time) * 10 >> 0) / 10;
  }
};

