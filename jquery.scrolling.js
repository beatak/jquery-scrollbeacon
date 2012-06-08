(
function ($, window) {
  "use strict";

  var scrollers = [];
  var jquery_scrolling = $.scrolling = {
    every: 34 // 30 fps
  };

  var DEFAULT_OPTIONS = {
    parent: window,
    offset_t: 0,
    offset_b: 0,
    scrolltick: null,
    appear: null,
    disappear: null,
    positionchange: null
  };

  var EV_POSTIONCHANGE = 'positionchange.scrolling';
  var EV_APPEAR = 'appear.scrolling';
  var EV_DISAPPEAR = 'disappear.scrolling';

  var VIEW_OUT = 0;
  var VIEW_CLIP_TOP = 4;
  var VIEW_INTERSECT = 2;
  var VIEW_CLIP_BOTTOM = 1;
  var VIEW_OVERLAP = 7;

  /**
   * jQuery.scrolling
   * (c) 2012, Takashi Mizohata
   * MIT
   */
  $.fn.scrolling = function () {
    var method;
    var opts;
    var args;

    if (typeof arguments[0] === 'string') {
      method = arguments[0];
      opts = $.extend({}, DEFAULT_OPTIONS, arguments[1]|| {});
      args = Array.prototype.slice.call(arguments, 2);
    }
    else {
      method = 'init';
      opts = $.extend({}, DEFAULT_OPTIONS, arguments[0]|| {});
      args = Array.prototype.slice.call(arguments, 1);
    }

    var $parent = $(opts.parent);
    if ($parent.length === 0 || $parent.length > 1) {
      throw new Error('parent has to be a single object.');
    }

    var scroller = $parent.data('scroller');
    if (scroller === undefined) {
      scroller = new Scroller($parent[0]);
    }
    scroller.setScrollTick(opts.scrolltick);

    var methods = {
      init: function (i, elm) {
        var $elm = $(elm);
        console.log('scrolling::init ', i);
        scroller.add(elm, opts);
        return this;
      },
      refresh: function (i, elm) {
        console.log('scrolling::refresh');
      }
    };

    return this.each(methods[method]);
  };

  // =========================

  var Scroller = function (elm) {
    var $elm = $(elm);
    this.elm = elm;
    this.targets = [];
    this.scrolltick = null;
    this.last_scroll = getNow();
    this.last_top = $elm.scrollTop();
    this.handler_tailing = false;
    this.tailing_function = $.proxy(this._tail, this);
    this.tailing_event = null;

    $elm.data('scroller', this);

    $elm.on('scroll', $.proxy(this._onscroll, this));
    $elm.bind('touchmove', $.proxy(this._onscroll, this)); // for iOS
  };

  Scroller.prototype.setScrollTick = function (func) {
    if (typeof func === 'function') {
      this.scrolltick = func;
    }    
    return this;
  };

  Scroller.prototype.removeScrollTick = function () {
    this.scrolltick = null;
    return this;
  };

  Scroller.prototype.hookEventBinding = function (direction, type, target) {
    console.log('Scroller::hookEventBinding: ', type, direction);
    return this;
  };

  Scroller.prototype.add = function (elm, opts) {
    this.targets[this.targets.length] = new MovingTarget(this, elm, opts);
    return this;
  };

  Scroller.prototype.refresh = function () {
    // refresh all elements position
    console.log('implement me!');
    return this;
  };

  Scroller.prototype._tail = function () {
    var tailev = this.tailing_event;
    this.handler_tailing = false;
    this.tailing_event = null;
    this._scrollimpl(tailev);
  };

  Scroller.prototype._onscroll = function (ev) {
    var now = getNow();
    if (now - this.last_scroll > jquery_scrolling.every) {
      this.last_scroll = now;
      this._scrollimpl(ev);
      return;
    }

    if (this.handler_tailing) {
      clearTimeout(this.handler_tailing);
    }
    this.handler_tailing = setTimeout(this.tailing_function, jquery_scrolling.every / 2 );
    this.tailing_event = ev;
  };

  Scroller.prototype._scrollimpl = function (ev) {
    var $elm = $(this.elm);
    var top = $elm.scrollTop();
    var delta = top - this.last_top;
    var direction = (delta >= 0);
    var scrolling = ev.scrolling = {
      direction: direction,
      delta: delta
    };
    this.last_top = top;
    if (this.scrolltick) {
      this.scrolltick(ev);
    }

    // FIXME 
    var re = $.map(this.targets, findChanged(this.elm));
    // console.log('mapped: ', re);
    $.each(re, dispatchEvent(scrolling));
  };

  // =============================================

  var MovingTarget = function (scroller, elm, opts) {
    var $elm = $(elm);
    var top = Math.round($elm.offset().top + opts.offset_t);
    var bottom = top + Math.round($elm.outerHeight(true) + opts.offset_b);
    var pos = findPosition(scroller.elm, top, bottom);
    this.elm = elm;
    this.scroller = scroller;
    this.position = pos;
    this.in_view = (pos > VIEW_OUT);
    this.top = top;
    this.bottom = bottom;
    this.offset_t = opts.offset_t;
    this.offset_b = opts.offset_b;

    $elm.data('scrolling', this);

    if (typeof opts.positionchange === 'function') {
      $elm.on(EV_POSTIONCHANGE, opts.positionchange);
    }
    if (typeof opts.appear === 'function') {
      $elm.on(EV_APPEAR, opts.appear);
    }
    if (typeof opts.disappear === 'function') {
      $elm.on(EV_DISAPPEAR, opts.disappear);
    }
  };

  MovingTarget.prototype.remove = function () {
    return this;
  };

  MovingTarget.prototype.refresh = function () {
    return this;
  };

  // =========================

  var getNow = function () {
    return (new Date()).valueOf();
  };

  var findPosition = function (parent, t_top, t_bottom) {
    var result = VIEW_OUT;
    var $p = $(parent);
    var p_top = $p.scrollTop();
    var p_bottom = p_top + $p.height();
    if (t_bottom <= p_top) {
      // target is above viewport
    }
    else if (p_bottom <= t_top) {
      // target is below viewport
    } 
    else {
      if (t_top <= p_top) {
        if (p_bottom <= t_bottom) {
          // target is larger than viewport
          result = VIEW_OVERLAP;
        }
        else if (t_bottom <= p_bottom) {
          result = VIEW_CLIP_TOP;
        }
      }
      else if (p_top <= t_top) {
        if (t_bottom <= p_bottom) {
          // target is inside
          result = VIEW_INTERSECT;
        }
        else if (t_bottom <= t_bottom) {
          result = VIEW_CLIP_BOTTOM;
        }
      }
    }
    return result;
  };

  var dispatchEvent = function (scrolling) {
    return function (i, mapped) {
      var e_appear_disappear;
      var e_change = jQuery.Event(EV_POSTIONCHANGE);
      var target = mapped.target;
      var $elm = $(target.elm);
      var s = $.extend({}, scrolling);
      s.position = target.position;

      e_change.scrolling = s;
      $elm.triggerHandler(e_change);

      if (mapped.event_ad) {
        if (target.in_view) {
          e_appear_disappear = jQuery.Event(EV_APPEAR);
        }
        else {
          e_appear_disappear = jQuery.Event(EV_DISAPPEAR);
        }
        e_appear_disappear.scrolling = s;
        $elm.triggerHandler(e_appear_disappear);
      }
    }
  };

  var findChanged = function (parent) {
    return function (target, i) {
      var result = undefined;
      var pos = findPosition(parent, target.top, target.bottom);
      if (target.position !== pos) {
        result = {target: target};
        target.position = pos;
        if (pos > VIEW_OUT) {
          if (!target.in_view) {
            target.in_view = true;
            result.event_ad = true;
          }
        }
        else {
          if (target.in_view) {
            target.in_view = false;
            result.event_ad = true;
          }
        }
      }
      return result;
    };
  };

  // =============================================

jQuery.event.special['appear'] = {
  // setup: function( data, namespaces, handler ) {
  //   // when you multiple binding, called once per an element
  //   console.log('appear::setup');
  //   console.log(arguments);
  //   console.log(this);
  // },

  add: function( handlerObj ) {
    // called for each bound handler
    if (handlerObj.namespace === 'scrolling') {
      var target = $(this).data('scrolling');
      target.scroller.hookEventBinding(true, 'appear', target);
    }
  },

  remove: function( handlerObj ) {
    // called for each bound handler
    if (handlerObj.namespace === 'scrolling') {
      var target = $(this).data('scrolling');
      target.scroller.hookEventBinding(false, 'appear', target);
    }
  }

  // teardown: function( namespaces ) {
  //   // called once per an element
  //   console.log('appear::teardown');
  //   console.log(arguments);
  //   console.log(this);
  // },

  // trigger: function( event ) {
  //   console.log('appear::trigger');
  //   console.log(arguments);
  //   console.log(this);
  // }
};

/***************************************************

	// as easy as
	$('.scrolling').scrolling(
		{
			appear: function (ev) {
				// do something when it comes into viewport
			},
			disappear: function (ev) {
				// do something when it gets out of viewport
			}
		}
	);

	// if you pass parent, it will attached to the parent
	$('.scrolling').scrolling(
		{
			parent: '#scroll_parent',
			appear: function (ev) {
				// this event will be fired on scroll of the parent
			}
		}
	);

	// you can pass ontick
	// note you can only assign one on scroll per parent.
  // for performance reason
	$('.scrolling').scrolling(
		{
			scroll: function (ev) {
				// do something for every time, scroll gets fired,
				// as throttled
			}
		}
	);

	// you can get a parent by
	var parent = $('.scrolling').data('scroller');
	parent.refresh();

	// or call the event
	$('.scroll').triggerHandler('refresh.scrolling');

	// 

*****************************************************/

})(jQuery, window);