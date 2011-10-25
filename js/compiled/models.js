(function() {
  "use strict";
  var collection, collections, models;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  APP.init = function() {
    return new collections.list;
  };
  models = {};
  collections = {};
  collection = (function() {
    __extends(collection, Backbone.Collection);
    function collection() {
      collection.__super__.constructor.apply(this, arguments);
    }
    collection.prototype.model = models[collection.view];
    collection.prototype.initialize = function(models, options) {
      var elem;
      elem = document.getElementById(this.el);
      this.bind("reset", function(collection, options) {
        var container, model, _i, _len, _ref;
        container = document.createDocumentFragment();
        _ref = collection.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          container.appendChild(this.render(model));
        }
        elem.appendChild(container);
        if (this.post_render) {
          return this.post_render(collection, options);
        }
      });
      return this.bind("add", function(model, options) {
        return elem.appendChild(this.render(model));
      });
    };
    collection.prototype.render = function(model) {
      return (new APP.views[this.view]({
        model: model,
        collection: this
      })).el;
    };
    return collection;
  })();
  models.row = (function() {
    __extends(row, Backbone.Model);
    function row() {
      row.__super__.constructor.apply(this, arguments);
    }
    return row;
  })();
  collections.list = (function() {
    __extends(list, collection);
    function list() {
      list.__super__.constructor.apply(this, arguments);
    }
    list.prototype.view = "row";
    list.prototype.url = "data.json";
    list.prototype.el = "albums";
    list.prototype.initialize = function(models, options) {
      return list.__super__.initialize.call(this);
    };
    return list;
  })();
}).call(this);
