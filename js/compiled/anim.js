(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $(function() {
    var Antimator, BindPullStates, bindTapState, slideAntimator;
    Antimator = (function() {

      function Antimator(options) {
        var defaultPositions;
        var _this = this;
        this.options = options;
        this.el = this.options.element;
        this.boundaries = this.options.boundaries || [5, 5, 5, 5];
        this.el.addEventListener("webkitTransitionEnd", function(e) {
          if ((_this.options.callback != null) && typeof _this.options.callback === "function") {
            _this.options.callback(e, _this.pos);
          }
          if (_this.options.slideCallback) {
            _this.options.slideCallback(e, _this.pos);
            _this.options.slideCallback = void 0;
          }
          return _this.after(e, _this.pos);
        });
        defaultPositions = {
          visible: [0, 0],
          left: [-1, 0],
          right: [1, 0],
          top: [0, -1],
          bottom: [0, 1]
        };
        this.pos = defaultPositions[this.options.position];
      }

      Antimator.prototype.init = function() {
        this.before(this.pos);
        return this.transform(pos);
      };

      Antimator.prototype.slide = function(direction, callback) {
        var movements;
        var _this = this;
        movements = {
          set: function(boundary) {
            var pos, setBoundary, xy;
            setBoundary = _this.boundaries[boundary];
            xy = boundary > 1 ? 1 : 0;
            pos = _this.pos[xy] + [-1, 1, -1, 1][boundary];
            if (Math.abs(pos) <= setBoundary) {
              _this.pos[xy] = pos;
              return true;
            } else {
              return false;
            }
          },
          left: function() {
            return this.set(0);
          },
          right: function() {
            return this.set(1);
          },
          up: function() {
            return this.set(2);
          },
          down: function() {
            return this.set(3);
          }
        };
        if (typeof callback === "function") this.options.slideCallback = callback;
        if (movements[direction]()) {
          this.before(this.pos);
          return setTimeout(function() {
            return _this.transform(_this.pos, 0);
          });
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
        var isVisible;
        isVisible = pos.every(function(x) {
          return x === 0;
        });
        if (isVisible) {
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
      pageAntimator.slide("right", function() {
        $(".back").hide();
        return $("#messages_container").hide();
      });
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
    BindPullStates = function(el) {
      var _this = this;
      this.el = $(el);
      this.pulling = false;
      this.canTrigger = true;
      this.el.bind('touchmove', function(e) {
        var scrollTop;
        scrollTop = _this.el[0].scrollTop;
        if (scrollTop < 0) return _this.move(scrollTop);
      }).bind('touchend', function(e) {
        if (_this.pulling) {
          _this.el.trigger("stopPull");
          _this.pulling = false;
          if (_this.canTrigger) {
            _this.el.trigger("triggerPull");
            _this.canTrigger = false;
            return setTimeout(function() {
              return _this.canTrigger = true;
            }, 4000);
          }
        }
      });
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
      var _this = this;
      $notifs = $(".notifs");
      top = $(".header").first().height();
      $notifs[0].style["top"] = top + "px";
      console.log("triggerPull");
      return (checkTop = function() {
        var scrollTop;
        scrollTop = _this.scrollTop;
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
      })();
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
