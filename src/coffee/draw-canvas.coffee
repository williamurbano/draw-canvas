class DrawCanvas
  # Canvas context
  context = null

  # Flag to set if is painting
  paint = null

  # canvas click positions
  # [{ x: ?, y: ?, drag: ? }]
  click = null

  # Current color used
  cursorColor: null

  constructor: (@canvas) ->
    @canvas = if typeof @canvas isnt typeof Object then document.getElementById @canvas else @canvas
    this.setContext this.canvas.getContext '2d'
    r = this.setPaint false
      .setClick []
      .setCursorColor this.colors.red
      .redraw()
      ._bindDrawEvents()

  # Get the canvas context
  getContext: ->
    return this.context

  # Set the canvas context
  setContext: (context) ->
    this.context = context
    return this

  # Get the paint option
  getPaint: ->
    return this.paint

  # Set the paint option
  setPaint: (paint) ->
    this.paint = paint
    return this

  # Check if is painting
  isPaint: ->
    return if this.paint is true then true else false

  # Set the selected cursor color
  setCursorColor: (hexaCursorColor) ->
    this.cursorColor = hexaCursorColor
    return this

  # Get the selected cursor color
  getCursorColor: ->
    return this.cursorColor

  # Set the cursor line width
  setLineWidth: (lineWidth) ->
    this.lineWidth = lineWidth
    return this

  # Get the cursor line width
  getLineWidth: ->
    return this.lineWidth

  # Add a click position
  addClick: (mouseX, mouseY, isDrag) ->
    this.click.push
      mouseX: mouseX
      mouseY: mouseY
      isDrag: if isDrag is true then true else false
      cursorColor: this.getCursorColor()
      lineWidth: this.getLineWidth()

    return this

  # Get all click coordinates
  getClick: ->
    return this.click

  # Set all click coordinates
  setClick: (click) ->
    this.click = click
    return this

  redraw: ->
    context = this.context

    # Clears the canvas
    this.context.clearRect 0, 0, this.canvas.width, this.canvas.height

    context.lineJoin = "round"
    # context.lineWidth = 2.5

    # List of clicks
    clickStack = this.getClick()

    for clickCoord, idx in clickStack
      context.beginPath()

      if clickCoord.isDrag is true and typeof clickStack[idx] isnt typeof undefined
        prevClickStack = clickStack[idx-1]
        context.moveTo prevClickStack.mouseX, prevClickStack.mouseY
      else
        context.moveTo clickCoord.mouseX - 1, clickCoord.mouseY

      context.lineTo clickCoord.mouseX, clickCoord.mouseY
      context.strokeStyle = clickCoord.cursorColor
      context.lineWidth = clickCoord.lineWidth
      context.stroke()
      context.closePath()

    return this

  # Bind click events
  _bindDrawEvents: ->
    this.canvas.addEventListener 'mousedown', this.mouseDrawHandlerFactory()
    this.canvas.addEventListener 'mousemove', this.mouseDrawHandlerFactory()
    this.canvas.addEventListener 'mouseup', this.mouseDrawStopHandlerFactory()
    this.canvas.addEventListener 'mouseleave', this.mouseDrawStopHandlerFactory()
    return this

  # Inject variables into event listener
  # and add the mouse position when event is fired
  mouseDrawHandlerFactory: ->
    drawCanvas = this
    return (e) ->
      isDrag = null

      if e.type is 'mousedown'
        drawCanvas.setPaint true
        isDrag = false
      else if e.type is 'mousemove' and drawCanvas.isPaint() is true
        isDrag = true

      if isDrag isnt null
        mouseX = e.pageX - this.offsetLeft
        mouseY = e.pageY - this.offsetTop
        drawCanvas.addClick mouseX, mouseY, isDrag
        drawCanvas.redraw()

  # Inject variables into event listener
  # and set to false paint option when event is fired
  mouseDrawStopHandlerFactory: ->
    drawCanvas = this
    return (e) ->
      drawCanvas.setPaint false

  clearCanvas: ->
    this.context.clearRect 0, 0, this.canvas.width, this.canvas.height
    this.setClick []

  saveCanvas: ->
    window.open this.canvas.toDataURL()

  colors:
    red: '#F44336'
    pink: '#E91E63'
    purple: '#9C27B0'
    deep_purple: '#673AB7'
    indigo: '#3F51B5'
    blue: '#2196F3'
    light_blue: '#03A9F4'
    cyan: '#00BCD4'
    teal: '#009688'
    green: '#4CAF50'
    light_green: '#8BC34A'
    lime: '#CDDC39'
    yellow: '#FFEB3B'
    amber: '#FFC107'
    orange: '#FF9800'
    deep_orange: '#FF5722'
    brown: '#795548'
    grey: '#9E9E9E'
    blue_grey: '#607D8B'



