!function(t,e,o,n){"use strict";function i(t){for(var e=0;e<t.length;e++)t[e].text=n.toHTML(t[e].text);return t}function a(){var t=this;this.gui=new e(this),this.handler=new o(this);var n=[];n.push(this.getArticleList()),n.push(this.getPhotoList()),Promise.all(n).then(function(e){var o=e[0];t.articles=i(o.articles),t.gui.drawArticles(t.articles);var n=e[1];t.gui.drawGalleryCarousel(n);var a=[];t.gui.drawComingUp(a),t.handler.init()},function(t){console.log(t)})}window.location.hash&&setTimeout(function(){var e=parseInt(t(".headspacer").css("margin-bottom").replace(/[A-Za-z]/,""))-150;window.scrollTo(0,t(window.location.hash).offset().top-e)},100),a.prototype.getArticleList=function(){return this.getJSON("/data/articles.json")},a.prototype.getPhotoList=function(){return this.getJSON("/data/photos.json")},a.prototype.getJSON=function(e){return t.ajax(e,{dataType:"json",cache:!1,type:"GET"})},a.prototype.getFullArticle=function(e,o){t.ajax("/data/articles/"+e,{dataType:"text",cache:!1,type:"GET"}).done(function(t){o(n.toHTML(t))})},t(document).ready(function(){new a})}($,GUI_module,EventHandler_module,markdown);