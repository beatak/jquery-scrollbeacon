(function ($, window) {
  "use strict";

  var semaphore = false;
  var mytext;
  var counter = 0;

  window.init = function () {
    mytext = $('#container').html();
    $('footer').scrolling(
      {
        positionchange: onpositionchange,
        offset_t: -300
      }
    );
  };

  var onpositionchange = function (ev) {
    if (semaphore === false) {
      logging('psoition change: ' + counter);
      toggleFooter();
      setTimeout(appendText, 500);
    }
  };

  var toggleFooter = function () {
    var $footer = $('footer');
    var $anch = $footer.find('a');
    var text = $anch.data('text');
    var oldtext = $anch.html();
    if (!semaphore) {
      $anch.addClass('loading');
    }
    else {
      $anch.removeClass('loading');
    }
    semaphore = !semaphore;
    $anch.html(text);
    $anch.data('text', oldtext);
  };

  var appendText = function () {
    toggleFooter();
    var $container = $('#container');
    var text = mytext;
    var $div = $('<div />');
    $div.append(text);
    var count = ++counter;
    $div.find('h1').append('count: ' + count);
    $div.find('> *').each(
      function (i, elm) {
        $container.append(elm);
      }
    );
    $('footer').data('scrolling').refresh();
  };

})(jQuery, window);