(function($, GUI, EventHandler, md) {
  'use strict';
  // Scroll to content if we have a hash
  if (window.location.hash) {
    setTimeout(function() {
      var offset = parseInt($(".headspacer").css("margin-bottom").replace(/[A-Za-z]/, "")) - 150;
      window.scrollTo(0, $(window.location.hash).offset().top - offset);
    }, 100);
  }

  function parseDate(input) {
    var parts = input.split(".");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  function parseArticles(articles) {
    for (var i = 0; i < articles.length; i++) {
      articles[i].text = md.toHTML(articles[i].text);
      // articles[i].date = parseDate(articles[i].date).toLocaleDateString();
    }
    return articles;
  }



  // Main App
  function App() {
    var self = this;
    this.handler = new EventHandler(this);
    this.gui = new GUI(this);
    this.getArticleList();

    var data = [];
    self.gui.drawComingUp(data);
  }
  App.prototype.getArticleList = function() {
    var self = this;
    $.ajax("/data/articles.json", {
      dataType: "json",
      cache: false,
      type: "GET"
    }).done(function(data) {
      self.articles = parseArticles(data.articles);
      self.gui.drawArticles(self.articles);
    });
  };

  App.prototype.getFullArticle = function(path, cb) {
    var self = this;
    $.ajax("/data/articles/" + path, {
      dataType: "text",
      cache: false,
      type: "GET"
    }).done(function(data) {
      cb(md.toHTML(data));
    });
  };


  $(document).ready(function() {
    var app = new App();
  });
})($, GUI_module, EventHandler_module, markdown);
