var EventHandler_module = (function($) {
  'use strict';
  // Event setup, handler
  function EventHandler(app) {
    this.app = app;
  }

  EventHandler.prototype.init = function() {
    var self = this;
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
    var owl = $("#gallery-carousel");
    owl.owlCarousel({
      stagePadding: 50,
      margin: 10,
      autoplay:true,
      autoplayTimeout:7000,
      autoplayHoverPause:true,
      loop: true,
      // TODO: fix lazyLoad
      //lazyLoad: true,
      responsive:{
        0:{
            items:1
        },
        700:{
            items:2
        },
        1600:{
            items:3
        }
      }
    });
    owl.on('mousewheel', '.owl-stage', function (e) {
      // TODO: fix originalEvetn - should not be needed
      if (e.originalEvent.deltaY>0) {
        owl.trigger('next.owl');
      } else {
        owl.trigger('prev.owl');
      }
      e.preventDefault();
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
      if ($(this).attr("name") === "_next") return;
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
      if ($(this).val() === textareamsg) {
        $(this).val("");
      }
    });
    $(document).on('blur', 'textarea', function(event) {
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

    $('.contact_submit').click(function(e){
      e.preventDefault();
      self.submitForm();
    });
  };

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
    var self = this;
    $(".contact-msg-row > div").alert('close');
    var valuesToGet = {
      "Jméno":"#contact-form input[name=name]",
      "_replyto":"#contact-form input[name=_replyto]",
      "Zpráva":"#contact-form textarea",
      "_gotcha":"#contact-form input[name=_gotcha]"
    };
    var valuesData = {};

    for (var name in valuesToGet) {
      var val = $(valuesToGet[name]).val();
      if ((name !== "_gotcha" && val === "") || (name === "Zpráva" && val === "Zpráva:")) {
        self.app.gui.showSendError("missing value");
        return;
      }
      valuesData[name] = val;
    }

    $.ajax("http://formspree.io/mandulova@gmail.com", {
      cache: false,
      data: valuesData,
      dataType:"json",
      method: "POST",
      success: function(data) {
        if(data.success == "email sent") {
          self.app.gui.showThanks();
        }
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

  return EventHandler;

})($);
