// Book
(function($, GUI, EventHandler) {
  'use strict';

  function App() {
    this.gui = new GUI(this);
    this.handler = new EventHandler(this);
  }
  App.prototype.start = function() {
    this.handler.start();
  };

  $(document).ready(function() {
    var app = new App();
    app.start();
  });
})($, GUI_module, EventHandler_module);
