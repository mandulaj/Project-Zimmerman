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
    this.gui = new GUI(this);
    this.handler = new EventHandler(this);

    var requestPromises = [];
    requestPromises.push(this.getArticleList());
    requestPromises.push(this.getPhotoList());

    Promise.all(requestPromises).then(function(results){
      var articlesData = results[0];
      self.articles = parseArticles(articlesData.articles);
      self.gui.drawArticles(self.articles);

      var photoData = results[1];
      self.gui.drawGalleryCarousel(photoData);

      var data = [];
      self.gui.drawComingUp(data);

      self.handler.init();
    }, function(err){
      // Do more error checking...
      console.log(err);
    });

    var threads = ["1234", "5678", "9012"];
    var coose = Math.floor(Math.random()*3);
    console.log(coose)
    var thread = threads[coose]


    var disqus = this.makeComments(thread, thread);
    console.log(disqus)
    $("#disqus_thread ").html(disqus);


  }

  App.prototype.getArticleList = function() {
    return this.getJSON("/data/articles.json");
  };

  App.prototype.getPhotoList = function() {
    return this.getJSON("/data/photos.json");
  };

  App.prototype.makeComments= function(id, title){
    var url = "http://mandulova.cz";
    return "<script> var disqus_config = function () {this.page.url = '"+ url +
      "';this.page.identifier = '"+ id +
      "';this.page.title='"+title+
      "'};(function(){var d=document,s=d.createElement('script');s.src='//mandulova.disqus.com/embed.js';s.setAttribute('data-timestamp', +new Date());(d.head||d.body).appendChild(s);})();</script>"+
      "<noscript>Please enable JavaScript to view the <a href='https://disqus.com/?ref_noscript' rel='nofollow'>comments powered by Disqus.</a></noscript>";

  };

  App.prototype.getJSON = function(url){
    return $.ajax(url, {
      dataType: "json",
      cache: false,
      type: "GET"
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
