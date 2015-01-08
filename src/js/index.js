(function($) {
  'use strict';

  function EventHandler() {
    var navbarOpen = false;

    $(".nav-toggle").click(function() {
      if (navbarOpen) {
        navbarOpen = false;

      } else {
        navbarOpen = true;
      }
    });
  }



  $(document).ready(function() {
    var handler = new EventHandler();

  });
})($);