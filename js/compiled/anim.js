(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  $(function() {
    var Antimator, BindPullStates, bindTapState, slideAntimator;
    Antimator = (function() {
      function Antimator(options) {
        var defaultPositions, pos;
        this.options = options;
        this.el = this.options.element;
        this.boundaries = this.options.boundaries || [5, 5, 5, 5];
        this.el.addEventListener("webkitTransitionEnd", __bind(function(e) {
          if ((this.options.callback != null) && typeof this.options.callback === "function") {
            this.options.callback(e, this.pos);
          }
          return this.after(e, this.pos);
        }, this));
        defaultPositions = {
          visible: [0, 0],
          left: [-1, 0],
          right: [1, 0],
          top: [0, -1],
          bottom: [0, 1]
        };
        pos = defaultPositions[this.options.position];
        this.before(pos);
        this.transform(pos);
        this.pos = pos;
      }
      Antimator.prototype.slide = function(dir) {
        var movements;
        movements = {
          set: __bind(function(xy, boundary) {
            var pos, setBoundary;
            setBoundary = this.boundaries[boundary];
            pos = this.pos[xy] + [-1, 1, -1, 1][boundary];
            if (Math.abs(pos) <= setBoundary) {
              this.pos[xy] = pos;
              return true;
            } else {
              return false;
            }
          }, this),
          left: function() {
            return this.set(0, 0);
          },
          right: function() {
            return this.set(0, 1);
          },
          up: function() {
            return this.set(1, 2);
          },
          down: function() {
            return this.set(1, 3);
          }
        };
        if (movements[dir]()) {
          this.before(this.pos);
          return setTimeout(__bind(function() {
            return this.transform(this.pos, 0);
          }, this));
        }
      };
      Antimator.prototype.convertXYZ = function(pos) {
        var ret;
        ret = pos.map(function(x) {
          return x * 100;
        });
        ret.push(0);
        return ret;
      };
      Antimator.prototype.transform = function(pos) {
        pos = this.convertXYZ(pos);
        return this.el.style["webkitTransform"] = "translate3d(" + (pos.join('%,')) + ")";
      };
      Antimator.prototype.before = function(pos) {
        if (pos[0] === 0 && pos[1] === 0) {
          return this.visible = true;
        } else {
          return this.visible = false;
        }
      };
      Antimator.prototype.after = function(event, pos) {
        return null;
      };
      return Antimator;
    })();
    window.pageAntimator = new Antimator({
      element: $(".pages_wrapper")[0],
      position: "visible",
      boundaries: [1, 0, 0, 0]
    });
    $(".back").bind("fastTap", function() {
      var activeRow;
      pageAntimator.slide("right");
      activeRow = $(".list").find(".active");
      return setTimeout(function() {
        return activeRow.removeClass("active");
      }, 400);
    });
    slideAntimator = (function() {
      __extends(slideAntimator, Antimator);
      function slideAntimator() {
        slideAntimator.__super__.constructor.apply(this, arguments);
      }
      slideAntimator.prototype.before = function(pos) {
        slideAntimator.__super__.before.call(this, pos);
        if (this.options.toggle && this.visible) {
          return this.el.style["display"] = "";
        }
      };
      slideAntimator.prototype.after = function(event, pos) {
        if (this.options.toggle && !this.visible) {
          this.el.style["display"] = "none";
        }
        if (pos[1] >= 100) {
          return this.el.style["webkitTransitionTimingFunction"] = "cubic-bezier(.45,.7,.7,1)";
        } else if (pos[1] === 0) {
          return this.el.style["webkitTransitionTimingFunction"] = "cubic-bezier(.3,0,.7,.45)";
        }
      };
      return slideAntimator;
    })();
    window.slideUpAntimator = new slideAntimator({
      element: $(".slide_up")[0],
      position: "bottom",
      toggle: true,
      boundaries: [0, 0, 0, 1]
    });
    $(".write").bind("fastTap", function() {
      return slideUpAntimator.slide("up");
    });
    $(".close").bind("fastTap", function() {
      return slideUpAntimator.slide("down");
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
    bindTapState = function(selector, element, options) {
      var defaults, sel;
      defaults = {
        clearActive: 350
      };
      options = $.extend(defaults, options);
      sel = $(selector);
      sel.delegate(element, "tapInstant", function(e, origEvent) {
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
      sel.delegate(element, "activeTap", function(e, origEvent) {
        var activeTap, el;
        el = activeTap = $(this)[0];
        el.classList.add("active");
        return console.log("Longtap");
      });
      return sel.delegate(element, "endActiveTap", function(e, origEvent) {
        var activeTap, el;
        el = $(this)[0];
        activeTap = void 0;
        el.classList.remove("active");
        return console.log("move");
      });
    };
    bindTapState("#list", ".row", {
      clearActive: false
    });
    return bindTapState(".header", "button");
  });
}).call(this);
