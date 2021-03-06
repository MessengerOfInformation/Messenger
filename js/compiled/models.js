(function() {

  "use strict";

  var collection, collections, models;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  APP.init = function() {
    var _this = this;
    APP.instances.list = new collections.list;
    APP.instances.messages = new collections.messages;
    return APP.instances.messages.bind("inserted", function() {
      var messages;
      console.log("Inserted messages");
      messages = document.getElementById("messages");
      messages.scrollTop = messages.scrollHeight;
      return pageAntimator.slide("left", function() {
        return $(".back").show();
      });
    });
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
      var _this = this;
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
      return this.$el.bind("DOMSubtreeModified", function(e) {
        return _this.trigger("inserted");
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

    row.prototype.open = function() {
      $("#messages_container").show();
      if (!APP.instances.messages.models.length) {
        return APP.instances.messages.fetch();
      } else {
        return APP.instances.messages.reset().fetch();
      }
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

    list.prototype.parse = function(response) {
      response.length = 30;
      return response;
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
      return messages.__super__.initialize.call(this);
    };

    messages.prototype.parse = function(response) {
      response.length = 5;
      return response;
    };

    return messages;

  })();

}).call(this);
