// GUI operations

var GUI_module = (function($) {
  'use strict';
  function textContrast(bgColor) {

    var luma = (0.2126 * bgColor.r) + (0.7152 * bgColor.g) + (0.0722 * bgColor.b); // SMPTE C, Rec. 709 weightings
    return (luma >= 165) ? '#333' : '#fff';
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

  GUI.prototype.drawGalleryCarousel = function(photos){
    var html = "";
    photos.forEach(function(photo,i){
      var item = "<div class='item'><img src='" + photo.url +"'>" +
        "<div class='img-description'><h3>"+ photo.name + "</h3>" +
        "<p>" + photo.year + "</p></div></div>";
      html += item;
    });
    $('#gallery-carousel').html(html);
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
      $("#Clanky").css("color", "");
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

  GUI.prototype.resetForm = function() {
    $('#contact-form > input').each(function() {
      var thisObj = $(this);
      if (thisObj.attr("name") === "_gotcha") return;
      if (thisObj.attr("name") === "_next") return;
      var value = thisObj.attr("value");
      var val = thisObj.val("");
      thisObj.next(".filed-value").html(val);
    });
    $('#contact-form textarea').val("Zpráva:");
  };

  GUI.prototype.showThanks = function() {
    this.resetForm();
    $(".contact-msg-row").html('<div class="alert alert-success alert-dimissible fade in"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><h4>Hurá!</h4><p>Vše se podařilo. Děkuji za vaši zprávu.</p></div>');
    setTimeout(function () {
      $(".contact-msg-row > div").alert('close');
    },10000);
  };

  GUI.prototype.showSendError = function(msg) {
    if(msg === "missing value") {
      $(".contact-msg-row").html('<div class="alert alert-danger alert-dimissible fade in"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><h4>Ouha!</h4><p>Při odesílání se stala chyba. Prosím zkontrolujte zda máte vše vyplněno a zkuste to znovu.</p></div>');
      setTimeout(function () {
        $(".contact-msg-row > div").alert('close');
      },10000);
    }
  };

  return GUI;

})($);
