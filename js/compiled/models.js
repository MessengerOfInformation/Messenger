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
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    collection.prototype.initialize = function(models, options) {
      var elem;
      elem = document.getElementById(this.el);
      this.$el = $("#" + this.el);
      this.bind("reset", function(collection, options) {
        var container, model, _i, _len, _ref;
        container = document.createDocumentFragment();
        _ref = collection.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          container.appendChild(this.render(model));
        }
        return elem.appendChild(container);
      });
      this.bind("add", function(model, options) {
        return elem.appendChild(this.render(model));
      });
      return this.$el.bind("DOMSubtreeModified", __bind(function(e) {
        return this.trigger("inserted");
      }, this));
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
    row.prototype.convertTime = function(time) {
      var date, padDate, t;
      t = new Date(time);
      padDate = function(n) {
        return (n < 10 ? '0' : '') + n;
      };
      return date = "" + (t.getFullYear()) + "-" + (padDate(t.getMonth() + 1)) + "-" + (padDate(t.getDate()));
    };
    row.prototype.initialize = function() {
      var time;
      time = this.get("time");
      return this.set({
        "time": this.convertTime(time)
      });
    };
    return row;
  })();
  collections.list = (function() {
    __extends(list, collection);
    function list() {
      list.__super__.constructor.apply(this, arguments);
    }
    list.prototype.view = "row";
    list.prototype.model = models.row;
    list.prototype.url = "data/list.json";
    list.prototype.el = "list";
    list.prototype.initialize = function(models, options) {
      list.__super__.initialize.call(this);
      return this.fetch();
    };
    list.prototype.comparator = function(row) {
      return -row.get("time");
    };
    list.prototype.open = function() {
      var $pages_wrapper, messages;
      messages = new collections.messages;
      $pages_wrapper = $(".pages_wrapper");
      $pages_wrapper.bind("webkitTransitionEnd", function() {});
      return messages.bind("inserted", function() {
        console.log("locked and loaded");
        $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
        return pageAntimator.goRight();
      });
    };
    return list;
  })();
  models.message = (function() {
    __extends(message, Backbone.Model);
    function message() {
      message.__super__.constructor.apply(this, arguments);
    }
    message.prototype.convertSMSTime = function(time) {
      var date, months, t;
      t = new Date(time);
      months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
      return date = "" + (t.getDate()) + " " + months[t.getMonth()] + " " + (t.getFullYear()) + " " + (t.getHours()) + ":" + (t.getMinutes());
    };
    message.prototype.initialize = function() {
      var time;
      time = this.get("time");
      return this.set({
        "time": this.convertSMSTime(time)
      });
    };
    return message;
  })();
  collections.messages = (function() {
    __extends(messages, collection);
    function messages() {
      messages.__super__.constructor.apply(this, arguments);
    }
    messages.prototype.view = "message";
    messages.prototype.model = models.message;
    messages.prototype.url = "data/list.json";
    messages.prototype.el = "messages";
    messages.prototype.initialize = function(models, options) {
      messages.__super__.initialize.call(this);
      return this.fetch();
    };
    messages.prototype.parse = function(response) {
      response.length = 50;
      return response;
    };
    return messages;
  })();
}).call(this);
