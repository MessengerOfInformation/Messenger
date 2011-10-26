(function() {
  "use strict";
  var templates, view;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
      this.model.bind('error', __bind(function(model, response, options) {
        if (this.error) {
          return this.error(model, response, options);
        }
      }, this));
      return this.render();
    };
    view.prototype.render = function() {
      this.el.innerHTML = this.template(this.model.toJSON());
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
      return row.__super__.render.call(this);
    };
    row.prototype.events = {
      "tapInstant": "open",
      "swipeLeft": "delete"
    };
    row.prototype.open = function() {
      return this.collection.open();
    };
    row.prototype["delete"] = function() {
      return alert("delete");
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
