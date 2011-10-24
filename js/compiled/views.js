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
    header: Handlebars.compile(document.getElementById("header_template").innerHTML),
    message_footer: Handlebars.compile(document.getElementById("message_footer_template").innerHTML),
    message: Handlebars.compile(document.getElementById("message_template").innerHTML),
    row: Handlebars.compile(document.getElementById("row_template").innerHTML),
    list_search: Handlebars.compile(document.getElementById("list_search_template").innerHTML)
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
      $(this.el).html(this.template(this.model.toJSON()));
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
  APP.views.row = (function() {
    __extends(row, view);
    function row() {
      row.__super__.constructor.apply(this, arguments);
    }
    row.prototype.template = templates.row;
    row.prototype.render = function() {
      return row.__super__.render.call(this);
    };
    return row;
  })();
}).call(this);
