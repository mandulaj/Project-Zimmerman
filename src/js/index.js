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
      itemsDesktop : [1199,2],
      itemsDesktopSmall : [979,1],
      itemsTablet: [600,1], //2 items between 600 and 0
      itemsMobile : false
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

  GUI.prototype.showNav = function(){
    var button = $(".nav-toggle");
    var menu = $("nav");
    menu.addClass("showNav");
    menu.removeClass("purge");
    button.addClass("dropped");
  };

  GUI.prototype.hideNav = function(){
    var button = $(".nav-toggle");
    var menu = $("nav");
    menu.removeClass("showNav");
    button.removeClass("dropped");
    setTimeout(function(){
      menu.addClass("purge");
    },200);
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

    var articles = [{title: "SAMA STOPEM NA DÁLNÝ VÝCHOD", date: "2.4.2045", text: "Stop do Vladislavi nen\u00ED zrovna v\u00FDhra, kdy\u017E m\u00E1 \u010Dlov\u011Bk nam\u00ED\u0159eno z T\u0159eb\u00ED\u010De do Vladivostoku. Ale n\u011Bjak se protlu\u010Du. Vol\u00EDm nejkrat\u0161\u00ED trasu, kterou l\u00EDtaj\u00ED letadla, ale kdybych let\u011Bla, m\u011Bla bych to p\u0159\u00EDli\u0161 jednoduch\u00E9. Ve Var\u0161av\u011B pozn\u00E1v\u00E1m lavi\u010Dku, kde jsem kdysi probd\u011Bla noc. V Rize posouv\u00E1m hodinky poprv\u00E9 o hodinu nap\u0159ed. Kdy\u017E se pt\u00E1m, kudy do Moskvy, kdosi m\u00E1vne ledabyle rukou sm\u011Brem k v\u00FDchodu. \u017De se bl\u00ED\u017E\u00EDm, prozrazuj\u00ED kostel\u00EDky, kter\u00E9 m\u011Bn\u00ED sv\u016Fj seversk\u00FD charakter a za\u010D\u00EDnaj\u00ED se objevovat zlat\u00E9 b\u00E1n\u011B. Jako p\u011B\u0161\u00E1k p\u0159esko\u010D\u00EDm n\u011Bkolikakilometrovou frontu a triumf\u00E1ln\u011B p\u0159ekro\u010D\u00EDm hranici rusk\u00E9ho imp\u00E9ria pod ohromn\u00FDm obloukem duhy. Pak dlouho sed\u00EDm u krajnice a smutn\u011B pozoruji, jak se st\u0159\u00EDdaj\u00ED sm\u011Bny pohrani\u010Dn\u00ED str\u00E1\u017Ee. P\u0159eci jen jsem si vymodlila kamion do Moskvy, jinak by m\u011B nejsp\u00ED\u0161 odplavil d\u00E9\u0161\u0165, sebrala tma nebo se\u017Erali kom\u00E1\u0159i. Sympa\u0165\u00E1k \u017De\u0148a, \u0159idi\u010D z Kaliningradu, jede pomalu a velkou oklikou. Vysednout z auta se mi v\u0161ak p\u0159estane cht\u00EDt, jakmile pochop\u00EDm, jak vypadaj\u00ED silnice v Rusku. Jedeme po\u0159\u00E1d rovn\u011B, hust\u00FDm lesem, sem tam se mihne zoufal\u00E1 benz\u00EDnka. Cesta je lemovan\u00E1 zna\u010Dkami \u201Epozor hlavn\u00ED silnice\u201C, to abychom nez\u016Fstali na pochyb\u00E1ch, \u017Ee jsme nezbloudili. Mysl\u00EDm v duchu na Napoleona a jeho ta\u017Een\u00ED na Moskvu. Na druh\u00FD den se p\u0159ibl\u00ED\u017E\u00EDm do Moskevsk\u00E9ho raj\u00F3nu. M\u00EDj\u00EDme vodu posv\u011Bcenou smolensk\u00FDm metropolitou, reklamu na pomn\u00EDk Gagarina, d\u011Blo z druh\u00E9 sv\u011Btov\u00E9. Moskva m\u011B v\u00EDt\u00E1 svou nevl\u00EDdnou tv\u00E1\u0159\u00ED. P\u0159i pohledu na ty prot\u00E1hl\u00E9 obli\u010Deje s koutky do podkovy se pt\u00E1m sama sebe, pro\u010D jsem to cht\u011Bla jet do Ruska. Zdr\u017E\u00EDm se kr\u00E1tce. Vlakem popojedu sice jen \u017Edibec, ale zato spr\u00E1vn\u00FDm sm\u011Brem, do Vladim\u00EDru. \r\n\r\nKone\u010Dn\u011B m\u00E1m volnou cestu na v\u00FDchod. Nasko\u010D\u00EDm do prvn\u00EDho n\u00E1kla\u010F\u00E1ku, kter\u00FD se objev\u00ED. Tatar za volantem jede p\u0159\u00EDmo do Kazan\u011B. Jen\u017Ee hrozn\u011B se \u0161ineme a na m\u011B je vid\u011Bt, \u017Ee nev\u00EDm, jak to urychlit. \u201EUpokoj se d\u011Bv\u010De, m\u011Bla sis po\u0159\u00EDdit letadlo, kdy\u017E tolik sp\u011Bch\u00E1\u0161\u201C, zpra\u017E\u00ED m\u011B \u0159idi\u010D. Druh\u00FD den po poledni vysed\u00E1m v pr\u016Fmyslov\u00E9 z\u00F3n\u011B stolice Tatarst\u00E1nu. Val\u00EDm o\u010Di, nebo\u0165 tolik trubek a kom\u00EDn\u016F pohromad\u011B jsem nikdy nevid\u011Bla. Historick\u00E9 centrum Kazan\u011B se m\u00E1 tak\u00E9 \u010D\u00EDm pochlubit. M\u00EDstn\u00ED Kreml a Arbat sv\u011Bd\u010D\u00ED o tom, \u017Ee se m\u011Bsto za\u010D\u00EDn\u00E1 rozvzpom\u00EDnat na svou za\u0161lou sl\u00E1vu. Ne\u017E ho dobyl Ivan Hrozn\u00FD, vl\u00E1dli tady turkoman\u0161t\u00ED ch\u00E1nov\u00E9. Me\u0161ity a pravoslavn\u00E9 kostely tu stoj\u00ED p\u011Bkn\u011B vedle sebe, i kdy\u017E b\u016Fh v Rusku p\u0159eci nen\u00ED. M\u011B to je\u0161t\u011B p\u0159ed setm\u011Bn\u00EDm \u017Eene z m\u011Bsta pry\u010D. Na v\u00FDpadovce m\u011B nalo\u017E\u00ED mlad\u00FD \u010Cuva\u0161 do sv\u00E9ho americk\u00E9ho freightlinera. Je to ukecan\u00FD a trochu drz\u00FD chlap. Sype ze sebe svoje rozumy, kter\u00E9 nabyl jako chulig\u00E1n, bandita, trestanec, d\u00EDt\u011B ulice, voj\u00E1k v \u010De\u010Densk\u00E9 v\u00E1lce a konec konc\u016F otec od rodiny a podnikatel. P\u0159ipad\u00E1m si jako malink\u00FD ribjonek, kter\u00FD v \u017Eivot\u011B je\u0161t\u011B v\u016Fbec nic nepochopil. P\u0159ed Ufou p\u0159esed\u00E1m na jinou k\u00E1ru a v noci p\u0159efr\u010D\u00EDm Ba\u0161korkist\u00E1n. Stav\u00ED n\u00E1s \u010Dasto policejn\u00ED hl\u00EDdky. \u0158idi\u010D je zvykl\u00FD, jen p\u0159ibrzd\u00ED a povzdychne \u201Ej\u00E1 u\u017E d\u011Bngi prigatovil\u201C a pod\u00E1v\u00E1 policajt\u016Fm p\u0159es ok\u00FDnko \u00FAplatek. Na odbo\u010Dce z hlavn\u00EDho tahu na \u010Celjabinsk stopnu Kamaz p\u0159\u00EDmo do Jekat\u011Brinburku. Kdosi mi to m\u011Bsto vychv\u00E1lil, tak mi to ned\u00E1 a pust\u00EDm se cestou necestou t\u00EDm sm\u011Brem. Nat\u0159\u00E1s\u00E1m se cel\u00FD den v kabin\u011B, postupn\u011B mi na hlavu popadalo \u0159idi\u010Dovo n\u00E1dob\u00ED, toale\u0165\u00E1k, pak i cukr. To m\u011Bsto by muselo b\u00FDt cel\u00E9 ze zlata, aby se mi to trm\u00E1cen\u00ED vyplatilo. Bohu\u017Eel nen\u00ED. Marn\u011B bloud\u00EDm po m\u011Bst\u011B a hled\u00E1m n\u011Bjakou pam\u011Btihodnost. Projdu se po Arbatu, kter\u00FD je sam\u00E1 lou\u017Ee, a\u017E k m\u00EDstu, kde zabili cara s celou rodinou. Na pam\u011B\u0165 tohoto zlo\u010Dinu postavili ned\u00E1vno kostel\u00EDk. K ve\u010Deru u\u017E stoj\u00EDm na hlavn\u00EDm tahu vedle vojensk\u00E9 rakety a m\u00E1v\u00E1m na auta. Tady za Uralem za\u010D\u00EDn\u00E1 kone\u010Dn\u011B Sibi\u0159. \r\n\r\nStopuju non-stop. Proj\u00ED\u017Ed\u00EDme malink\u00E9 vesni\u010Dky s pern\u00EDkov\u00FDmi chaloupkami tak trochu na\u0161inut\u00FDmi do strany. V\u011Bt\u0161ina dom\u016F je podivn\u011B nedostav\u011Bn\u00E1, jakoby si to nech\u00E1vali na z\u00EDtra, kter\u00E9 nikdy nebude. Improvizace je vid\u011Bt na ka\u017Ed\u00E9m kroku. P\u0159edj\u00ED\u017Ed\u00EDme n\u00E1klad zbrusu nov\u00FDch automobil\u016F Volha. Je to tak trochu retro, nebo\u0165 ji\u017E 30 let se vyr\u00E1b\u00ED st\u00E1le stejn\u00FD model. V noci n\u011Bkde p\u0159ed Tjumenem tvrdnu na silnici, na\u0161t\u011Bst\u00ED letn\u00ED noci jsou kr\u00E1tk\u00E9. Za sv\u00EDt\u00E1n\u00ED m\u011B nabere rod\u00E1k z Omsku. Pohodln\u011B se usad\u00EDm, nebo\u0165 m\u011B \u010Dek\u00E1 s t\u00EDmhle kamionem dlouh\u00E1 cesta. A\u017E p\u0159ed  \r\nNovosibirskem vysed\u00E1m a po tm\u011B lov\u00EDm auto d\u00E1l na v\u00FDchod. Zastav\u00ED mi Sa\u0161a a Andrej, \u0159idi\u010Di kamionu z Barna\u00FAlu. Jsou ze m\u011B dost vykulen\u00ED a \u00FAdivem volaj\u00ED \u201EJaponsk\u00FD boh!\u201C Cestou se pochlub\u00ED, jak Siberiaci p\u0159eprali N\u011Bmce za druh\u00E9 sv\u011Btov\u00E9, porad\u00ED mi, jak se lov\u00ED medv\u011Bd beze zbran\u011B a l\u00E1kaj\u00ED m\u011B na Altaj. Je\u0161t\u011B ne\u017E m\u011B vyklop\u00ED, zazp\u00EDvaj\u00ED mi \u010Dastu\u0161ku, vzpomenou \u010Fa\u010Fku Stalina a pop\u0159ej\u00ED \u0161\u0165astliv\u00E9 puti. A j\u00E1 zase v tu mrtvou no\u010Dn\u00ED hodinu p\u0159e\u0161lapuji u cesty a \u010D\u00EDh\u00E1m na n\u011Bkoho, kdo by m\u011B popovezl kousek d\u00E1l. Ze zoufalstv\u00ED pak k\u00FDvnu na odvoz do centra Novosibirsku a je\u0161t\u011B za \u0161era p\u0159ejedu most p\u0159es \u0159eku Ob. Z historick\u00E9ho centra nezbylo v\u011Bru moc. Jen malink\u00E1 kapli\u010Dka se zlatou st\u0159echou uprost\u0159ed betonov\u00E9 k\u0159i\u017Eovatky. Podle velesochy Lenina v doprovodu t\u0159ech rudoarm\u011Bjc\u016F a dvou budovatel\u016F pozn\u00E1v\u00E1m, \u017Ee jsem v sam\u00E9m st\u0159edu m\u011Bsta. Tak to bychom m\u011Bli, ukon\u010D\u00EDm exkursi a ma\u017Eu na autobus, kter\u00FD m\u011B vyveze na okraj m\u011Bsta. Na zast\u00E1vce pozoruji ruskou spole\u010Dnost, kter\u00E1 \u010Dek\u00E1 na sv\u016Fj rann\u00ED spoj. Je to smutn\u00E9 divadlo. Postar\u0161\u00ED lid\u00E9, vym\u00F3d\u011Bn\u00ED v\u0161elijak, se hrnou do dve\u0159\u00ED p\u0159est\u00E1rl\u00FDch autobus\u016F, perou se o m\u00EDsta k sezen\u00ED a p\u0159itom je megafon ve voze pravideln\u011B pou\u010Duje, aby si nezapom\u00EDnali sv\u00E9 v\u011Bci, kdy\u017E budou vystupovat. Za zahr\u00E1dk\u00E1\u0159skou koloni\u00ED obt\u00ED\u017En\u011B hled\u00E1m auto, kter\u00E9 by jelo spr\u00E1vn\u00FDm sm\u011Brem a cht\u011Blo by zastavit. P\u0159eci jen m\u011B nabere jak\u00FDsi p\u00E1n a j\u00E1 ze zdvo\u0159ilosti p\u0159em\u00E1h\u00E1m sp\u00E1nek a udr\u017Euji konverzaci p\u0159ikyvov\u00E1n\u00EDm da, da, da. Do Abakhanu m\u011B nakonec doprav\u00ED z\u00E1sobov\u00E1n\u00ED pivem n\u011Bkdy nad r\u00E1nem druh\u00E9ho dne. Dosp\u00EDm na zemi v n\u00E1dra\u017En\u00ED hale. O v\u00FDletu do Sajan, kter\u00FD jsem odtud podnikla, pov\u00EDm jindy. Celkem to byla zaj\u00ED\u017E\u010Fka 1200 km z hlavn\u00EDho tahu. \r\n\r\nV Krasnojarsku jsem zase srovnala kurs sm\u011Brem na v\u00FDchod. Na to, \u017Ee m\u00E1 Krasnojarsk 300 let toho ve m\u011Bst\u011B z minulosti mnoho nez\u016Fstalo. Obyvatel\u00E9 tohoto m\u011Bsta na Jeniseji jsou velmi py\u0161n\u00ED zejm\u00E9na na sv\u00E9 \u017Eirafy, kter\u00E9 tu chudinky v m\u00EDstn\u00ED ZOO zmrzaj\u00ED 9 m\u011Bs\u00EDc\u016F v roce, ale tak\u00E9 na stolby, zaj\u00EDmav\u00E9 skaln\u00ED \u00FAtvary kousek od centra, ne nepodobn\u00E9 t\u011Bm v Adr\u0161pachu. Jen to nen\u00ED p\u00EDsek, ale syenit. Kdy\u017E se stolbista Serjo\u017Ea v n\u00E1mo\u0159nick\u00E9 \u010Depici bez ji\u0161t\u011Bn\u00ED vy\u0161plh\u00E1 kom\u00EDnem na sk\u00E1lu, p\u0159edvede p\u0159eskok a pak se \u0161t\u011Brbinou spust\u00ED dol\u016F ve t\u0159ech kotrmelc\u00EDch a ud\u011Bl\u00E1 pukrle, spadne mi brada. Nem\u016F\u017Eu vynechat expozici voskov\u00FDch dinosaur\u016F v b\u00FDval\u00E9m muzeu Revoluce ani m\u011Bstsk\u00FD park, kter\u00FD vzd\u00E1len\u011B p\u0159ipom\u00EDn\u00E1 v\u00EDde\u0148sk\u00FD Prater. Z rozhovor\u016F s lidmi je mi v\u0161ak jasn\u00E9, \u017Ee se tu nemaj\u00ED zrovna nejl\u00EDp. Jak je to mo\u017En\u00E9, ptaj\u00ED se m\u011B, d\u00E1vno by m\u011Bli chodit v\u0161ichni od\u011Bn\u00ED ve zlat\u011B. Jen\u017Ee sibi\u0159sk\u00E9 bohatstv\u00ED miz\u00ED nezn\u00E1mo kde. Oby\u010Dejn\u00ED lid\u00E9 pracuj\u00ED za kop\u011Bjky a \u017Eivo\u0159\u00ED ze dne na den. Fabriky u\u017E nic nevyr\u00E1b\u00ED, pole le\u017E\u00ED d\u00E1vno ladem. Jen\u017Ee, kdo by se divil, \u017Ee zav\u0159eli z\u00E1vod na \u010Dernob\u00EDl\u00E9 televize, kdy\u017E se cel\u00FD sv\u011Bt u\u017E d\u00E1vno d\u00EDv\u00E1 na barevn\u00E9, kdo by se divil, kdy\u017E tu sej\u00ED v\u00EDc zrna, ne\u017E skl\u00EDzej\u00ED. Nap\u00ED\u0161u si na ceduli Bajkal a moje nejv\u011Bt\u0161\u00ED starost je, jak se tam dostat. Je to d\u00E1l ne\u017E z Prahy do Pa\u0159\u00ED\u017Ee, p\u0159itom z\u010D\u00E1sti po pol\u0148a\u010Dce. Po dnu a noci na cest\u011B v \u017Eigul\u00EDku a jak\u00E9si \u010Dty\u0159kolce, vysed\u00E1m na centr\u00E1ln\u00EDm rynku v Irkutsku. Jsou tu k m\u00E1n\u00ED \u010D\u00EDnsk\u00E9 okurky a \u010D\u00EDnsk\u00E9 raj\u010Data, \u010D\u00EDnsk\u00E9 n\u00E1dob\u00ED, \u010D\u00EDnsk\u00E9 oble\u010Den\u00ED... je vid\u011Bt, \u017Ee se tu \u010C\u00ED\u0148an\u00E9 dob\u0159e zadr\u00E1pli. Slovan\u00E9 jsou pomalu na vym\u0159en\u00ED a nemaj\u00ED podle m\u011B proti asiat\u016Fm \u0161anci. Obdivuji st\u0159\u00EDpky rusk\u00E9 noblesy, kterou si sem do vyhnanstv\u00ED p\u0159ivezli d\u011Bkabrist\u00E9 po nepoveden\u00E9m povst\u00E1n\u00ED v roce 1825. Je\u0161t\u011B po\u0159\u00E1d je na co koukat, d\u0159ev\u011Bn\u00E1 staven\u00ED, zimn\u00ED zahrady, k\u0159i\u0161\u0165\u00E1lov\u00E9 lustry v hudebn\u00EDm sal\u00F3nku, jakoby to nebylo u\u017E ani pravda. Jen\u017Ee to nejkr\u00E1sn\u011Bj\u0161\u00ED z cel\u00E9ho Ruska m\u00E1m teprve p\u0159ed sebou, jezero Bajkal. Na t\u0159i t\u00FDdny jsem zpomalila tempo a zastavila jsem v okol\u00ED jezera, ale o tom pov\u00EDm jindy. \r\n\r\nP\u0159i pohledu na mapu Ruska jsem sotva za p\u016Flkou a p\u0159itom tak nekone\u010Dn\u011B daleko od T\u0159eb\u00ED\u010De. \u017Dene m\u011B to po\u0159\u00E1d d\u00E1l, na d\u00E1ln\u00FD v\u00FDchod. Do Ulan Ude m\u011B p\u0159ivezl s\u00E1m ministr selsk\u00E9ho chazajstva burjatsk\u00E9 republiky, kter\u00FD m\u011B p\u0159edt\u00EDm dva dny kr\u00E1lovsky hostil ve sv\u00E9 d\u00E1\u010De na Bajkale. Burjati jsou buddhisti, jen\u017Ee spletla jsem se, kdy\u017E jsem p\u0159edpokl\u00E1dala, \u017Ee ve m\u011Bst\u011B budou sam\u00E9 buddhistick\u00E9 svatyn\u011B. M\u00EDsto toho se tu obyvatel\u00E9 py\u0161n\u00ED obrovit\u00E1nskou hlavou Lenina, kter\u00E1 je pr\u00FD nejv\u011Bt\u0161\u00ED na sv\u011Bt\u011B. Svat\u00E9 m\u00EDsto Ivolginsk\u00FD datsan je t\u0159eba hledat kus za m\u011Bstem. P\u0159echov\u00E1vaj\u00ED tu t\u011Blo chambul\u00E1my Etigely, kter\u00FD v transu opustil sv\u011Bt, du\u0161e ode\u0161la pr\u00FD p\u0159\u00EDmo do nirv\u00E1ny a t\u011Blo z\u016Fstalo tady v pozici lotosov\u00FD kv\u011Bt. Dalajl\u00E1ma v\u0161ak do Ruska u\u017E \r\nd\u00E1vno nejezd\u00ED, aby nenaru\u0161oval dobr\u00E9 vztahy s \u010C\u00EDnou. M\u011B to t\u00E1hne do Tugnujsk\u00E9 stepi a d\u00E1l na v\u00FDchod. Proj\u00ED\u017Ed\u00EDme Jablo\u0148ov\u00FD chrebet, co\u017E je divn\u00FD n\u00E1zev, kdy\u017E tu neroste ani jedna jabl\u016F\u0148ka. Cestou zastav\u00EDm v n\u011Bkolika buddhistick\u00FDch kl\u00E1\u0161terech a pomodl\u00EDm se za zdar v\u00FDpravy. V \u010Cit\u011B m\u011B \u010Dek\u00E1 klasick\u00FD sov\u011Btsk\u00FD nepo\u0159\u00E1dek, socha Lenina, po\u0161ta, kde nemaj\u00ED jedinou pohlednici a ukrutn\u00E9 n\u00E1dra\u017E\u00ED bez z\u00E1chodk\u016F. Stav\u00ED se tu obrovsk\u00FD pravoslavn\u00FD kostel, kter\u00FD m\u00E1 z\u0159ejm\u011B zv\u00FD\u0161it kulturn\u00ED \u00FArove\u0148 m\u011Bsta. Vid\u011Bt jen tohle, jsem dost zklaman\u00E1. To nejhez\u010D\u00ED z \u010City se p\u0159itom vejde do dlan\u011B jedn\u00E9 star\u00E9 pan\u00ED v \u017Eupanu. Sv\u011B\u0159ila se mi, \u017Ee, kdy\u017E ned\u00E1vno opravovala svou d\u0159ev\u011Bnici, vypadla na ni ze st\u0159echy bronzov\u00E1 ikona, kterou tam musel ukr\u00FDt p\u016Fvodn\u00ED majitel, z\u0159ejm\u011B bohat\u00FD kupec. \r\n\r\nZa m\u011Bstem si stoupnu k patn\u00EDku s kilometrem nula a sna\u017E\u00EDm se stopnout n\u011Bco do Chabarovsku, asi 2168 km daleko. Je mi m\u011B samotn\u00E9 l\u00EDto. D\u00E1l je jen tajga a pustina, vesnice skoro \u017E\u00E1dn\u00E9. Nasednu na dlouhat\u00E1nsk\u00FD n\u00E1kla\u010F\u00E1k, kter\u00FD m\u00E1 nam\u00ED\u0159eno do Vladivostoku. Kdy\u017E zm\u00EDn\u00EDm, \u017Ee bych poz\u00EDt\u0159\u00ED cht\u011Bla b\u00FDt v Chabarovsku, oba \u0159idi\u010Di se daj\u00ED do huronsk\u00E9ho sm\u00EDchu. Pr\u00FD kdy\u017E v\u0161echno p\u016Fjde hladce, za p\u011Bt dn\u016F jsme tam. M\u00EDj\u00EDme posledn\u00ED policejn\u00ED checkpost, zaplat\u00EDme pokutu a jedem. Pohrou\u017E\u00EDm se do sv\u00FDch my\u0161lenek a v rychlosti 20 km v hodin\u011B medituji nad ka\u017Ed\u00FDm patn\u00EDkem. Postupn\u011B m\u011B p\u0159epad\u00E1 malomyslnost. P\u0159ehodnot\u00EDm pl\u00E1n a v \u010Cernogorsku, kde silnice p\u0159et\u00EDn\u00E1 transsibi\u0159skou magistr\u00E1lu, se nech\u00E1m vysadit p\u0159esv\u011Bd\u010Den\u00E1, \u017Ee pojedu rad\u011Bj vlakem. Jen\u017Ee nakonec to dopadlo jinak. Odkudsi se vyloupl sympatick\u00FD Jakut, tlus\u0165ou\u010Dk\u00FD a \u010Derve\u0148ou\u010Dk\u00FD a tak nasednu do jeho japonsk\u00E9 \u010Dty\u0159kolky a pokra\u010Duji sm\u011Br Mogo\u010Da. Na\u0161t\u011Bst\u00ED u\u017E pr\u00FD pominuly doby, kdy se na t\u00E9hle cest\u011B seri\u00F3zn\u011B loupilo a p\u0159epad\u00E1valo. Dodnes si pr\u00FD s sebou kde kdo voz\u00ED bambitku, pro p\u0159\u00EDpad, \u017Ee by se potkal s chabarovsk\u00FDmi bandity. Pod\u0159imuji, zat\u00EDmco \u0159idi\u010D se state\u010Dn\u011B propl\u00E9t\u00E1 mezi j\u00E1mami v pra\u0161n\u00E9 cest\u011B, kterou za l\u00E9to rozmyla voda. Na silnici se sem tam pracuje a m\u00EDsty se objevuje dokonce asfalt. Korupce je v Rusku v\u0161ak velkolep\u00E1 a silnice jsou hotov\u00FD Klondike. Rusov\u00E9 sice um\u00ED l\u00EDtat do vesm\u00EDru, ale postavit cestu pro lidi, to se je\u0161t\u011B nenau\u010Dili. Vysed\u00E1m na druh\u00FD den v poledne, do Chabarovsku st\u00E1le zb\u00FDv\u00E1 nekone\u010Dn\u00FDch 1414 km. Svezou m\u011B d\u011Bdu\u0161ka Nikolaj a babu\u0161ka Nata\u0161a z Tyndy. Jejich ko\u010Dka to drkot\u00E1n\u00ED t\u011B\u017Eko sn\u00E1\u0161\u00ED a p\u0159\u00ED\u0161ern\u011B m\u0148ouk\u00E1. Taky bych m\u0148oukala, kdybych mohla. Ne\u017E se rozlou\u010D\u00EDme, pod\u011Bl\u00ED se se mnou sta\u0159\u00EDci o kus uzeniny, kterou sn\u00EDm jen s nejv\u011Bt\u0161\u00EDm sebezap\u0159en\u00EDm. Stm\u00EDv\u00E1 se a j\u00E1 rad\u0161i nemysl\u00EDm na to, kde jsem a stopuji d\u00E1l. \r\n\r\nNe \u017Ee by za B\u011Blogorskem os\u00EDdlen\u00ED n\u011Bjak v\u00FDrazn\u011B zhoustlo. Proj\u00ED\u017Ed\u00EDme mo\u010D\u00E1lovitou rovinou amursk\u00E9 oblasti. L\u00EDhnou se tu zl\u00ED kom\u00E1\u0159i. Krajina se za\u010D\u00EDn\u00E1 vlnit a\u017E v \u017Didovsk\u00E9 autonomn\u00ED oblasti. V Birobid\u017Eanu, kam Stalin p\u0159est\u011Bhoval \u017Didy z cel\u00E9ho Ruska, toho k vid\u011Bn\u00ED moc nen\u00ED. Kdo mohl, ujel do Izraele nebo kamkoli jinam, nebude tady p\u0159eci s\u00E1zet kart\u00F3\u0161ku. Zbylo tu p\u00E1r n\u00E1pis\u016F v jiddi\u0161 a jedna synagoga, bohu\u017Eel zav\u0159en\u00E1. Lid\u00E9 se m\u011B ptaj\u00ED, kter\u00FD \u017Ee \u010Dert m\u011B sem poslal. Do Chabarovsku je to po\u0159\u00E1d je\u0161t\u011B kus cesty a tak p\u0159ijmu pozv\u00E1n\u00ED do mal\u00E9 tatarsk\u00E9 vesni\u010Dky p\u0159i cest\u011B. Muslimov\u00E9 maj\u00ED v\u0161ak p\u0159\u00EDsn\u00FD z\u00E1kaz pustit do domu jinou \u017Eenu, ne\u017E svou man\u017Eelku a dodr\u017Euj\u00ED ho. A tak stav\u00EDm stan na b\u0159ehu rozvodn\u011Bn\u00E9 \u0159\u00ED\u010Dky. Delegace m\u00FDch hostitel\u016F mi p\u0159inese na tal\u00ED\u0159ku kus masa s bramborovou ka\u0161\u00ED. Podruh\u00E9 p\u0159ijdou s pu\u0161kou z druh\u00E9 sv\u011Btov\u00E9, se kterou se tady bili proti Japonc\u016Fm. Vyst\u0159el\u00ED p\u00E1rkr\u00E1t do vzduchu, aby na m\u011B nep\u0159i\u0161el medv\u011Bd. Z\u00E1pach patron by ho m\u011Bl odradit. Zato m\u011B to vyd\u011Bs\u00ED natolik, \u017Ee nezamhou\u0159\u00EDm oko. R\u00E1no u\u017E zase na cest\u011B, doklepu ten posledn\u00ED \u00FAsek. M\u00E1m pocit, \u017Ee tady na d\u00E1ln\u00E9m v\u00FDchod\u011B teprve za\u010D\u00EDn\u00E1 Rusko. V\u0161echno je n\u00E1ramn\u011B divok\u00E9, obrovsk\u00E9 a st\u011B\u017E\u00ED uchopiteln\u00E9. Nazvala bych to surov\u00E1 romantika. Chabarovsk nen\u00ED p\u0159ekvapiv\u011B \u017E\u00E1dn\u00E1 d\u0159ev\u011Bn\u00E1 vesnice, kde by b\u011Bhali medv\u011Bdi po ulici, ale stoj\u00ED tu m\u00E1lem mrakodrapy. \u010C\u00EDna je za rohem a tak je pot\u0159eba se tu po\u0159\u00E1dn\u011B zabydlet. Lid\u00E9 jsou na sv\u00E9 m\u011Bsto pat\u0159i\u010Dn\u011B hrd\u00ED, u\u017E proto, \u017Ee nov\u00FD most p\u0159es \u0159eku Amur je vyobrazen na 5000 rublov\u00E9 bankovce, kde\u017Eto Moskva je jen na stovce. Tou\u017E\u00EDm spat\u0159it krimin\u00E1ln\u00ED \u201Eg\u00F3rod\u201C Komsomolsk na Amuru, kde se vyr\u00E1b\u011Bj\u00ED oce\u00E1nsk\u00E9 ponorky. Maj\u00ED m\u011B proto za \u0161pi\u00F3na. Vzletn\u011B se tomuto zatracen\u00E9mu m\u00EDstu p\u0159ezd\u00EDv\u00E1 Pet\u011Brburk Sibi\u0159e. P\u0159izvali si sem ve 30. letech minul\u00E9ho stolet\u00ED architekty z Leningradu, aby postavili \r\nm\u011Bsto na zelen\u00E9 louce. N\u011Bco se jim povedlo, n\u011Bco ne. \u0158\u00ED\u010Dn\u00ED vagz\u00E1l p\u0159ipom\u00EDn\u00E1 ze v\u0161eho nejv\u00EDc letovisko na \u010Cern\u00E9m mo\u0159i, \u0161koda jen, \u017Ee tak ch\u00E1tr\u00E1. V domech se v\u0161ak prakticky ned\u00E1 \u017E\u00EDt, nebo\u0165 tady v drsn\u00E9m sibi\u0159sk\u00E9m podneb\u00ED do nich te\u010De. M\u011Bsto je pln\u00E9 velkolep\u00FDch pomn\u00EDk\u016F komsomolsk\u00E9 ml\u00E1de\u017Ee. Lidi nev\u011B\u0159\u00EDcn\u011B krout\u00ED hlavami, kde \u017Ee se tady v takov\u00E9 d\u00ED\u0159e bere turista. Od kohosi dostanu okurku na znamen\u00ED mezin\u00E1rodn\u00ED dru\u017Eby. Abych v\u0161ak nez\u016Fstala nap\u016Fl cesty, prostopuji se a\u017E do posledn\u00EDho p\u0159\u00EDstavu odkud odplouvaj\u00ED lod\u011B na Sachalin, do portu Vanina. Pra\u0161n\u00E1 cesta vede na sam\u00FD konec sv\u011Bta, 350 km p\u0159es hust\u00FD les a\u017E k mo\u0159i. Jen na 162 km je hospoda a u hospody sed\u00ED medv\u011Bd a vylizuje pomyje. Nikomu tady nevad\u00ED. O tom, jak dob\u0159e jsem se m\u011Bla dal\u0161\u00ED dva t\u00FDdny na Sachalinu, a\u017E jindy, te\u010F zp\u00E1tky na feder\u00E1ln\u00ED trasu sm\u011Br Vladivostok. \r\n\r\nProj\u00ED\u017Ed\u00EDm mal\u00E9 vesni\u010Dky s romantick\u00FDmi n\u00E1zvy Tygrovoje a Lermontovka, narkomafi\u00E1nsk\u00E9 m\u011Bste\u010Dko Bikin a bl\u00ED\u017E\u00EDm se do p\u0159\u00EDmo\u0159sk\u00E9ho kraje. V t\u011Bchto kon\u010Din\u00E1ch se mi v noci stopovat nechce, proto kempuji na nejob\u00E1van\u011Bj\u0161\u00EDm policejn\u00EDm checkpostu, p\u0159ed kter\u00FDm se t\u0159esou v\u0161ichni \u0159idi\u010Di. Ode m\u011B v\u0161ak policajti \u00FAplatek necht\u011Bli. Uk\u00E1zali mi m\u00EDsto, kde si m\u016F\u017Eu postavit stan a celou noc nade mnou dr\u017Eeli str\u00E1\u017E. R\u00E1no m\u011B milicion\u00E1\u0159ka nab\u00EDdla \u010Daj a sotva jsme prohodily p\u00E1r slov, za\u010Dala do m\u011B valit fanatickou n\u00E1bo\u017Eenskou pravouku, modlit se za m\u011B a prosit m\u011B, abych svou pou\u0165 prom\u011Bnila v misii. Sov\u011Btsk\u00FD svaz za sebou zanechal miliony ateist\u016F, kte\u0159\u00ED te\u010F znovu nach\u00E1zej\u00ED cestu k Bohu. Rusko te\u010F za\u017E\u00EDv\u00E1 druh\u00E9 k\u0159tiny. J\u00E1 s t\u00EDm v\u0161ak nechci m\u00EDt nic spole\u010Dn\u00E9ho a kouk\u00E1m co nejrychleji odtud zmizet. Na posledn\u00ED \u0161taci m\u011B svezl n\u00E1mo\u0159n\u00EDk z Vladivostoku, sv\u011Btob\u011B\u017En\u00EDk Nikolaj. Vysad\u00ED m\u011B na n\u00E1b\u0159e\u017E\u00ED v z\u00E1toce Zlat\u00FD roh. Vot, i vsjo, doj\u00E9chali. D\u00E1l to nejde, d\u00E1l je jenom Tich\u00FD oce\u00E1n. Vladivostok se siln\u011B podob\u00E1 San Francisku a a\u017E dostav\u00ED ohromn\u00FD \u010Derven\u00FD most na ostrov Ruskij, bude se mu podobat je\u0161t\u011B v\u00EDc. V p\u0159\u00EDstavu kotv\u00ED plachetnice rusk\u00E9 n\u00E1mo\u0159n\u00ED flotily a ohromn\u00E9 oce\u00E1nsk\u00E9 lod\u011B, po oce\u00E1nsk\u00E9m prospektu se promen\u00E1duj\u00ED n\u00E1mo\u0159n\u00EDci a lehk\u00E9 \u017Eeny, v kr\u00E1mc\u00EDch se prod\u00E1v\u00E1 fajnov\u00FD tab\u00E1k ze v\u0161ech kout\u016F sv\u011Bta. Vezmu fla\u0161ku medu, co mi darovali na cestu medov\u00ED d\u011Bdou\u0161ci z Chabarovska a odpluji na ostrov na dohled od m\u011Bsta. Jakoby p\u0159\u00EDroda v\u00E1hala, jestli je lep\u0161\u00ED sou\u0161 nebo oce\u00E1n, z mo\u0159e se tu vyno\u0159uje spousta ostr\u016Fvk\u016F a \u00FAtes\u016F a pob\u0159e\u017E\u00ED je kouzeln\u00E9. Na b\u0159ehu Ussurijsk\u00E9ho z\u00E1livu najdu mn\u00ED\u0161ek pln\u00FD meloun\u016F a pl\u00E1\u017Eov\u00E9 \u017Eidli\u010Dky, kv\u016Fli tomu jsem musela dojet a\u017E sem. \r\n\r\nProzkoum\u00E1m okol\u00ED, hv\u00EDzdnu je\u0161t\u011B stopem do Nachodky, na ostrov Pu\u0165atin m\u011B sveze rezav\u00E1 bad\u017Ea za 10 rubl\u016F se sympatick\u00FDm kapit\u00E1nem. Ve vesnici Slavjanka kousek od Severokorejsk\u00E9 hranice si ode m\u011B jedna babka s noblesn\u00EDm drdolem, kter\u00E1 ale jinak p\u016Fsob\u00ED dost ztrhan\u011B a hul\u00ED \u017Ev\u00E1ro, vyprosila autogram, kdy\u017E se dozv\u011Bd\u011Bla, \u017Ee jedu stopem p\u0159es cel\u00E9 Rusko. Nen\u00ED t\u0159eba si zdej\u0161\u00ED ka\u017Edodenn\u00ED \u017Eivot p\u0159\u00EDli\u0161 idealizovat, chv\u00EDlemi to na m\u011B d\u011Bl\u00E1 dojem mafi\u00E1nsk\u00E9 \u017Eumpy. Lidi jsou tu v\u0161elijac\u00ED r\u016Fzn\u00ED. Posledn\u00ED den se svezu na pl\u00E1\u017E, jakou jsem v\u0161ak je\u0161t\u011B nevid\u011Bla. \u0158idi\u010D mi slibuje, \u017Ee to tam vypad\u00E1 jako ve \u0160v\u00FDcarsku. Podotknu, \u017Ee tam mo\u0159e nemaj\u00ED, ale mus\u00EDm mu nakonec d\u00E1t za pravdu. Budou tady stav\u011Bt presidentskou vilu, takov\u00E1 je to n\u00E1dhera. Jen\u017Ee z\u00EDtra mi vypr\u0161\u00ED v\u00EDzum a tak posp\u00EDch\u00E1m na hranici s \u010C\u00EDnou. Jako suven\u00FDr si vezu b\u0159ezov\u00E9 poleno. Nechce se mi odtud ani trochu. M\u00E1m pocit, jako by m\u011B vyh\u00E1n\u011Bli z r\u00E1je."},
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
