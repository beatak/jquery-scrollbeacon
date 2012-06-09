(
function () {
  "use strict";

  var $mon;
  var $button;
  var monitor = '<div id="monitorclear"><button>clear</button></div><div id="monitor"></div>';

  var init = function () {
    $(document.body).append(monitor);
    $mon = $('#monitor');
    $button = $('#monitorclear > button');
    $button.click(onbuttonclick);
    if (typeof window.init === 'function') {
      window.init();
    }
  };

  var onbuttonclick = function (ev) {
    $mon.html('');
    ev.preventDefault();
  };

  window.logging = function (str) {
    $mon.prepend('<div>' + str + '</div>');
    return str;
  };

  $(init);
}
)();