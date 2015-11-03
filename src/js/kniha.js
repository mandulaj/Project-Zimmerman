// Book
(function($) {
  'use strict';

  function checkMobile() {
    if (navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    } else {
      return false;
    }
  }

  function EventHandler(app) {
    this.app = app;
  }

  EventHandler.prototype.start = function() {
    if (checkMobile()) {
      return 0;
    } else {
      this.app.gui.playVideo();
      setTimeout(this.app.gui.hideVideo, 10000);
    }
  };

  function GUI(app) {
    this.app = app;
  }
  GUI.prototype.playVideo = function() {
    $("#videopg").css("display", "block");
    var myVideo = document.getElementById("video");
    myVideo.play();
  };

  GUI.prototype.hideVideo = function() {
    $("#videopg").fadeOut("medium");
  };

  function App() {
    this.gui = new GUI(this);
    this.handler = new EventHandler(this);
  }
  App.prototype.start = function() {
    this.handler.start();
  };

  $(document).ready(function() {
    var app = new App();
    //app.start();
  });
})($);
