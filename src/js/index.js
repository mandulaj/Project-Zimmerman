(function($) {
  'use strict';

  function EventHandler() {
    var self = this;
    this.navbarOpen = false;


    $(".nav-toggle").click(this.toggleNav.bind(this));
    $(document).click(this.hiddeNav.bind(this));
  }


  EventHandler.prototype.toggleNav = function() {
    var button = $(".nav-toggle");
    var menu = $("nav");
    if (this.navbarOpen) {
      this.navbarOpen = false;
      menu.removeClass("showNav");
      button.removeClass("dropped");
    } else {
      this.navbarOpen = true;
      menu.addClass("showNav");
      button.addClass("dropped");
    }
  };
  EventHandler.prototype.hiddeNav = function(e) {
    var button = $(".nav-toggle");
    var menu = $("nav");
    var target = $(e.target);
    if (e.target == button.get(0) || e.target == menu.get(0) || button.find(target).length !== 0 || menu.find(target).length !== 0) {
      return;
    } else {
      this.navbarOpen = false;
      menu.removeClass("showNav");
      button.removeClass("dropped");
    }
  };



  $(document).ready(function() {
    var handler = new EventHandler();

  });
})($);