(($) ->
  parentIfText = (node) ->
    (if "tagName" of node then node else node.parentNode)
  swipeDirection = (x1, x2, y1, y2) ->
    xDelta = Math.abs(x1 - x2)
    yDelta = Math.abs(y1 - y2)
    if xDelta >= yDelta
      (if x1 - x2 > 0 then "Left" else "Right")
    else
      (if y1 - y2 > 0 then "Up" else "Down")
  activeTap = ->
    if touch.last and (Date.now() - touch.last >= activeTapDelay)
      unless touch.x2 or touch.y2
        $(touch.target).trigger "activeTap"
        touch.activeTap = true
  longTap = ->
    if touch.last and (Date.now() - touch.last >= longTapDelay)
      unless touch.x2 or touch.y2
        $(touch.target).trigger "longTap"
  touch = {}
  touchTimeout = undefined
  fastTouchTimeout = undefined
  activeTapTimeout = undefined
  longTapDelay = 750
  activeTapDelay = 200
  $(document).ready ->
    $(document.body).bind("touchstart", (e) ->
      now = Date.now()
      delta = now - (touch.last or now)
      touch.target = parentIfText(e.touches[0].target)
      touchTimeout and clearTimeout(touchTimeout)
      fastTouchTimeout and clearTimeout(fastTouchTimeout)
      touch.x1 = e.touches[0].pageX
      touch.y1 = e.touches[0].pageY
      touch.isDoubleTap = true  if delta > 0 and delta <= 250
      touch.last = now
      activeTapTimeout = setTimeout activeTap, activeTapDelay
      setTimeout longTap, longTapDelay
    ).bind("touchmove", (e) ->
      touch.x2 = e.touches[0].pageX
      touch.y2 = e.touches[0].pageY
      if touch.activeTap
        $(touch.target).trigger "endActiveTap", e
        touch = {}
    ).bind("touchend", (e) ->
      unless touch.x2 and touch.y2
        $(touch.target).trigger "tapInstant", e
        clearTimeout(activeTapTimeout)
      if touch.isDoubleTap
        $(touch.target).trigger "doubleTap"
        touch = {}
      else if touch.x2 > 0 or touch.y2 > 0
        (Math.abs(touch.x1 - touch.x2) > 30 or Math.abs(touch.y1 - touch.y2) > 30) and $(touch.target).trigger("swipe") and $(touch.target).trigger("swipe" + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0
      else if "last" of touch
        touchTimeout = setTimeout(->
          touchTimeout = null
          $(touch.target).trigger "tap"
          touch = {}
        , 250)
        fastTouchTimeout = setTimeout(->
          fastTouchTimeout = null
          $(touch.target).trigger "fastTap"
        , 100)
    ).bind "touchcancel", ->
      touch = {}

  [ "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "longTap" ].forEach (m) ->
    $.fn[m] = (callback) ->
      @bind m, callback
) @Zepto
