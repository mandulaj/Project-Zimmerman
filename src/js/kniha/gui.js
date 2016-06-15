var GUI_module = (function($){
  'use strict';
  function GUI(app) {
    this.app = app;
  }
  GUI.prototype.playVideo = function() {
    var myVideo = document.getElementById("video");
    myVideo.play();
  };

  GUI.prototype.hideVideo = function() {
    var videoElement = $("#videopg");
    videoElement.addClass("fade");
    setTimeout(function () {
      videoElement.addClass("hidden");
    },300);
  };
  return GUI;
})($);
