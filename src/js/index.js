(function($, Papa, md) {
  'use strict';
  // Scroll to content if we have a hash
  if (window.location.hash) {
    setTimeout(function() {
      var offset = parseInt($(".headspacer").css("margin-bottom").replace(/[A-Za-z]/, "")) - 150;
      window.scrollTo(0, $(window.location.hash).offset().top - offset);
    }, 100);
  }

  // function truncStr(str, n, useWordBoundary){
  //        var toLong = str.length>n,
  //            s_ = toLong ? str.substr(0,n-1) : str;
  //        s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
  //        return  toLong ? s_ + '&hellip;' : s_;
  // }
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

  function colorDecode(color) {
    if (/^#/.test(color)) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      color = color.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    } else {
      var colorArray = color.replace(/rgba?\(/, "").replace(")", "").split(",");
      return {
        r: parseInt(colorArray[0]),
        g: parseInt(colorArray[1]),
        b: parseInt(colorArray[2]),
      };
    }
  }

  function textContrast(bgColor) {
    // var r = bgColor.r * 255,
    //     g = bgColor.g * 255,
    //     b = bgColor.b * 255;
    // var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // return (yiq >= 128) ? '#333' : '#fff';



    var luma = (0.2126 * bgColor.r) + (0.7152 * bgColor.g) + (0.0722 * bgColor.b); // SMPTE C, Rec. 709 weightings
    return (luma >= 165) ? '#333' : '#fff';
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
      var target = $(this).attr('href');
      history.pushState(null, null, target);
      self.scrollToElement(target);
    });

    // Gallery
    $("#gallery-carousel").owlCarousel({
      lazyLoad: true,
      autoPlay: 7000,
      stopOnHover: true,
      items: 3,
      itemsDesktop: [1199, 2],
      itemsDesktopSmall: [979, 1],
      itemsTablet: [600, 1], //2 items between 600 and 0
      itemsMobile: false
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
    $(".article-back-btn").click(function() {
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

    if (this.navbarOpen) {
      this.navbarOpen = false;
      this.app.gui.hideNav();

    } else {
      this.navbarOpen = true;
      this.app.gui.showNav();
    }
  };
  EventHandler.prototype.hiddeNav = function(e) {
    var button = $(".nav-toggle");
    var target = $(e.target);
    if (e.target == button.get(0) || button.find(target).length !== 0) {
      return;
    }
    this.navbarOpen = false;
    this.app.gui.hideNav();

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
    $(".article").click(function() {
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
      ts += "<thead><tr><th>Nazev</th><th>Kdy</th><th>Kde</th><th>Co</th></thead><tbody>";
      data.forEach(function(data) {
        ts += "<tr>";
        ts += "<td>" + data.name + "</td>";
        ts += "<td>" + data.when + "</td>";
        ts += "<td>" + data.where + "</td>";
        ts += "<td>" + data.description + "</td>";
        ts += "</tr>";
      });
      ts += "</tbody></table>";
      $(".coming-up").html(ts);
    }
  };

  GUI.prototype.drawArticles = function(articles) {
    var html = "<div class='row'>";
    var i = 0;
    var style = "";
    articles.forEach(function(article) {
      if (i !== 0 && i % 2 === 0) {
        html += "</div><div class='row'>";
      }
      if (typeof article.bg_color !== "undefined") {
        var textColor = textContrast(colorDecode(article.bg_color));
        style = "style='background: " + article.bg_color + "; color: " + textColor + ";'";
      } else {
        style = "";
      }
      html += "<div class='col-md-6'><div class='article' " + style + "><h3>" + article.title + "</h3><p>" + article.text + "<p></div></div>";
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
    var textColor = textContrast(colorDecode(article.bg_color));
    $("#Clanky").css("color", textColor);
    this.app.getFullArticle(article.path, function(htmltext) {
      $("#Clanky").css("background", article.bg_color);
      $(".article-open").removeClass("loading");
      $(".article-open").html("<h3>" + article.title + "</h3><p>" + htmltext + "<p>");
    });
  };

  GUI.prototype.closeArticle = function(article) {
    $(".article-belt").removeClass("slide");
    $("#Clanky").removeClass("opened");
    // wait until the section closes
    setTimeout(function() {
      $(".article-open").addClass("loading");
      $("#Clanky").css("background", "");
      $(".article-open").html("<div class='article-loader loader-inner line-scale'><div></div><div></div><div></div><div></div><div></div></div>");
    }, 300);

  };

  GUI.prototype.showNav = function() {
    var button = $(".nav-toggle");
    var menu = $("nav");
    menu.addClass("showNav");
    menu.removeClass("purge");
    button.addClass("dropped");
  };

  GUI.prototype.hideNav = function() {
    var button = $(".nav-toggle");
    var menu = $("nav");
    menu.removeClass("showNav");
    button.removeClass("dropped");
    setTimeout(function() {
      menu.addClass("purge");
    }, 200);
  };

  // Main App
  function App() {
    var self = this;
    this.handler = new EventHandler(this);
    this.gui = new GUI(this);
    this.getArticleList();

    var data = [{
      name: "Stopem do Tibetu, Horování 2015",
      when: "28.11.2015",
      where: "Šumperk, Dům kultury",
      description: "Přednáška o velkém i malém Tibetu, který Katka projela stopem od západního království Guge až po východní provincii Kham. Dozvíte se nejen o autonomní oblasti, ale i o tom, kde hledat Tibet jinde než přímo v Tibetu."
    }];
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
      console.log(data);
      cb(md.toHTML(data));
    });
  };

  // App.prototype.getGoogleData = function(sheetId, gid, cb) {
  //   var url = "http://docs.google.com/feeds/download/spreadsheets/Export?key=" + sheetId + "&exportFormat=csv&gid=" + gid;
  //
  //   Papa.parse(url, {
  //     download: true,
  //     dynamicTyping: true,
  //     header: true,
  //     complete: function(result) {
  //       if (result.errors.length > 0) return cb(result.errors, null);
  //       return cb(null, result.data);
  //     }
  //   });
  // };

  // https://spreadsheets.google.com/feeds/cells/13YRA3JLsSle_UvOP9tWSXm7M15dPKGF_jAR4__2Ous8/od6/public/basic?alt=json
  $(document).ready(function() {
    var app = new App();
  });
})($, null, markdown);
