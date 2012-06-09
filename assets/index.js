(function () {
  "use strict";
  var arr = ['#111', '#333', '#666', '#999', '#aaa', '#ccc', '#eee'];

  window.init = function () {
    var $mylist = $('.mylist');
    $.each(
      arr,
      function (i, elm) {
        var $li = $('<li class="yaylist" data-num="' + i + '">' + 'my number: ' + i + '</li>');
        $li.css('background-color', elm);
        $mylist.append($li);
      }
    );

    $('.yaylist').scrolling(
      {
        scrolltick: onscrolltick,
        appear: onappear,
        disappear: ondisappear,
        positionchange: onpositionchange
      }
    );
  };

  var onpositionchange = function (ev) {
    // console.log(ev);
    logging('position changed: ' + $(ev.target).data('num'));
  };

  var onscrolltick = function (ev) {
    // console.log(ev);
    logging(JSON.stringify(ev.scrolling));
  };

  var onappear = function (ev) {
    // console.log('on appear: ', ev);
    logging($(ev.target).data('num'));
  }

  var ondisappear = function (ev) {
    // console.log('on disappear: ', ev);
    logging($(ev.target).data('num'));
  }
})();