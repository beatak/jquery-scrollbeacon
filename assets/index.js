(
  function () {
    var arr = ['#111', '#333', '#666', '#999', '#aaa', '#ccc', '#eee'];

    var $mon;
    var $button;

    var init = function () {
      $mon = $('#monitor');
      $button = $('#monitorclear > button');
      $button.click(
        function (ev) {
          $mon.html('');
          ev.preventDefault();
        }
      );
      $('.yaylist').scrolling(
        {
          scroll: onscroll,
          appear: onappear,
          disappear: ondisappear,
          positionchange: onpositionchange
        }
      );
    };

    var onpositionchange = function (ev) {
      // console.log(ev);
      $mon.prepend('<div>position changed: ' + $(ev.target).data('num') + '</div>');
    };

    var onscroll = function (ev) {
      // console.log(ev);
      $mon.prepend('<div>' + JSON.stringify(ev.scrolling) + '</div>');
    };

    var onappear = function (ev) {
      console.log('on appear: ', ev);
      $mon.prepend('<div>appear: '+ $(ev.target).data('num') + '</div>');
    }

    var ondisappear = function (ev) {
      console.log('on disappear: ', ev);
      $mon.prepend('<div>disappear: ' + $(ev.target).data('num') + '</div>');
    }

    $(
      function () {
        console.log('hi');
        var $mylist = $('.mylist');
        var $li;
        for (var i = 0, len = arr.length; i < len; ++i) {
          $li = $('<li class="yaylist" data-num="' + i + '">' + 'my number: ' + i + '</li>');
          $li.css('background-color', arr[i]);
          $mylist.append($li);
        }
        setTimeout(init, 500);
      }
    );
  }
)();
