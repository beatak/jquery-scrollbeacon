(function () {
  var $pagetop;
  var $pagebot;
  var $gc;
  var $logo;
  var $win;
  var $sticky;
  var $footer;
  var P_GC_ORIG_TOP;
  var P_LOGO_ORIG_TOP;
  var P_DIFF_GC_LOGO;

  window.init = function () {
    // setting vars
    $win = $(window);
    $pagetop = $('#pagetop');
    $pagebot = $('#pagebottom');
    $gc = $('.global-control');
    $logo = $('.logo');
    $sticky = $('.sticky');
    $footer = $('footer');

    // massage data for reload issue
    var sc = $win.scrollTop();
    $win.scrollTop(0);
    $gc.attr('style', '');
    $logo.attr('style', '');
    P_GC_ORIG_TOP = Math.round( $gc.offset().top );
    P_LOGO_ORIG_TOP = Math.round( $logo.offset().top );
    P_DIFF_GC_LOGO = P_GC_ORIG_TOP - P_LOGO_ORIG_TOP;

    // $pagetop.css({'background-color': '#F00', visibility: 'visible'});
    $pagetop.scrollbeacon(
      {
        scrolltick: onScrollTick,
        appear: onPagetopAppear
      }
    );
    // $pagebot.css({'background-color': '#F00', visibility: 'visible'});
    $pagebot.css('top', $(document).outerHeight(true) - 80);
    $pagebot.scrollbeacon(
      {
        bottomreached: onPageBotBottomReached
      }
    );
    $sticky.scrollbeacon(
      {
        offset: {top: -60},
        topreached: onStickyTopReached
      }
    );
    $footer.hover(onFooterHover).data('showing', false).data('hover', false);

    // just massage back
    if (sc) {
      $('html,body').animate(
        {
          scrollTop: sc
        },
        200
      );
    }
  };

  var onFooterHover = function (ev) {
    if (ev.type === 'mouseenter') {
      $footer.data('hover', true);
      if ($footer.data('showing') === false) {
        $footer.addClass('showing');
      }
    }
    else if (ev.type === 'mouseleave') {
      $footer.data('hover', false);
      if ($footer.data('showing') === false) { 
        $footer.removeClass('showing')
      }
    }
  };

  var onPageBotBottomReached = function (ev) {
    if (ev.scrollbeacon.direction === 'down') {
      logging( 'pagebottom: showing' );
      $footer.data('showing', true);
      if ($footer.data('hover') === false) {
        $footer.addClass('showing');
      }
    }
    else {
      logging( 'pagebottom: hidden' );
      $footer.data('showing', false);
      if ($footer.data('hover') === false) {
        $footer.removeClass('showing');
      }
    }
  };

  var onStickyTopReached = function (ev) {
    if (ev.scrollbeacon.direction === 'up') {
      logging( 'sticky: released' );
      $sticky.attr('style', '');
    }
    else {
      logging( 'sticky: sticked' );
      $sticky.css({
        position: 'fixed',
        top: 60
      });
    }
  };

  var onPagetopAppear = function (ev) {
    if (ev.scrollbeacon.direction === 'up') {
      logging( 'pagetop: appeared!' );
      $gc.attr('style', '');
      $logo.attr('style', '');
    }
  };

  var onScrollTick = function (ev) {
    var top = $win.scrollTop();
    logging( 'tick: ' + top );
    if (top < P_GC_ORIG_TOP) {
      $gc.css('top', P_GC_ORIG_TOP - top);
    }
    else {
      $gc.css('top', 0);
    }
    if (top > P_DIFF_GC_LOGO) {
      if (top < P_GC_ORIG_TOP) {
        $logo.css('top', P_LOGO_ORIG_TOP + (P_DIFF_GC_LOGO - top));
      }
      else {
        $logo.css('top', 0);
      }
    }
  };

})();