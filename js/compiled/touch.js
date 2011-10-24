(function() {
  (function($) {
    var activeTap, activeTapDelay, activeTapTimeout, fastTouchTimeout, longTap, longTapDelay, parentIfText, swipeDirection, touch, touchTimeout;
    parentIfText = function(node) {
      if ("tagName" in node) {
        return node;
      } else {
        return node.parentNode;
      }
    };
    swipeDirection = function(x1, x2, y1, y2) {
      var xDelta, yDelta;
      xDelta = Math.abs(x1 - x2);
      yDelta = Math.abs(y1 - y2);
      if (xDelta >= yDelta) {
        if (x1 - x2 > 0) {
          return "Left";
        } else {
          return "Right";
        }
      } else {
        if (y1 - y2 > 0) {
          return "Up";
        } else {
          return "Down";
        }
      }
    };
    activeTap = function() {
      if (touch.last && (Date.now() - touch.last >= activeTapDelay)) {
        if (!(touch.x2 || touch.y2)) {
          $(touch.target).trigger("activeTap");
          return touch.activeTap = true;
        }
      }
    };
    longTap = function() {
      if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
        if (!(touch.x2 || touch.y2)) {
          return $(touch.target).trigger("longTap");
        }
      }
    };
    touch = {};
    touchTimeout = void 0;
    fastTouchTimeout = void 0;
    activeTapTimeout = void 0;
    longTapDelay = 750;
    activeTapDelay = 200;
    $(document).ready(function() {
      return $(document.body).bind("touchstart", function(e) {
        var delta, now;
        now = Date.now();
        delta = now - (touch.last || now);
        touch.target = parentIfText(e.touches[0].target);
        touchTimeout && clearTimeout(touchTimeout);
        fastTouchTimeout && clearTimeout(fastTouchTimeout);
        touch.x1 = e.touches[0].pageX;
        touch.y1 = e.touches[0].pageY;
        if (delta > 0 && delta <= 250) {
          touch.isDoubleTap = true;
        }
        touch.last = now;
        activeTapTimeout = setTimeout(activeTap, activeTapDelay);
        return setTimeout(longTap, longTapDelay);
      }).bind("touchmove", function(e) {
        touch.x2 = e.touches[0].pageX;
        touch.y2 = e.touches[0].pageY;
        if (touch.activeTap) {
          $(touch.target).trigger("endActiveTap", e);
          return touch = {};
        }
      }).bind("touchend", function(e) {
        if (!(touch.x2 && touch.y2)) {
          $(touch.target).trigger("tapInstant", e);
          clearTimeout(activeTapTimeout);
        }
        if (touch.isDoubleTap) {
          $(touch.target).trigger("doubleTap");
          return touch = {};
        } else if (touch.x2 > 0 || touch.y2 > 0) {
          (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) && $(touch.target).trigger("swipe") && $(touch.target).trigger("swipe" + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
          return touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
        } else if ("last" in touch) {
          touchTimeout = setTimeout(function() {
            touchTimeout = null;
            $(touch.target).trigger("tap");
            return touch = {};
          }, 250);
          return fastTouchTimeout = setTimeout(function() {
            fastTouchTimeout = null;
            return $(touch.target).trigger("fastTap");
          }, 100);
        }
      }).bind("touchcancel", function() {
        return touch = {};
      });
    });
    return ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "longTap"].forEach(function(m) {
      return $.fn[m] = function(callback) {
        return this.bind(m, callback);
      };
    });
  })(this.Zepto);
}).call(this);
