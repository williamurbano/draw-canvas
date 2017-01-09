var DrawCanvas;

DrawCanvas = (function() {
  var click, context, paint;

  context = null;

  paint = null;

  click = null;

  DrawCanvas.prototype.cursorColor = null;

  function DrawCanvas(canvas) {
    var r;
    this.canvas = canvas;
    this.canvas = typeof this.canvas !== typeof Object ? document.getElementById(this.canvas) : this.canvas;
    this.setContext(this.canvas.getContext('2d'));
    r = this.setPaint(false).setClick([]).setCursorColor(this.colors.red).redraw()._bindDrawEvents();
  }

  DrawCanvas.prototype.getContext = function() {
    return this.context;
  };

  DrawCanvas.prototype.setContext = function(context) {
    this.context = context;
    return this;
  };

  DrawCanvas.prototype.getPaint = function() {
    return this.paint;
  };

  DrawCanvas.prototype.setPaint = function(paint) {
    this.paint = paint;
    return this;
  };

  DrawCanvas.prototype.isPaint = function() {
    if (this.paint === true) {
      return true;
    } else {
      return false;
    }
  };

  DrawCanvas.prototype.setCursorColor = function(hexaCursorColor) {
    this.cursorColor = hexaCursorColor;
    return this;
  };

  DrawCanvas.prototype.getCursorColor = function() {
    return this.cursorColor;
  };

  DrawCanvas.prototype.setLineWidth = function(lineWidth) {
    this.lineWidth = lineWidth;
    return this;
  };

  DrawCanvas.prototype.getLineWidth = function() {
    return this.lineWidth;
  };

  DrawCanvas.prototype.addClick = function(mouseX, mouseY, isDrag) {
    this.click.push({
      mouseX: mouseX,
      mouseY: mouseY,
      isDrag: isDrag === true ? true : false,
      cursorColor: this.getCursorColor(),
      lineWidth: this.getLineWidth()
    });
    return this;
  };

  DrawCanvas.prototype.getClick = function() {
    return this.click;
  };

  DrawCanvas.prototype.setClick = function(click) {
    this.click = click;
    return this;
  };

  DrawCanvas.prototype.redraw = function() {
    var clickCoord, clickStack, i, idx, len, prevClickStack;
    context = this.context;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.lineJoin = "round";
    clickStack = this.getClick();
    for (idx = i = 0, len = clickStack.length; i < len; idx = ++i) {
      clickCoord = clickStack[idx];
      context.beginPath();
      if (clickCoord.isDrag === true && typeof clickStack[idx] !== typeof void 0) {
        prevClickStack = clickStack[idx - 1];
        context.moveTo(prevClickStack.mouseX, prevClickStack.mouseY);
      } else {
        context.moveTo(clickCoord.mouseX - 1, clickCoord.mouseY);
      }
      context.lineTo(clickCoord.mouseX, clickCoord.mouseY);
      context.strokeStyle = clickCoord.cursorColor;
      context.lineWidth = clickCoord.lineWidth;
      context.stroke();
      context.closePath();
    }
    return this;
  };

  DrawCanvas.prototype._bindDrawEvents = function() {
    this.canvas.addEventListener('mousedown', this.mouseDrawHandlerFactory());
    this.canvas.addEventListener('mousemove', this.mouseDrawHandlerFactory());
    this.canvas.addEventListener('mouseup', this.mouseDrawStopHandlerFactory());
    this.canvas.addEventListener('mouseleave', this.mouseDrawStopHandlerFactory());
    return this;
  };

  DrawCanvas.prototype.mouseDrawHandlerFactory = function() {
    var drawCanvas;
    drawCanvas = this;
    return function(e) {
      var isDrag, mouseX, mouseY;
      isDrag = null;
      if (e.type === 'mousedown') {
        drawCanvas.setPaint(true);
        isDrag = false;
      } else if (e.type === 'mousemove' && drawCanvas.isPaint() === true) {
        isDrag = true;
      }
      if (isDrag !== null) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;
        drawCanvas.addClick(mouseX, mouseY, isDrag);
        return drawCanvas.redraw();
      }
    };
  };

  DrawCanvas.prototype.mouseDrawStopHandlerFactory = function() {
    var drawCanvas;
    drawCanvas = this;
    return function(e) {
      return drawCanvas.setPaint(false);
    };
  };

  DrawCanvas.prototype.clearCanvas = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this.setClick([]);
  };

  DrawCanvas.prototype.saveCanvas = function() {
    return window.open(this.canvas.toDataURL());
  };

  DrawCanvas.prototype.colors = {
    red: '#F44336',
    pink: '#E91E63',
    purple: '#9C27B0',
    deep_purple: '#673AB7',
    indigo: '#3F51B5',
    blue: '#2196F3',
    light_blue: '#03A9F4',
    cyan: '#00BCD4',
    teal: '#009688',
    green: '#4CAF50',
    light_green: '#8BC34A',
    lime: '#CDDC39',
    yellow: '#FFEB3B',
    amber: '#FFC107',
    orange: '#FF9800',
    deep_orange: '#FF5722',
    brown: '#795548',
    grey: '#9E9E9E',
    blue_grey: '#607D8B'
  };

  return DrawCanvas;

})();

//# sourceMappingURL=C:/Users/william.urbano/Documents/Projetos/localhost/tests/sigcanvas/dist/js/draw-canvas.js.map
