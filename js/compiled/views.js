(function() {

  "use strict";

  var templates, view;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  templates = {
    header: Handlebars.templates.header,
    message_footer: Handlebars.templates.message_footer,
    message: Handlebars.templates.message,
    row: Handlebars.templates.row
  };

  view = (function() {

    __extends(view, Backbone.View);

    function view() {
      view.__super__.constructor.apply(this, arguments);
    }

    view.prototype.initialize = function() {
      var _this = this;
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
      this.model.bind('error', function(model, response, options) {
        if (_this.error) return _this.error(model, response, options);
      });
      return this.render();
    };

    view.prototype.render = function() {
      this.el.innerHTML = this.template(this.model.toJSON());
      this.$el = $(this.el);
      return this;
    };

    view.prototype.remove = function() {
      return $(this.el).remove();
    };

    view.prototype.clear = function() {
      return this.model.destroy();
    };

    return view;

  })();

  APP.views.header = (function() {

    __extends(header, view);

    function header() {
      header.__super__.constructor.apply(this, arguments);
    }

    header.prototype.tagName = "header";

    header.prototype.className = "app header";

    header.prototype.template = templates.header;

    header.prototype.render = function() {};

    return header;

  })();

  APP.views.message_footer = (function() {

    __extends(message_footer, view);

    function message_footer() {
      message_footer.__super__.constructor.apply(this, arguments);
    }

    message_footer.prototype.tagName = "footer";

    message_footer.prototype.template = templates.header;

    message_footer.prototype.render = function() {};

    return message_footer;

  })();

  APP.views.row = (function() {

    __extends(row, view);

    function row() {
      row.__super__.constructor.apply(this, arguments);
    }

    row.prototype.tagName = "article";

    row.prototype.className = "row";

    row.prototype.template = templates.row;

    row.prototype.render = function() {
      row.__super__.render.call(this);
      this.deleteButton = $(this.el).find(".delete_m")[0];
      return this.$list = $(".list");
    };

    row.prototype.events = {
      "tapInstant .delete .arrow": "deleteRow",
      "swipeLeft": "deleteState",
      "swipeRight": "deleteState",
      "tapInstant": "open"
    };

    row.prototype.open = function() {
      return this.model.open();
    };

    row.prototype.deleteState = function() {
      var $deleteWrapper;
      var _this = this;
      if (this.deleting) {
        this.deleting = false;
        this.$list.unbind("touchstart touchend");
        return $(this.deleteButton).anim({
          "translate3d": "100%, 0 ,0"
        }, ".2", "ease-out", function() {
          return _this.$el.removeClass("delete");
        });
      } else {
        this.deleting = true;
        this.$el.addClass("delete");
        $(this.deleteButton).anim({
          "translate3d": "0, 0, 0"
        }, ".2", "ease-out", null);
        $deleteWrapper = $(this.el).find(".arrow")[0];
        return this.$list.bind("touchstart", function(e) {
          if (!(e.target === $deleteWrapper || e.target === _this.deleteButton)) {
            return e.stopImmediatePropagation();
          }
        }).bind("touchend", function(e) {
          if (!(e.target === $deleteWrapper || e.target === _this.deleteButton)) {
            e.stopImmediatePropagation();
            return _this.deleteState();
          }
        });
      }
    };

    row.prototype.deleteRow = function(e) {
      e.stopImmediatePropagation();
      this.$el.fadeOut();
      return this.$el.removeClass("delete");
    };

    return row;

  })();

  APP.views.message = (function() {

    __extends(message, view);

    function message() {
      message.__super__.constructor.apply(this, arguments);
    }

    message.prototype.tagName = "article";

    message.prototype.className = "message";

    message.prototype.template = templates.message;

    message.prototype.render = function() {
      return message.__super__.render.call(this);
    };

    return message;

  })();

}).call(this);
