/**
 * todos!
 */
(function () {
  var STATE_DOCK_TOP = -2;
  var STATE_STICK_TOP = -1;
  var STATE_NONSTICK = 0;
  var STATE_STICK_BOT = 1;
  var STATE_DOCK_BOT = 2;
  var DIRECTION_UP = 'up';
  var DIRECTION_DOWN = 'down';
  var SIDEBAR_HEIGHT;
  var SCROLL_TOP_MAX;
  var SCROLL_BOTTOM_MAX;
  var PAD_MS = 40;

  var $win;
  var $main;
  var $sb;
  var $pagetop;
  var $pagebot;
  var $button;
  var current_direction = DIRECTION_DOWN;
  var current_state = STATE_DOCK_TOP;
  var current_left = false;

  window.init = function () {
    var st;
    // collect elements
    $win = $(window);
    $sb = $('.sidebar');
    $main = $('.main'); 
    $pagetop = $('#pagetop');
    $pagebot = $('#pagebottom');
    $('#monitorclear').append('<br /><button id="makevisible">Make line visible</button>');
    $button = $('#makevisible');

    // levelling
    st = $win.scrollTop();
    $sb.attr('style', '');
    $win.scrollTop(0);

    // get static number
    SCROLL_TOP_MAX = Math.round( $sb.offset().top );
    SCROLL_BOTTOM_MAX = Math.round( $main.offset().top + $main.outerHeight(true) );
    SIDEBAR_HEIGHT = Math.round( $sb.outerHeight(true) );

    // events!
    $sb.scrollbeacon(
      {
        topreached: onSidebarTopreached,
        bottomreached: onSidebarBottomreached
      }
    );
    $pagetop
      .css('top', SCROLL_TOP_MAX)
      // .css({'background-color': '#F00', visibility: 'visible'})
      .scrollbeacon({topreached: onPagetopTopReached});
    $pagebot
      .css('top', SCROLL_BOTTOM_MAX)
      // .css({'background-color': '#F00', visibility: 'visible'})
      .scrollbeacon({bottomreached: onPagebotBottomReached});
    $win
      .resize(onWindowResize)
      .data('scroller').setScrollTick(onScrollTick);
    $button.click(onButtonClick);

    // scroll back to where it was
    $('html,body').animate(
      {scrollTop: st},
      250
    );
  };

  // =======================================================

  var onScrollTick = function (ev) {
    var dir = ev.scrollbeacon.direction;
    switch(current_state) {
      case STATE_STICK_TOP:
      	if (dir === DIRECTION_DOWN) {
          logging('top stick => going opposite');
          refresh(dir);
        }
      break;

      case STATE_STICK_BOT:
      	if (dir === DIRECTION_UP) {
          logging('bottom stick => going opposite');
          refresh(dir);
        }
      break;
    }
    current_direction = dir;
  };

  var onPagetopTopReached = function (ev) {
    logging('Pagetop');
    var dir = ev.scrollbeacon.direction;
    if (dir === DIRECTION_UP) {
      setTimeout(function () {refresh(dir);}, 1);
    }
    else {
      refresh(dir);
    }
  };

  var onPagebotBottomReached = function (ev) {
    logging('Pagebot');
    var dir = ev.scrollbeacon.direction;
    if (dir === DIRECTION_DOWN) {
      setTimeout(function () {refresh(dir);}, 1);
    }
    else {
      refresh(dir);
    }
  };

  var onSidebarTopreached = function (ev) {
    if (current_state === STATE_NONSTICK) {
      logging('SidebarTop: refresh');
      refresh(ev.scrollbeacon.direction);
    }
    else {
      logging('SidebarTop:' + getCurrentState());
    }
  };

  var onSidebarBottomreached = function (ev) {
    if (current_state === STATE_NONSTICK) {
      logging('SidebarBottom: refresh');
      refresh(ev.scrollbeacon.direction);
    }
    else {
      logging('SidebarBottom:' + getCurrentState());
    }
  };

  var onWindowResize = function (ev) {
    if (current_left) {
      $sb.css('left', getSidebarLeft());
    }
  };

  // =======================================================

  var refresh = function (dir) {
    var o = getCurrentPosition(dir);
    $sb
      .scrollbeacon('stop')
      .css(o);
    if (o.position !== 'fixed') {
      $sb.scrollbeacon(
        {
          topreached: onSidebarTopreached,
          bottomreached: onSidebarBottomreached
        }
      );
    }
  };

  var getSidebarLeft = function () {
    return Math.round($main.offset().left + $main.outerWidth(true) + PAD_MS);
  };

  var getCurrentPosition = function (dir) {
    var result;
    var o = $sb.offset();
    var w_height = $win.height();
    var s_top = Math.round( o.top );
    var s_bot = Math.round( o.top + SIDEBAR_HEIGHT );
    var v_top = $win.scrollTop();
    var v_bot = v_top + w_height;
    var temp_top;
    // console.log('getCurrentPosition: ', ['srl', SCROLL_TOP_MAX, SCROLL_BOTTOM_MAX, 'sb_p', s_top, s_bot, 'v_p', v_top, v_bot, 'w', w_height, 'sb', SIDEBAR_HEIGHT]);

    if (dir === 'down') {
      // GOING DOWN!
      if (SCROLL_BOTTOM_MAX <= s_bot) {
        // reached to the bottom
        // console.log('reached bottom');
        current_state = STATE_DOCK_BOT;
        current_left = false;
        result = {
          position: 'absolute',
          top: 'auto',
          right: 0,
          bottom: 0,
          left: 'auto',
        };
      }
      else if (s_bot <= v_bot) {
        // stick
        // console.log('stick bottom');
        current_state = STATE_STICK_BOT;
        current_left = true;
        result = {
          position: 'fixed',
          top: 'auto',
          right: 'auto',
          bottom: 0,
          left: getSidebarLeft(),
        };
      }
      else {
        // scrolling
        // console.log('currently: ' + getCurrentState());
        if (current_state === STATE_STICK_TOP) {
          temp_top = v_top;
          // console.log('scrolling down special: ', temp_top);
        }
        else {
          temp_top = v_bot - SIDEBAR_HEIGHT;
          // console.log('scrolling down', [temp_top, SCROLL_TOP_MAX]);
        }
        current_state = STATE_NONSTICK;
        current_left = false;
        result = {
          position: 'absolute',
          top: (temp_top < SCROLL_TOP_MAX ? 0 : temp_top - SCROLL_TOP_MAX),
          right: 0,
          bottom: 'auto',
          left: 'auto',
        };
      }
    }
    else  {
      // GOING UP!
      if (SCROLL_TOP_MAX >= s_top) {
        // reached to the top
        // console.log('reached top');
        current_state = STATE_DOCK_TOP;
        current_left = false;
        result = {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 'auto',
          left: 'auto'
        };
      }
      else if (s_top >= v_top) {
        // stick
        // console.log('stick top');
        current_state = STATE_STICK_TOP;
        current_left = true;
        result = {
          position: 'fixed',
          top: 0,
          right: 'auto',
          bottom: 'auto',
          left: getSidebarLeft(),
        };
      }
      else {
        // scrolling    
        // console.log('scrolling up ', getCurrentState());
        current_state = STATE_NONSTICK; 
        current_left = false;
        temp_top = v_bot - SIDEBAR_HEIGHT;
        result = {
          position: 'absolute',
          top: (temp_top < SCROLL_TOP_MAX ? 0 : temp_top - SCROLL_TOP_MAX),
          right: 0,
          bottom: 'auto',
          left: 'auto',
        };
      }
    }
    return result;
  };

  // =======================================================

  var getCurrentState = function () {
    var result;
    switch (current_state) {
    case STATE_DOCK_TOP:
      result = '\tDOCK TOP';
      break;
    case STATE_STICK_TOP:
      result = '\tSTICK TOP';
      break;
    case STATE_NONSTICK:
      result = '\tNON STICK';
      break;
    case STATE_STICK_BOT:
      result = '\tSTICK BOT';
      break;
    case STATE_DOCK_BOT:
      result = '\tDOCK BOT';
      break;
    };
    return result;
  };

  var onButtonClick = function (ev) {
    ev.preventDefault();
    $('.scrollsupport').css({'background-color': '#F00', visibility: 'visible'});
  };

})();