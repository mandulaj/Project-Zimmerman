var GUI_module=function(t){"use strict";function e(e){this.app=e}return e.prototype.playVideo=function(){document.getElementById("video").play()},e.prototype.hideVideo=function(){var e=t("#videopg");e.addClass("fade"),setTimeout(function(){e.addClass("hidden")},300)},e}($);