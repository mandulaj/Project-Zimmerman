(function($, Papa, md) {
  'use strict';
  // Scroll to content if we have a hash
  if (window.location.hash) {
    setTimeout(function() {
      var offset = parseInt($(".headspacer").css("margin-bottom").replace(/[A-Za-z]/, "")) - 150;
      window.scrollTo(0, $(window.location.hash).offset().top - offset);
    }, 100);
  }

  function truncStr(str, n, useWordBoundary){
         var toLong = str.length>n,
             s_ = toLong ? str.substr(0,n-1) : str;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? s_ + '&hellip;' : s_;
  }
  function parseArticles(articles) {
    for(var i = 0; i < articles.length; i++) {
      articles[i].text = md.toHTML(articles[i].text);
    }
    return articles;
  }

  // API key for data from Google (may be depreciated)
  var DATA_KEY_COMING_UP = "13YRA3JLsSle_UvOP9tWSXm7M15dPKGF_jAR4__2Ous8";

  // Event setup, handler
  function EventHandler(app) {
    var self = this;
    this.app = app;

    // Mobile nav-bar manipulation
    this.navbarOpen = false;
    $(".nav-toggle").click(this.toggleNav.bind(this));
    $(document).click(this.hiddeNav.bind(this));

    $('nav ul li a').click(function(event) {
      event.preventDefault();
      if (!self.navbarOpen) return;
      var target = $(this).attr('href');
      history.pushState(null, null, target);
      self.scrollToElement(target);
    });

    // Gallery
    $("#gallery-carousel").owlCarousel({
      lazyLoad: true,
      items: 2,
    });


    // Book
    var $books = $(".book-container > div.bk-book");
    $books.each(function() {
      var $book = $(this),
        $other = $books.not($book),
        $parent = $book.parent(),
        $page = $book.children('div.bk-page'),
        $bookview = $parent.find('button.bk-bookview'),
        $content = $page.children('div.bk-content'),
        current = 0;

      $parent.find('button.bk-bookback').on('click', function() {

        $bookview.removeClass('bk-active');

        if ($book.data('flip')) {

          $book.data({
            opened: false,
            flip: false
          }).removeClass('bk-viewback').addClass('bk-bookdefault');

        } else {

          $book.data({
            opened: false,
            flip: true
          }).removeClass('bk-viewinside bk-bookdefault').addClass('bk-viewback');

        }

      });

      $bookview.on('click', function() {

        var $this = $(this);

        $other.data('opened', false).removeClass('bk-viewinside').parent().css('z-index', 0).find('button.bk-bookview').removeClass('bk-active');
        if (!$other.hasClass('bk-viewback')) {
          $other.addClass('bk-bookdefault');
        }

        if ($book.data('opened')) {
          $this.removeClass('bk-active');
          $book.data({
            opened: false,
            flip: false
          }).removeClass('bk-viewinside').addClass('bk-bookdefault');
        } else {
          $this.addClass('bk-active');
          $book.data({
            opened: true,
            flip: false
          }).removeClass('bk-viewback bk-bookdefault').addClass('bk-viewinside');
          current = 0;
          $content.removeClass('bk-content-current').eq(current).addClass('bk-content-current');
        }

      });

      if ($content.length > 1) {

        var $navPrev = $('<span class="bk-page-prev">&lt;</span>'),
          $navNext = $('<span class="bk-page-next">&gt;</span>');

        $page.append($('<nav></nav>').append($navPrev, $navNext));

        $navPrev.on('click', function() {
          if (current > 0) {
            --current;
            $content.removeClass('bk-content-current').eq(current).addClass('bk-content-current');
          }
          return false;
        });

        $navNext.on('click', function() {
          if (current < $content.length - 1) {
            ++current;
            $content.removeClass('bk-content-current').eq(current).addClass('bk-content-current');
          }
          return false;
        });

      }

    });

    $(".book-1").click(function() {
      window.location.replace("/kniha");
    });

    // Form

    $('#contact-form > input').each(function() {
      if ($(this).attr("name") === "_gotcha") return;
      /* Save original values */
      var originalValue = $(this).attr('value');
      /* Wrap text fields in div for flipping */
      $(this).wrap('<div class="field-wrap"></div>');
      /* Insert div to show value on reverse side */
      $(this).after('<div class="field-value">' + originalValue + '</div>');
      /* Set the actual inputs to blank */
      $(this).val('');
      /* When typing, update the div on the reverse side. If no text, revert to original */
      $(this).on('input', function() {
        var newValue = $(this).val();
        if (newValue.length > 0) {
          $(this).next('.field-value').html(newValue);
        } else {
          $(this).next('.field-value').html(originalValue);
        }
      });
      /* On blur, flip back */
      $(this).on('focusout', function() {
        $(this).parent().removeClass('flip');
      });


      // Clicking the input fields
      $(this).parent().on('click', function(event) {
        $(this).addClass('flip');
        $(this).find('input').focus();
      });
    });

    // Click on textAREA
    var textareamsg = $('textarea').html();
    $('textarea').html("").val(textareamsg);
    $(document).on('focus', 'textarea', function(event) {
      $(this).css('minHeight', '200px');
      if ($(this).val() === textareamsg) {
        $(this).val("");
      }
    });
    $(document).on('blur', 'textarea', function(event) {
      $(this).css('minHeight', '');
      if ($(this).val() === "") {
        $(this).val(textareamsg);
      }
    });

    /* Make tabbing work again */
    $(document).keydown(function(event) {
      if (event.keyCode != 9) return;
      var inputs = $('input, textarea');
      var maxIndex = inputs.length;
      var currIndex = inputs.index(event.target);
      var targetIndex = 0;
      if (event.shiftKey) {
        // go up the form
        targetIndex = currIndex - 1;
        if (targetIndex <= 0) targetIndex = maxIndex - 1;
      } else {
        // Go down the form
        targetIndex = currIndex + 1;
        if (targetIndex >= maxIndex) targetIndex = 0;
      }
      inputs.eq(targetIndex).click();
    });

    //Article back button
    $(".article-back-btn").click(function(){
      self.app.gui.closeArticle();
    });
    //Opening an article

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

  EventHandler.prototype.submitForm = function(data) {
    $.ajax("http://formspree.io/jakub.aludnam@gmail.com", {
      cache: false,
      data: data,
      success: function(data) {

      }
    });
  };

  EventHandler.prototype.registerArticles = function() {
    var self = this;
    $(".article").click(function(){
      self.scrollToElement("#Clanky");
      self.app.gui.openArticle($(this).index(".article"));
    });
  };




  // GUI operations
  function GUI(app) {
    this.app = app;

  }

  GUI.prototype.drawComingUp = function(data) {
    if (data.length > 0) {
      var ts = "<table class='table'>";
      ts += "<thead><tr><th>Nazev</th><th>Kdy</th><th>Kde</th><th>Co</th><th>Popis</th></thead><tbody>";
      data.forEach(function(data) {
        ts += "<tr>";
        ts += "<td>" + data.name + "</td>";
        ts += "<td>" + data.when + "</td>";
        ts += "<td>" + data.where + "</td>";
        ts += "<td>" + data.what + "</td>";
        ts += "<td>" + data.description + "</td>";
        ts += "</tr>";
      });
      ts += "</tbody></table>";
      $(".coming-up").html(ts);
    }
  };

  GUI.prototype.drawArticles = function(articles){
    var html = "<div class='row'>";
    var i = 0;
    articles.forEach(function(article){
      if (i !== 0 && i%2 === 0) {
        html += "</div><div class='row'>";
      }
      html += "<div class='col-md-6'><div class='article'><h3>" + article.title + "</h3><h4>" + article.date + "</h4><p>" + truncStr(article.text, 200, true) + "<p></div></div>";
      i++;
    });
    html += "</div>";
    $(".articles").html(html);
    this.app.handler.registerArticles();
  };

  GUI.prototype.openArticle = function(artId) {
    $(".article-belt").addClass("slide");
    $("#Clanky").addClass("opened");
    var article = this.app.articles[artId];
    $(".article-open").html("<h3>" + article.title + "</h3><h4>" + article.date + "</h4><p>" + article.text + "<p>");
  };

  GUI.prototype.closeArticle = function(article) {
    $(".article-belt").removeClass("slide");
    $("#Clanky").removeClass("opened");
    $(".article-open").html("");
  };

  // Main App
  function App() {
    var self = this;
    this.handler = new EventHandler(this);
    this.gui = new GUI(this);
    /*
    this.getGoogleData(DATA_KEY_COMING_UP, "0", function(err, data) {
      if (err) {
        console.error(err);
        return;
      }
      self.gui.drawComingUp(data);
    });
    */
    var data = [
      {name: "Praha",when: "2.3.2000", where: "Tu", what: "asdf", description: "cesta tam a sem"}
    ];
    self.gui.drawComingUp(data);

    var articles = [{title: "clanek 1", date: "2.4.2045", text: "lorem ipsum dolor sit"},
    {title: "clanek 2", date: "2.4.2043", text: "Mollit **non** laboris laboris veniam eiusmod sit tempor non elit consectetur ad ea. Nisi in cupidatat incididunt adipisicing irure sint adipisicing enim est. Cupidatat irure amet laboris et ipsum consequat proident consequat consequat deserunt ipsum occaecat do aliqua. Nulla cupidatat voluptate in reprehenderit nostrud est consequat tempor irure ea aute. Veniam laboris aute non ullamco commodo voluptate culpa anim. Commodo aliqua magna sint esse reprehenderit enim irure.lorem  ipsum dolor sit.\n ![alt](/img/katka.jpg)"},
    {title: "clanek 3", date: "2.4.2045", text: "Mollit _non_ laboris laboris veniam eiusmod sit tempor non elit \n ![Image Alt](https://duckduckgo.com/assets/badges/logo_square.64.png)\nconsectetur ad ea. Nisi in cupidatat incididunt adipisicing irure sint adipisicing enim est. Cupidatat irure amet laboris et ipsum consequat proident consequat consequat deserunt ipsum occaecat do aliqua. Nulla cupidatat voluptate in reprehenderit nostrud est consequat tempor irure ea aute. Veniam laboris aute non ullamco commodo voluptate culpa anim. Commodo aliqua magna sint esse reprehenderit enim irure.lorem ipsum dolor sit"},
    {title: "clanek 4", date: "2.4.2045", text: "#Mollit non laboris laboris veniam eiusmod sit tempor non elit consectetur ad ea. Nisi in cupidatat incididunt adipisicing irure sint adipisicing enim est. Cupidatat irure amet laboris et ipsum consequat proident consequat consequat deserunt ipsum occaecat do aliqua. Nulla cupidatat voluptate in reprehenderit nostrud est consequat tempor irure ea aute. Veniam laboris aute non ullamco commodo voluptate culpa anim. Commodo aliqua magna sint esse reprehenderit enim irure.lorem ipsum dolor sit"},
    {title: "clanek 5", date: "2.4.2045", text: "lorem ipsum dolor sit"},
    {title: "clanek 6", date: "2.4.2045", text: "lMollit non laboris laboris veniam eiusmod sit tempor non elit consectetur ad ea. Nisi in cupidatat incididunt adipisicing irure sint adipisicing enim est. Cupidatat irure amet laboris et ipsum consequat proident consequat consequat deserunt ipsum occaecat do aliqua. Nulla cupidatat voluptate in reprehenderit nostrud est consequat tempor irure ea aute. Veniam laboris aute non ullamco commodo voluptate culpa anim. Commodo aliqua magna sint esse reprehenderit enim irure.orem ipsum dolor sit"}];
    articles = parseArticles(articles);
    self.gui.drawArticles(articles);
    self.articles = articles;
  }

  App.prototype.getGoogleData = function(sheetId, gid, cb) {
    var url = "http://docs.google.com/feeds/download/spreadsheets/Export?key=" + sheetId + "&exportFormat=csv&gid=" + gid;

    Papa.parse(url, {
      download: true,
      dynamicTyping: true,
      header: true,
      complete: function(result) {
        if (result.errors.length > 0) return cb(result.errors, null);
        return cb(null, result.data);
      }
    });
  };

  // https://spreadsheets.google.com/feeds/cells/13YRA3JLsSle_UvOP9tWSXm7M15dPKGF_jAR4__2Ous8/od6/public/basic?alt=json
  $(document).ready(function() {
    var app = new App();
  });
})($, Papa,markdown);
