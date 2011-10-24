(function() {
  "use strict";  window.APP = {
    views: {},
    models: {},
    instances: {}
  };
  $(function() {
    var convertSMSTime, insertBr;
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
    ScrollFix($(".list")[0]);
    ScrollFix($(".messages")[0]);
    insertBr = function(input) {
      var inputx, inputy;
      console.log(input.indexOf(/\r/));
      inputy = input.replace(/[\r]|[\n]/, "<br />");
      inputx = inputy.replace(/\s/, "&nbsp;");
      return inputx;
    };
    return $(".sms_input").on("onMessage", function(e, data) {
      var time, value;
      time = convertSMSTime(data.time);
      value = insertBr(data.value);
      $(".messages").append("<article class='message cf'><footer><time>" + time + "</time></footer><div class='content'><p>" + value + "</p></div></article>");
      return $(".messages").forEach(function(el) {
        return el.scrollTop = el.scrollHeight;
      });
    });
  });
}).call(this);
