$ ->
  
  Antimator = (element) ->
    el = element
    do ->
      goRight : ->
        el.style["-webkit-transform"] = "translate3d(-100%,0,0)"
      goLeft : ->
        el.style["-webkit-transform"] = "translate3d(0,0,0)"
  
  window.pageAntimator = new Antimator $(".pages_wrapper")[0]
  
  $(".back").bind "fastTap", ->
    pageAntimator.goLeft()
  
  # --------------
  # Slide up stuff
  $slide_up = $(".slide_up")
  $slide_up.vis = false
  $slide_up.bind "webkitTransitionEnd", ->
    $slide_up[0].style["webkitTransitionTimingFunction"] = "ease-in"
    unless $slide_up.vis
      $slide_up[0].style["webkitTransitionTimingFunction"] = "ease-out"
      $slide_up[0].style["display"] = "none"
  
  $(".write").bind "fastTap", ->
    $slide_up[0].style["display"] = ""
    setTimeout  ->
      $slide_up[0].style["-webkit-transform"] = "translate3d(0,0,0)"
    , 0
    $slide_up.vis = true

  $(".close").bind "fastTap", ->
    $slide_up[0].style["-webkit-transform"] = "translate3d(0,100%,0)"
    $slide_up.vis = false
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

  bindTapState = ( selector, options ) ->
    defaults =
      clearActive : 350
    options = $.extend defaults, options
    sel = $ selector
    sel.bind "tapInstant", (e, origEvent) ->
      el = activeTap = $(this)[0]
      el.classList.add "active"
      console.log "tapInstant"
      if options.clearActive
        setTimeout ->
          el.classList.remove "active"
        , options.clearActive
      
    sel.bind "activeTap", (e, origEvent) ->
      el = activeTap = $(this)[0]
      el.classList.add "active"
      console.log "Longtap"
    sel.bind "endActiveTap", (e, origEvent) ->
      el = $(this)[0]
      activeTap = undefined
      el.classList.remove "active"
      console.log "move"
      
  bindTapState ".row"
  bindTapState ".header button"

  # --------------
  # --------------
