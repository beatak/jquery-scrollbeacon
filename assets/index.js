(function ($, window) {
  "use strict";
  var arr = ['#111', '#333', '#666', '#999', '#aaa', '#ccc', '#eee'];

  window.init = function () {
    var $mylist = $('.mylist');
    $.each(
      arr,
      function (i, elm) {
        var $li = $('<li class="yaylist" data-num="' + i + '">' + 'my number: ' + i + '<button>Destroy me!</button></li>');
        if (i === 0) {
          $li.css('color', '#FFF');
        }
        $li.css('background-color', elm);
        $mylist.append($li);
      }
    );

    var $yay = $('.yaylist');
    $yay.find('button').click(onButtonClick);
    $yay.scrollbeacon(
      {
        scrolltick: onscrolltick,
        appear: onappear,
        disappear: ondisappear,
        positionchange: onpositionchange
      }
    );
  };

  var onButtonClick = function (ev) {
    ev.preventDefault();
    var s = $(ev.target.parentNode).data('scrollbeacon');
    if (s) {
      s.destroy();
    }
    $(ev.target).remove();
  };

  var onpositionchange = function (ev) {
    // console.log(ev);
    logging('position changed: ' + $(ev.target).data('num'));
  };

  var onscrolltick = function (ev) {
    // console.log(ev);
    logging(JSON.stringify(ev.scrollbeacon));
  };

  var onappear = function (ev) {
    // console.log('on appear: ', ev);
    logging($(ev.target).data('num'));
  };

  var ondisappear = function (ev) {
    // console.log('on disappear: ', ev);
    logging($(ev.target).data('num'));
  };
})(jQuery, window);