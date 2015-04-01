(function($) {
  'use strict';
  if (window.location.hash) {
    setTimeout(function() {
      var offset = parseInt($(".headspacer").css("margin-bottom").replace(/[A-Za-z]/, "")) - 150;
      window.scrollTo(0, $(window.location.hash).offset().top - offset);
    }, 100);
  }

  function EventHandler() {
    var self = this;
    this.navbarOpen = false;
    $(".nav-toggle").click(this.toggleNav.bind(this));
    $(document).click(this.hiddeNav.bind(this));

    $('nav ul li a').click(function(event) {
      event.preventDefault();
      var target = $(this).attr('href');
      history.pushState(null, null, target);
      self.scrollToElement(target);
    });
    $("#galery-carousel").owlCarousel({
      lazyLoad: true,
      items: 2,
      autoHeight: true,
    });
  }

  EventHandler.prototype.scrollToElement = function(id) {
    var offset = parseInt($(".headspacer").css("margin-bottom").replace(/[A-Za-z]/, "")) - 150;
    $('html,body').animate({
        scrollTop: $(id).offset().top - offset
      }, {
        easing: "easeOutExpo"
      },
      1000);
  };

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
      return;
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
