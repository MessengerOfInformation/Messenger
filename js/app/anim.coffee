$ ->
  
  class Antimator
    constructor : ( @options ) ->
      @el = @options.element
      # default MAX boundaries => 5 screens in all directions from visible origin 0,0
      # 1 unit = one screen width/height 
      # [x0 (left), x1 (right), y0 (up), y1 (down)]
      @boundaries = @options.boundaries or [ 5, 5, 5, 5 ]
      
      # Bind transition end on element
      @el.addEventListener "webkitTransitionEnd", (e) =>
        if @options.callback? and typeof @options.callback is "function"
          @options.callback e, @pos
        @after e, @pos
      
      defaultPositions =
        # -X+, -Y+
        visible : [ 0, 0 ]
        left    : [-1, 0 ]
        right   : [ 1, 0 ]
        top     : [ 0,-1 ]
        bottom  : [ 0, 1 ]
      pos = defaultPositions[@options.position]
      
      # initial setup
      @before pos
      @transform pos
      @pos = pos
      
    slide : ( dir ) ->
      movements =
        set : ( xy, boundary ) =>
          setBoundary = @boundaries[boundary]
          pos = @pos[xy] + [ -1, 1, -1, 1 ][boundary]
          # if positive int of new pos is within the set boundary
          # all boundary points are positive ints
          if Math.abs(pos) <= setBoundary
            @pos[xy] = pos
            true
          else
            false
        left  : -> @set 0, 0 # x position, left boundary
        right : -> @set 0, 1 # x position, right boundary
        up    : -> @set 1, 2 # y position, top boundary 
        down  : -> @set 1, 3 # y position, bottom boundary
      
      # returns true / false
      if movements[ dir ]()
        @before @pos
        setTimeout => @transform @pos, 0
    convertXYZ : ( pos ) ->
      ret = pos.map ( x ) -> x * 100
      ret.push 0
      ret
    transform : ( pos ) ->
      pos = @convertXYZ pos
      @el.style["webkitTransform"] = "translate3d(#{ pos.join('%,') })"
    # called before each transform
    before : ( pos ) ->
      if pos[0] is 0 and pos[1] is 0 
        @visible = true
      else
        @visible = false
    # called after each completed transform
    after : ( event, pos ) -> null
  
  #-------------------------#

  window.pageAntimator = new Antimator 
    element : $(".pages_wrapper")[0]
    position : "visible"
    # => can move one screen to the left
    boundaries : [ 1, 0, 0, 0 ] 
  $(".back").bind "fastTap", ->
    pageAntimator.slide("right")
    
    ## XXXXX (todo) temp shit
    # need to build some behaviour abstraction layer
    activeRow = $(".list").find(".active")
    setTimeout ->
      activeRow.removeClass "active"
    , 400
    
  # --------------
  # Slide up stuff
  
  class slideAntimator extends Antimator
    before : ( pos ) ->
      super pos
      
      if @options.toggle and @visible
        @el.style["display"] = ""
    after : ( event, pos ) ->
      if @options.toggle and !@visible
        @el.style["display"] = "none"
        
      if pos[1] >= 100
        @el.style["webkitTransitionTimingFunction"] = "cubic-bezier(.45,.7,.7,1)"
      else if pos[1] is 0
        @el.style["webkitTransitionTimingFunction"] = "cubic-bezier(.3,0,.7,.45)"
  
  window.slideUpAntimator = new slideAntimator
    element : $(".slide_up")[0]
    position : "bottom"
    toggle : true
    # => one screen down 
    # starting position is the same, so can only move up one screen
    boundaries : [ 0, 0, 0, 1 ] 
  
  # Bind slide screen actions
  $(".write").bind "fastTap", ->
    slideUpAntimator.slide("up")
  
  $(".close").bind "fastTap", ->
    slideUpAntimator.slide("down")
  
  # --------------
  
  # Prevent touchmove on footer and header
  $(".header").bind "touchmove", (e) ->
    e.preventDefault()
  $(".footer").bind "touchmove", (e) ->
    e.preventDefault()

  # --------------
  # --------------
  
  # Pull to refresh constructor - dispacher
  # Events: startPull, stopPull, triggerPull
  BindPullStates = (el) ->
    @el = $ el
    @pulling = false
    @canTrigger = true
    @el.bind( 'touchmove', (e) =>
      scrollTop = @el[0].scrollTop
      if scrollTop < 0
        @move scrollTop
    ).bind 'touchend', (e) =>
      if @pulling
        @el.trigger "stopPull"
        @pulling = false
        if @canTrigger
          @el.trigger "triggerPull"
          @canTrigger = false
          setTimeout =>
            @canTrigger = true
          , 4000
    @threshold = -40
    @move = (scrollTop) ->
      if scrollTop < @threshold and @pulling == false
        @el.trigger "startPull"
        @pulling = true
      if scrollTop > @threshold and @pulling
        @el.trigger "stopPull"
        @pulling = false
  
  # Bind pull to refresh events to .list selector
  new BindPullStates ".list"
  
  # --------------
  # --------------

  # Bind startPull, rotate, show something for refresh
  # "Release to refresh"
  $(".list").bind( "startPull", (e, data) ->
    console.log "startPull"
    $("#rotator")[0].style["webkitTransform"] = "rotate(180deg) translateZ(0)"
  
  # stopPull, triggered when triggerPull fires or when dragging back down
  ).bind( "stopPull", ->
    console.log "stopPull"
    $("#rotator")[0].style["webkitTransform"] = "rotate(0) translateZ(0)"
  
  # Trigger a ugly temp message
  ).bind "triggerPull", ->
    $notifs = $(".notifs")
    top = $(".header").first().height()
    $notifs[0].style["top"] = top + "px"
    console.log "triggerPull"
    do checkTop = =>
      scrollTop = @scrollTop
      setTimeout ->
        if scrollTop >= 0
          $notifs.show 0, ->
            setTimeout ->
              $notifs.fadeOut 300
            , 2500
        else
          checkTop()
      , 100
  
  # --------------
  # --------------
  
  bindTapState = ( selector, element, options ) ->
    defaults =
      clearActive : 350
    options = $.extend defaults, options
    sel = $ selector
    sel.delegate element, "tapInstant", (e, origEvent) ->
      el = activeTap = $(this)[0]
      el.classList.add "active"
      console.log "tapInstant"
      if options.clearActive
        setTimeout ->
          el.classList.remove "active"
        , options.clearActive
      
    sel.delegate element, "activeTap", (e, origEvent) ->
      el = activeTap = $(this)[0]
      el.classList.add "active"
      console.log "Longtap"
    sel.delegate element, "endActiveTap", (e, origEvent) ->
      el = $(this)[0]
      activeTap = undefined
      el.classList.remove "active"
      console.log "move"
      
  bindTapState "#list", ".row", clearActive : false
  bindTapState ".header", "button"

  # --------------
  # --------------
