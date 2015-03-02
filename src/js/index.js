(function($) {
  'use strict';

  function EventHandler() {
    var self = this;
    this.navbarOpen = false;

    function scrollToElement(id) {
      var offset = parseInt($(".headspacer").css("margin-bottom").replace(/[A-Za-z]/, "")) - 150;
      $(id)[0].scrollIntoView();
      scrollBy(0, -offset);
      console.log(id, offset)
    }
    scrollToElement(window.location.hash); // Scroll to element on load
    $(".nav-toggle").click(this.toggleNav.bind(this));
    $(document).click(this.hiddeNav.bind(this));
    //$(window).resize(this.resizeText.bind(this));

    $('nav ul li a').click(function(event) {
      event.preventDefault();
      window.location.hash = $(this).attr('href')
      scrollToElement(window.location.hash);
    });
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
    if (e.target == button.get(0) || button.find(target).length !== 0) {
      return
    }
    this.navbarOpen = false;
    menu.removeClass("showNav");
    button.removeClass("dropped");

  };
  // EventHandler.prototype.resizeText = function() {
  //   if ($("header").hasClass("affix")) {
  //     var width = window.innerWidth;
  //     if (width < 430) {
  //       var height = (width - 65) / 11
  //       $("header .content h1").css("font-size", height + "px")
  //     } else {
  //       $("header .content h1").css("font-size", "")
  //     }
  //   }
  // };



  $(document).ready(function() {
    var handler = new EventHandler();

  });
})($);