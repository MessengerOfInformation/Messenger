(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var $slide_up, Antimator, BindPullStates, bindTapState;
    Antimator = function(element) {
      var el;
      el = element;
      return (function() {
        return {
          goRight: function() {
            return el.style["-webkit-transform"] = "translate3d(-100%,0,0)";
          },
          goLeft: function() {
            return el.style["-webkit-transform"] = "translate3d(0,0,0)";
          }
        };
      })();
    };
    window.pageAntimator = new Antimator($(".pages_wrapper")[0]);
    $(".back").bind("fastTap", function() {
      return pageAntimator.goLeft();
    });
    $slide_up = $(".slide_up");
    $slide_up.vis = false;
    $slide_up.bind("webkitTransitionEnd", function() {
      $slide_up[0].style["webkitTransitionTimingFunction"] = "ease-in";
      if (!$slide_up.vis) {
        $slide_up[0].style["webkitTransitionTimingFunction"] = "ease-out";
        return $slide_up[0].style["display"] = "none";
      }
    });
    $(".write").bind("fastTap", function() {
      $slide_up[0].style["display"] = "";
      setTimeout(function() {
        return $slide_up[0].style["-webkit-transform"] = "translate3d(0,0,0)";
      }, 0);
      return $slide_up.vis = true;
    });
    $(".close").bind("fastTap", function() {
      $slide_up[0].style["-webkit-transform"] = "translate3d(0,100%,0)";
      return $slide_up.vis = false;
    });
    $(".header").bind("touchmove", function(e) {
      return e.preventDefault();
    });
    $(".footer").bind("touchmove", function(e) {
      return e.preventDefault();
    });
    BindPullStates = function(el) {
      this.el = $(el);
      this.pulling = false;
      this.canTrigger = true;
      this.el.bind('touchmove', __bind(function(e) {
        var scrollTop;
        scrollTop = this.el[0].scrollTop;
        if (scrollTop < 0) {
          return this.move(scrollTop);
        }
      }, this)).bind('touchend', __bind(function(e) {
        if (this.pulling) {
          this.el.trigger("stopPull");
          this.pulling = false;
          if (this.canTrigger) {
            this.el.trigger("triggerPull");
            this.canTrigger = false;
            return setTimeout(__bind(function() {
              return this.canTrigger = true;
            }, this), 4000);
          }
        }
      }, this));
      this.threshold = -40;
      return this.move = function(scrollTop) {
        if (scrollTop < this.threshold && this.pulling === false) {
          this.el.trigger("startPull");
          this.pulling = true;
        }
        if (scrollTop > this.threshold && this.pulling) {
          this.el.trigger("stopPull");
          return this.pulling = false;
        }
      };
    };
    new BindPullStates(".list");
    $(".list").bind("startPull", function(e, data) {
      console.log("startPull");
      return $("#rotator")[0].style["webkitTransform"] = "rotate(180deg) translateZ(0)";
    }).bind("stopPull", function() {
      console.log("stopPull");
      return $("#rotator")[0].style["webkitTransform"] = "rotate(0) translateZ(0)";
    }).bind("triggerPull", function() {
      var $notifs, checkTop, top;
      $notifs = $(".notifs");
      top = $(".header").first().height();
      $notifs[0].style["top"] = top + "px";
      console.log("triggerPull");
      return (checkTop = __bind(function() {
        var scrollTop;
        scrollTop = this.scrollTop;
        return setTimeout(function() {
          if (scrollTop >= 0) {
            return $notifs.show(0, function() {
              return setTimeout(function() {
                return $notifs.fadeOut(300);
              }, 2500);
            });
          } else {
            return checkTop();
          }
        }, 100);
      }, this))();
    });
    bindTapState = function(selector, options) {
      var defaults, sel;
      defaults = {
        clearActive: 350
      };
      options = $.extend(defaults, options);
      sel = $(selector);
      sel.bind("tapInstant", function(e, origEvent) {
        var activeTap, el;
        el = activeTap = $(this)[0];
        el.classList.add("active");
        console.log("tapInstant");
        if (options.clearActive) {
          return setTimeout(function() {
            return el.classList.remove("active");
          }, options.clearActive);
        }
      });
      sel.bind("activeTap", function(e, origEvent) {
        var activeTap, el;
        el = activeTap = $(this)[0];
        el.classList.add("active");
        return console.log("Longtap");
      });
      return sel.bind("endActiveTap", function(e, origEvent) {
        var activeTap, el;
        el = $(this)[0];
        activeTap = void 0;
        el.classList.remove("active");
        return console.log("move");
      });
    };
    bindTapState(".row");
    return bindTapState(".header button");
  });
}).call(this);
