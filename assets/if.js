(function ($, window) {
  "use strict";

  var semaphore = false;
  var mytext;
  var counter = 0;

  window.init = function () {
    mytext = $('#container').html();
    $('footer').scrollbeacon(
      {
        appear: onappear,
        offset: {top: -300}
      }
    );
  };

  var onappear = function (ev) {
    logging('onappear');
    if (semaphore === false) {
      logging('adding! ' + counter + ' times');
      toggleFooter();
      setTimeout(appendText, 250);
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
    $('footer').data('scrollbeacon').refresh();
  };

})(jQuery, window);