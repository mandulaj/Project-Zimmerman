var EventHandler_module = (function($){
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
  return EventHandler;
})($);
