# jQuery.scrollbeacon

jQuery.scrollbeacon is a scroll event utility.
You can set a target object and receive events when it changes the position to the viewport.

## Design Concept

* lightweight
* clean/easy to learn api
* iOS compatibility (use least setTimeout!)

There are two inner classes -- `Scroller` and `MovingTarget`.
Scroller is `window` unless you specify it.
What you really care is `MovingTarget` instances.

## Example:

    $('.scrollbeacon').scrollbeacon(
      {
    		appear: function (ev) { /* do something when it comes into viewport */ },
    		disappear: function (ev) { /* do something when it gets out of viewport */ },
        topreached: function (ev) { /* when top of elm hits top of viewport */ },
        bottomreached: function (ev) { /* when bottom of elm hits bottom of viewport */ }
      }
    );

    // if you pass parent, it will attached to the parent
    $('.scrollbeacon').scrollbeacon(
    	{
    		parent: '#scroll_parent',
    		appear: function (ev) {...}
    	}
    );

    // you can pass scrolltick
    // note you can only assign one on scroll per parent.
    // for performance reason
    $('.scrollbeacon').scrollbeacon(
    	{
    		scrolltick: function (ev) {
    			// do something for every time, scroll gets fired,
    			// as throttled
    		}
    	}
    );

    // you can get a parent by
    var parent = $('.scrollbeacon').data('scroller');
    parent.refresh();

## DEMO

* [basic scrolling](http://beatak.github.com/jquery-scrollbeacon/)
* [infinite scrolling](http://beatak.github.com/jquery-scrollbeacon/infinitescroll.html)
* [dial control](http://beatak.github.com/jquery-scrollbeacon/dial.html)

## Special Thanks

Heavily inspired by [jQuery Waypoints](http://imakewebthings.com/jquery-waypoints/).  [YUI Scroll beacon](http://yuilibrary.com/gallery/show/scroll-beacon) is not something that I knowof until name this.  Thanks for [Meetup](http://www.meetup.com/) for letting me make this.  And thank you also to [Adrian](http://twitter.com/adrianparsons), [Doug](http://twitter.com/softprops), [Adam](http://twitter.com/akdetrick) and [Mark](http://twitter.com/fishmongr)!