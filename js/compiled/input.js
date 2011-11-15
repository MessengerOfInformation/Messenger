
  (function($) {
    "use strict";
    var Autogrow, trim;
    trim = function(str) {
      if (''.trim) {
        return str.trim();
      } else {
        return $.trim(str);
      }
    };
    $.fn.autogrow = function(fn, opts) {
      var defaults;
      if (opts == null) opts = {};
      if (typeof fn === "function") {
        opts.fn = fn;
      } else {
        opts = fn;
      }
      defaults = {
        allowEnter: true
      };
      return this.each(function(i, el) {
        return new Autogrow($(el), $.extend(defaults, opts));
      });
    };
    return Autogrow = (function() {

      function Autogrow($el, options) {
        var _this = this;
        this.$el = $el;
        this.options = options;
        this.el = this.$el[0];
        this.el.style["resize"] = "none";
        this.el.style["webkitTransition"] = "height .3s";
        this.el.style["overflowY"] = "hidden";
        this.$form = this.$el.parent("form");
        this.$submit = this.$form.find("[type=submit]");
        this.$el.bind("keypress", function(e) {
          var input;
          input = e.target.value;
          _this.setHeight(trim(input));
          return _this.handleInput(e, input);
        });
        this.$form.bind("submit", function(e) {
          var input;
          input = _this.el.value;
          return _this.handleInput(e, input);
        });
        this.maxHeight = parseInt(this.$el.css("max-height"), 10);
        this.elHeight = 0;
      }

      Autogrow.prototype.setHeight = function(input) {
        var height, scrollHeight;
        if (!input) {
          this.el.style["height"] = "";
          return this.elHeight = 0;
        }
        scrollHeight = this.el.scrollHeight;
        height = this.el.getBoundingClientRect().height || this.$el.outerHeight();
        if (!this.heightDiff) this.heightDiff = (scrollHeight - height) || 0;
        if (scrollHeight > height) {
          this.elHeight = scrollHeight - this.heightDiff;
          this.el.style["height"] = this.elHeight + "px";
        }
        if (this.maxHeight && this.elHeight > this.maxHeight) {
          return this.el.style["overflowY"] = "visible";
        } else if (this.maxHeight && this.el.style["overflowY"] === "visible") {
          return this.el.style["overflowY"] = "hidden";
        }
      };

      Autogrow.prototype.handleInput = function(e, input) {
        var submitAllowed, trimmed;
        if (e.keyCode === 13 || e.type === "submit") {
          e.preventDefault();
          trimmed = trim(input);
          submitAllowed = e.type === "submit" || this.options.allowEnter;
          if (trimmed && submitAllowed) {
            this.triggerOutput(input);
            this.el.value = "";
            this.el.focus();
            this.setHeight(false);
          }
          if (trimmed && submitAllowed === false) {
            this.el.value += "\r";
            return this.setHeight(true);
          }
        }
      };

      Autogrow.prototype.triggerOutput = function(input) {
        var message;
        message = {
          time: +new Date(),
          value: input
        };
        this.$el.trigger("onMessage", message);
        if (this.options.fn) this.options.fn(message);
        return message;
      };

      return Autogrow;

    })();
  })(this.Zepto || this.jQuery);
