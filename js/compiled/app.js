
  "use strict";

  window.APP = {
    views: {},
    instances: {}
  };

  $(function() {
    var convertSMSTime, updateBody;
    APP.init();
    ScrollFix($(".list")[0]);
    ScrollFix($(".messages")[0]);
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
    $(".sms_input").autogrow(function(msg) {
      return console.log("callback msg", msg);
    }, {
      allowEnter: false
    });
    convertSMSTime = function(date) {
      var months, t, time;
      t = new Date(date);
      months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
      return time = "" + (t.getDate()) + " " + months[t.getMonth()] + " " + (t.getFullYear()) + " " + (t.getHours()) + ":" + (t.getMinutes());
    };
    $(".sms_input").on("onMessage", function(e, data) {
      var time, value;
      time = convertSMSTime(data.time);
      value = data.value;
      $(".messages").append("<article class='message cf'><footer><time>" + time + "</time></footer><div class='content'><p>" + value + "</p></div></article>");
      return $(".messages").forEach(function(el) {
        return el.scrollTop = el.scrollHeight;
      });
    });
    updateBody = function() {
      document.body.style.height = "" + window.innerHeight + "px";
      return window.scrollTo(0, 0);
    };
    $('textarea').bind('focus', function() {
      return updateBody();
    });
    return $('textarea').bind('blur', function() {
      return updateBody();
    });
  });
