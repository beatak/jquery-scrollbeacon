(function ($, window) {
  "use strict";

  window.init = function () {
    var main = document.getElementById('main');

    // obviously, i can write these three control in one unified
    // way, but for demonstration purpose, I will write in three
    // different ways.

    $('.dial.font').each(
      function (i, elm) {
        var $elm = $(elm);
        var prop = $elm.data('property');
        $elm.find('li').scrollbeacon(
          {
            parent: elm,
            topreached: getReachedFunc(main, prop, 'up'),
            bottomreached: getReachedFunc(main, prop, 'down')
          }
        );
      }
    );

    $('.dial.width').each(
      function (i, elm) {
        var $elm = $(elm);
        var prop = $elm.data('property');
        $elm.find('li').scrollbeacon(
          {
            parent: elm,
            positionchange: function (ev) {
              if (ev.scrollbeacon.position === $.scrollbeacon.VIEW_INTERSECT) {
                var val = $(ev.target).data('value');
                if (val) {
                  changeClassName(main, prop, val);
                  logging(prop + ': ' + val);
                }
              }
            }
          }
        );
      }
    );

    $('.dial.color').each(
      function (i, elm) {
        var $elm = $(elm);
        var prop = $elm.data('property');
        $elm.find('li')
          .scrollbeacon({parent:elm})
          .each(
            function () {
              var $t = $(this);
              if ($t.hasClass('filler')) {
                return;
              }
              $t.css('background-color', $t.data('value'));
              $t.on('topreached.scrollbeacon', getReachedFunc(main, prop, 'up'));
              $t.on('bottomreached.scrollbeacon', getReachedFunc(main, prop, 'down'));
            }
          );
      }
    );
  };

  var getReachedFunc = function (elm, prop, dir) {
    return function (ev) {
      if (ev.scrollbeacon.direction === dir) {
        var val = $(ev.target).data('index') || $(ev.target).data('value');
        if (val) {
          changeClassName(elm, prop, val);
          logging(prop + ': ' + val);
        }
      }      
    };
  };

  var changeClassName = function (elm, prop, val) {
    var names = $.map(
      elm.className.split(' '),
      function (elm, i) {
        if (elm.indexOf(prop) !== 0) {
          return elm;
        }
      }
    );
    names[names.length] = prop + '-' + val;
    elm.className = names.join(' ');
  };
})(jQuery, window);