(function($) {
  'use strict';

  $(document).ready(function() {

    var last = 0;
    $(this).on("mousemove", function(e) {
      if (e.timeStamp > last + 500) {
        console.log(e)
        var w = window.innerWidth;
        var h = window.innerHeight;
        var wP = 40 * (e.clientX / w * 0.15 + 0.75);
        var hP = 40 * (e.clientY / h * 0.15 + 0.75);
        last = e.timeStamp;
        //$(".background").css("background-position", wP + "% " + hP + "%");
      }
    });
  });
})($);