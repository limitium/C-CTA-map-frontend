/*
 * jQuery miniColors: A small color selector
 *
 * Copyright 2011 Cory LaViska for A Beautiful Site, LLC. (http://abeautifulsite.net/)
 *
 * Dual licensed under the MIT or GPL Version 2 licenses
 *
 */
if(jQuery) (function($) {

    $.extend($.fn, {

        miniColors: function(o, data) {

            var create = function(input, o, data) {
                //
                // Creates a new instance of the miniColors selector
                //

                // Determine initial color (defaults to white)
                var color = expandHex(input.val());
                if( !color ) color = 'ffffff';
                var hsb = hex2hsb(color);

                // Create trigger
                var trigger = $('<a class="miniColors-trigger" style="background-color: #' + color + '" href="#"></a>');
                trigger.insertAfter(input);

                // Set input data and update attributes
                input
                    .addClass('miniColors')
                    .data('original-maxlength', input.attr('maxlength') || null)
                    .data('original-autocomplete', input.attr('autocomplete') || null)
                    .data('letterCase', 'uppercase')
                    .data('trigger', trigger)
                    .data('hsb', hsb)
                    .data('change', o.change ? o.change : null)
                    .attr('maxlength', 7)
                    .attr('autocomplete', 'off')
                    .val('#' + convertCase(color, o.letterCase));

                // Handle options
                if( o.readonly ) input.prop('readonly', true);
                if( o.disabled ) disable(input);

                // Show selector when trigger is clicked
                trigger.bind('click.miniColors', function(event) {
                    event.preventDefault();
                    if( input.val() === '' ) input.val('#');
                    show(input);

                });

                // Show selector when input receives focus
                input.bind('focus.miniColors', function(event) {
                    if( input.val() === '' ) input.val('#');
                    show(input);
                });

                // Hide on blur
                input.bind('blur.miniColors', function(event) {
                    var hex = expandHex(input.val());
                    input.val( hex ? '#' + convertCase(hex, input.data('letterCase')) : '' );
                });

                // Hide when tabbing out of the input
                input.bind('keydown.miniColors', function(event) {
                    if( event.keyCode === 9 ) hide(input);
                });

                // Update when color is typed in
                input.bind('keyup.miniColors', function(event) {
                    setColorFromInput(input);
                });

                // Handle pasting
                input.bind('paste.miniColors', function(event) {
                    // Short pause to wait for paste to complete
                    setTimeout( function() {
                        setColorFromInput(input);
                    }, 5);
                });

            };

            var destroy = function(input) {
                //
                // Destroys an active instance of the miniColors selector
                //

                hide();
                input = $(input);

                // Restore to original state
                input.data('trigger').remove();
                input
                    .attr('autocomplete', input.data('original-autocomplete'))
                    .attr('maxlength', input.data('original-maxlength'))
                    .removeData()
                    .removeClass('miniColors')
                    .unbind('.miniColors');
                $(document).unbind('.miniColors');
            };

            var enable = function(input) {
                //
                // Enables the input control and the selector
                //
                input
                    .prop('disabled', false)
                    .data('trigger')
                    .css('opacity', 1);
            };

            var disable = function(input) {
                //
                // Disables the input control and the selector
                //
                hide(input);
                input
                    .prop('disabled', true)
                    .data('trigger')
                    .css('opacity', 0.5);
            };

            var show = function(input) {
                //
                // Shows the miniColors selector
                //
                if( input.prop('disabled') ) return false;

                // Hide all other instances
                hide();

                // Generate the selector
                var selector = $('<div class="miniColors-selector"></div>');
                selector
                    .append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"></div></div>')
                    .append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>')
                    .css({
                        top: input.is(':visible') ? input.offset().top + input.outerHeight() : input.data('trigger').offset().top + input.data('trigger').outerHeight(),
                        left: input.is(':visible') ? input.offset().left : input.data('trigger').offset().left,
                        display: 'none'
                    })
                    .addClass( input.attr('class') );

                // Set background for colors
                var hsb = input.data('hsb');
                selector
                    .find('.miniColors-colors')
                    .css('backgroundColor', '#' + hsb2hex({ h: hsb.h, s: 100, b: 100 }));

                // Set colorPicker position
                var colorPosition = input.data('colorPosition');
                if( !colorPosition ) colorPosition = getColorPositionFromHSB(hsb);
                selector.find('.miniColors-colorPicker')
                    .css('top', colorPosition.y + 'px')
                    .css('left', colorPosition.x + 'px');

                // Set huePicker position
                var huePosition = input.data('huePosition');
                if( !huePosition ) huePosition = getHuePositionFromHSB(hsb);
                selector.find('.miniColors-huePicker').css('top', huePosition.y + 'px');

                // Set input data
                input
                    .data('selector', selector)
                    .data('huePicker', selector.find('.miniColors-huePicker'))
                    .data('colorPicker', selector.find('.miniColors-colorPicker'))
                    .data('mousebutton', 0);

                $('BODY').append(selector);
                selector.fadeIn(100);

                // Prevent text selection in IE
                selector.bind('selectstart', function() { return false; });

                $(document).bind('mousedown.miniColors touchstart.miniColors', function(event) {

                    input.data('mousebutton', 1);

                    if( $(event.target).parents().andSelf().hasClass('miniColors-colors') ) {
                        event.preventDefault();
                        input.data('moving', 'colors');
                        moveColor(input, event);
                    }

                    if( $(event.target).parents().andSelf().hasClass('miniColors-hues') ) {
                        event.preventDefault();
                        input.data('moving', 'hues');
                        moveHue(input, event);
                    }

                    if( $(event.target).parents().andSelf().hasClass('miniColors-selector') ) {
                        event.preventDefault();
                        return;
                    }

                    if( $(event.target).parents().andSelf().hasClass('miniColors') ) return;

                    hide(input);
                });

                $(document)
                    .bind('mouseup.miniColors touchend.miniColors', function(event) {
                        event.preventDefault();
                        input.data('mousebutton', 0).removeData('moving');
                    })
                    .bind('mousemove.miniColors touchmove.miniColors', function(event) {
                        event.preventDefault();
                        if( input.data('mousebutton') === 1 ) {
                            if( input.data('moving') === 'colors' ) moveColor(input, event);
                            if( input.data('moving') === 'hues' ) moveHue(input, event);
                        }
                    });

            };

            var hide = function(input) {

                //
                // Hides one or more miniColors selectors
                //

                // Hide all other instances if input isn't specified
                if( !input ) input = '.miniColors';

                $(input).each( function() {
                    var selector = $(this).data('selector');
                    $(this).removeData('selector');
                    $(selector).fadeOut(100, function() {
                        $(this).remove();
                    });
                });

                $(document).unbind('.miniColors');

            };

            var moveColor = function(input, event) {

                var colorPicker = input.data('colorPicker');

                colorPicker.hide();

                var position = {
                    x: event.pageX,
                    y: event.pageY
                };

                // Touch support
                if( event.originalEvent.changedTouches ) {
                    position.x = event.originalEvent.changedTouches[0].pageX;
                    position.y = event.originalEvent.changedTouches[0].pageY;
                }
                position.x = position.x - input.data('selector').find('.miniColors-colors').offset().left - 5;
                position.y = position.y - input.data('selector').find('.miniColors-colors').offset().top - 5;
                if( position.x <= -5 ) position.x = -5;
                if( position.x >= 144 ) position.x = 144;
                if( position.y <= -5 ) position.y = -5;
                if( position.y >= 144 ) position.y = 144;

                input.data('colorPosition', position);
                colorPicker.css('left', position.x).css('top', position.y).show();

                // Calculate saturation
                var s = Math.round((position.x + 5) * 0.67);
                if( s < 0 ) s = 0;
                if( s > 100 ) s = 100;

                // Calculate brightness
                var b = 100 - Math.round((position.y + 5) * 0.67);
                if( b < 0 ) b = 0;
                if( b > 100 ) b = 100;

                // Update HSB values
                var hsb = input.data('hsb');
                hsb.s = s;
                hsb.b = b;

                // Set color
                setColor(input, hsb, true);
            };

            var moveHue = function(input, event) {

                var huePicker = input.data('huePicker');

                huePicker.hide();

                var position = {
                    y: event.pageY
                };

                // Touch support
                if( event.originalEvent.changedTouches ) {
                    position.y = event.originalEvent.changedTouches[0].pageY;
                }

                position.y = position.y - input.data('selector').find('.miniColors-colors').offset().top - 1;
                if( position.y <= -1 ) position.y = -1;
                if( position.y >= 149 ) position.y = 149;
                input.data('huePosition', position);
                huePicker.css('top', position.y).show();

                // Calculate hue
                var h = Math.round((150 - position.y - 1) * 2.4);
                if( h < 0 ) h = 0;
                if( h > 360 ) h = 360;

                // Update HSB values
                var hsb = input.data('hsb');
                hsb.h = h;

                // Set color
                setColor(input, hsb, true);

            };

            var setColor = function(input, hsb, updateInput) {
                input.data('hsb', hsb);
                var hex = hsb2hex(hsb);
                if( updateInput ) input.val( '#' + convertCase(hex, input.data('letterCase')) );
                input.data('trigger').css('backgroundColor', '#' + hex);
                if( input.data('selector') ) input.data('selector').find('.miniColors-colors').css('backgroundColor', '#' + hsb2hex({ h: hsb.h, s: 100, b: 100 }));

                // Fire change callback
                if( input.data('change') ) {
                    if( hex === input.data('lastChange') ) return;
                    input.data('change').call(input.get(0), '#' + hex, hsb2rgb(hsb));
                    input.data('lastChange', hex);
                }

            };

            var setColorFromInput = function(input) {

                input.val('#' + cleanHex(input.val()));
                var hex = expandHex(input.val());
                if( !hex ) return false;

                // Get HSB equivalent
                var hsb = hex2hsb(hex);

                // If color is the same, no change required
                var currentHSB = input.data('hsb');
                if( hsb.h === currentHSB.h && hsb.s === currentHSB.s && hsb.b === currentHSB.b ) return true;

                // Set colorPicker position
                var colorPosition = getColorPositionFromHSB(hsb);
                var colorPicker = $(input.data('colorPicker'));
                colorPicker.css('top', colorPosition.y + 'px').css('left', colorPosition.x + 'px');
                input.data('colorPosition', colorPosition);

                // Set huePosition position
                var huePosition = getHuePositionFromHSB(hsb);
                var huePicker = $(input.data('huePicker'));
                huePicker.css('top', huePosition.y + 'px');
                input.data('huePosition', huePosition);

                setColor(input, hsb);

                return true;

            };

            var convertCase = function(string, letterCase) {
                if( letterCase === 'lowercase' ) return string.toLowerCase();
                if( letterCase === 'uppercase' ) return string.toUpperCase();
                return string;
            };

            var getColorPositionFromHSB = function(hsb) {
                var x = Math.ceil(hsb.s / 0.67);
                if( x < 0 ) x = 0;
                if( x > 150 ) x = 150;
                var y = 150 - Math.ceil(hsb.b / 0.67);
                if( y < 0 ) y = 0;
                if( y > 150 ) y = 150;
                return { x: x - 5, y: y - 5 };
            };

            var getHuePositionFromHSB = function(hsb) {
                var y = 150 - (hsb.h / 2.4);
                if( y < 0 ) h = 0;
                if( y > 150 ) h = 150;
                return { y: y - 1 };
            };

            var cleanHex = function(hex) {
                return hex.replace(/[^A-F0-9]/ig, '');
            };

            var expandHex = function(hex) {
                hex = cleanHex(hex);
                if( !hex ) return null;
                if( hex.length === 3 ) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                return hex.length === 6 ? hex : null;
            };

            var hsb2rgb = function(hsb) {
                var rgb = {};
                var h = Math.round(hsb.h);
                var s = Math.round(hsb.s*255/100);
                var v = Math.round(hsb.b*255/100);
                if(s === 0) {
                    rgb.r = rgb.g = rgb.b = v;
                } else {
                    var t1 = v;
                    var t2 = (255 - s) * v / 255;
                    var t3 = (t1 - t2) * (h % 60) / 60;
                    if( h === 360 ) h = 0;
                    if( h < 60 ) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
                    else if( h < 120 ) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
                    else if( h < 180 ) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
                    else if( h < 240 ) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
                    else if( h < 300 ) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
                    else if( h < 360 ) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
                    else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
                }
                return {
                    r: Math.round(rgb.r),
                    g: Math.round(rgb.g),
                    b: Math.round(rgb.b)
                };
            };

            var rgb2hex = function(rgb) {
                var hex = [
                    rgb.r.toString(16),
                    rgb.g.toString(16),
                    rgb.b.toString(16)
                ];
                $.each(hex, function(nr, val) {
                    if (val.length === 1) hex[nr] = '0' + val;
                });
                return hex.join('');
            };

            var hex2rgb = function(hex) {
                hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);

                return {
                    r: hex >> 16,
                    g: (hex & 0x00FF00) >> 8,
                    b: (hex & 0x0000FF)
                };
            };

            var rgb2hsb = function(rgb) {
                var hsb = { h: 0, s: 0, b: 0 };
                var min = Math.min(rgb.r, rgb.g, rgb.b);
                var max = Math.max(rgb.r, rgb.g, rgb.b);
                var delta = max - min;
                hsb.b = max;
                hsb.s = max !== 0 ? 255 * delta / max : 0;
                if( hsb.s !== 0 ) {
                    if( rgb.r === max ) {
                        hsb.h = (rgb.g - rgb.b) / delta;
                    } else if( rgb.g === max ) {
                        hsb.h = 2 + (rgb.b - rgb.r) / delta;
                    } else {
                        hsb.h = 4 + (rgb.r - rgb.g) / delta;
                    }
                } else {
                    hsb.h = -1;
                }
                hsb.h *= 60;
                if( hsb.h < 0 ) {
                    hsb.h += 360;
                }
                hsb.s *= 100/255;
                hsb.b *= 100/255;
                return hsb;
            };

            var hex2hsb = function(hex) {
                var hsb = rgb2hsb(hex2rgb(hex));
                // Zero out hue marker for black, white, and grays (saturation === 0)
                if( hsb.s === 0 ) hsb.h = 360;
                return hsb;
            };

            var hsb2hex = function(hsb) {
                return rgb2hex(hsb2rgb(hsb));
            };


            // Handle calls to $([selector]).miniColors()
            switch(o) {

                case 'readonly':

                    $(this).each( function() {
                        if( !$(this).hasClass('miniColors') ) return;
                        $(this).prop('readonly', data);
                    });

                    return $(this);

                case 'disabled':

                    $(this).each( function() {
                        if( !$(this).hasClass('miniColors') ) return;
                        if( data ) {
                            disable($(this));
                        } else {
                            enable($(this));
                        }
                    });

                    return $(this);

                case 'value':

                    // Getter
                    if( data === undefined ) {
                        if( !$(this).hasClass('miniColors') ) return;
                        var input = $(this),
                            hex = expandHex(input.val());
                        return hex ? '#' + convertCase(hex, input.data('letterCase')) : null;
                    }

                    // Setter
                    $(this).each( function() {
                        if( !$(this).hasClass('miniColors') ) return;
                        $(this).val(data);
                        setColorFromInput($(this));
                    });

                    return $(this);

                case 'destroy':

                    $(this).each( function() {
                        if( !$(this).hasClass('miniColors') ) return;
                        destroy($(this));
                    });

                    return $(this);

                default:

                    if( !o ) o = {};

                    $(this).each( function() {

                        // Must be called on an input element
                        if( $(this)[0].tagName.toLowerCase() !== 'input' ) return;

                        // If a trigger is present, the control was already created
                        if( $(this).data('trigger') ) return;

                        // Create the control
                        create($(this), o, data);

                    });

                    return $(this);

            }

        }

    });

})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */

(function($) {

    var types = ['DOMMouseScroll', 'mousewheel'];

    if ($.event.fixHooks) {
        for ( var i=types.length; i; ) {
            $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i=types.length; i; ) {
                    this.addEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i=types.length; i; ) {
                    this.removeEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
        if ( orgEvent.detail ) { delta = -orgEvent.detail/3; }

        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;

        // Gecko
        if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaY = 0;
            deltaX = -1*delta;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

})(jQuery);

/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This websanova color picker jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @docs            http://www.websanova.com/plugins/websanova/color-picker
 * @version         Version 1.2
 *
 ******************************************/
(function($)
{	
	$.fn.wColorPicker = function(settings)
	{
		settings = $.extend({}, $.fn.wColorPicker.defaultSettings, settings || {});
		
		return this.each(function()
		{
			var elem = $(this);	
			var $settings = jQuery.extend(true, {}, settings);
			
			var cp = new ColorPicker($settings);

			cp.generate();

			cp.appendToElement(elem);			
		
			cp.colorSelect(cp, $settings.initColor);
		});
	};

	$.fn.wColorPicker.defaultSettings = {
		color			: 'black', 		// colors - black, white, cream, red, green, blue, yellow, orange, plum
		opacity			: 0.8,			// opacity level
		initColor		: '#FF0000',	// initial colour to set palette to
		onMouseover		: null,			// function to run when palette color is moused over
		onMouseout		: null,			// function to run when palette color is moused out
		onSelect		: null,			// function to run when palette color is selected
		mode			: 'flat',		// flat mode inserts the palette to container, other modes insert button into container - hover, click
		buttonSize		: 20,			// size of button if mode is ohter than flat
		effect			: 'slide',		// none/slide/fade
		showSpeed		: 500,			// time to run the effects on show
		hideSpeed		: 500			// time to run the effects on hide
	};

	/**
	 * ColorPicker class definition
	 */
	function ColorPicker(settings)
	{ 
		this.colorPicker = null;
		this.settings = settings;
		this.currentColor = settings.initColor;
		
		this.height = null;					// init this, need to get height/width proper while element is still showing
		this.width = null;
		this.slideTopToBottom = null;		// used to assist with sliding in proper direction
		
		this.customTarget = null;			
		this.buttonColor = null;
		this.paletteHolder = null;
		
		return this;
	}
	
	ColorPicker.prototype =
	{
		generate: function ()
		{
			if(this.colorPicker) return this.colorPicker;

			var $this = this;

			var clearFloats = {clear: 'both', height: 0, lineHeight: 0, fontSize: 0}; 

			//custom colors
			this.customTarget = $('<div class="_wColorPicker_customTarget"></div>');
			this.customInput =
			$('<input type="text" class="_wColorPicker_customInput" value=""/>').keyup(function(e)
			{
				var code = (e.keyCode ? e.keyCode : e.which);
				
				var hex = $this.validHex($(this).val());
				
				$(this).val(hex)
				
				//auto set color in target if it's valid hex code
				if(hex.length == 7) $this.customTarget.css('backgroundColor', hex);
				
				if(code == 13)//set color if user hits enter while on input
				{
					$this.colorSelect($this, $(this).val());
					if($this.buttonColor) $this.hidePalette($this)
				}
			})
			.click(function(e){e.stopPropagation();});
			
			//setup custom area
			var custom = 
			$('<div class="_wColorPicker_custom"></div>')
			.append(this.appendColors($('<div class="_wColorPicker_noColor">'), ['transparent'], 1))
			.append(this.customTarget)
			.append(this.customInput)
			//clear floats
			.append($('<div></div>').css(clearFloats))

			//grays/simple palette
			var simpleColors = ['000000', '333333', '666666', '999999', 'CCCCCC', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF'];
			var simplePalette = this.appendColors($('<div class="_wColorPicker_palette_simple"></div>'), simpleColors, 1);
			
			//colors palette
			var mixedColors = [
				'000000', '003300', '006600', '009900', '00CC00', '00FF00', '330000', '333300', '336600', '339900', '33CC00', '33FF00', '660000', '663300', '666600', '669900', '66CC00', '66FF00',
				'000033', '003333', '006633', '009933', '00CC33', '00FF33', '330033', '333333', '336633', '339933', '33CC33', '33FF33', '660033', '663333', '666633', '669933', '66CC33', '66FF33',
				'000066', '003366', '006666', '009966', '00CC66', '00FF66', '330066', '333366', '336666', '339966', '33CC66', '33FF66', '660066', '663366', '666666', '669966', '66CC66', '66FF66',
				'000099', '003399', '006699', '009999', '00CC99', '00FF99', '330099', '333399', '336699', '339999', '33CC99', '33FF99', '660099', '663399', '666699', '669999', '66CC99', '66FF99',
				'0000CC', '0033CC', '0066CC', '0099CC', '00CCCC', '00FFCC', '3300CC', '3333CC', '3366CC', '3399CC', '33CCCC', '33FFCC', '6600CC', '6633CC', '6666CC', '6699CC', '66CCCC', '66FFCC',
				'0000FF', '0033FF', '0066FF', '0099FF', '00CCFF', '00FFFF', '3300FF', '3333FF', '3366FF', '3399FF', '33CCFF', '33FFFF', '6600FF', '6633FF', '6666FF', '6699FF', '66CCFF', '66FFFF',
				'990000', '993300', '996600', '999900', '99CC00', '99FF00', 'CC0000', 'CC3300', 'CC6600', 'CC9900', 'CCCC00', 'CCFF00', 'FF0000', 'FF3300', 'FF6600', 'FF9900', 'FFCC00', 'FFFF00',
				'990033', '993333', '996633', '999933', '99CC33', '99FF33', 'CC0033', 'CC3333', 'CC6633', 'CC9933', 'CCCC33', 'CCFF33', 'FF0033', 'FF3333', 'FF6633', 'FF9933', 'FFCC33', 'FFFF33',
				'990066', '993366', '996666', '999966', '99CC66', '99FF66', 'CC0066', 'CC3366', 'CC6666', 'CC9966', 'CCCC66', 'CCFF66', 'FF0066', 'FF3366', 'FF6666', 'FF9966', 'FFCC66', 'FFFF66',
				'990099', '993399', '996699', '999999', '99CC99', '99FF99', 'CC0099', 'CC3399', 'CC6699', 'CC9999', 'CCCC99', 'CCFF99', 'FF0099', 'FF3399', 'FF6699', 'FF9999', 'FFCC99', 'FFFF99',
				'9900CC', '9933CC', '9966CC', '9999CC', '99CCCC', '99FFCC', 'CC00CC', 'CC33CC', 'CC66CC', 'CC99CC', 'CCCCCC', 'CCFFCC', 'FF00CC', 'FF33CC', 'FF66CC', 'FF99CC', 'FFCCCC', 'FFFFCC',
				'9900FF', '9933FF', '9966FF', '9999FF', '99CCFF', '99FFFF', 'CC00FF', 'CC33FF', 'CC66FF', 'CC99FF', 'CCCCFF', 'CCFFFF', 'FF00FF', 'FF33FF', 'FF66FF', 'FF99FF', 'FFCCFF', 'FFFFFF'
			];
			var mixedPalette = this.appendColors($('<div class="_wColorPicker_palette_mixed"></div>'), mixedColors, 18);
			
			//palette container
			var bg = $('<div class="_wColorPicker_bg"></div>').css({opacity: this.settings.opacity});
			var content =
			$('<div class="_wColorPicker_content"></div>')			
			.append(custom)
			.append(simplePalette)
			.append(mixedPalette)
			.append($('<div></div>').css(clearFloats));
			
			//put it all together
			this.colorPicker =
			$('<div class="_wColorPicker_holder"></div>')
			.click(function(e){e.stopPropagation();})
			.append(
				$('<div class="_wColorPicker_outer"></div>')
				.append(
					$('<div class="_wColorPicker_inner"></div>')
					.append( bg )
					.append( content )
				)
			)
			.addClass('_wColorPicker_' + this.settings.color)
			
			return this.colorPicker;
		},
		
		appendColors: function($palette, colors, lineCount)
		{
			var counter = 1;
			var $this = this;
			
			for(index in colors)
			{
				$palette.append(
					$('<div id="_wColorPicker_color_' + counter + '" class="_wColorPicker_color _wColorPicker_color_' + counter + '"></div>').css('backgroundColor', '#' + colors[index])
					.click(function(){$this.colorSelect($this, $(this).css('backgroundColor'));})
					.mouseout(function(e){$this.colorHoverOff($this, $(this));})
					.mouseover(function(){$this.colorHoverOn($this, $(this));})
				);
				
				if(counter == lineCount)
				{
					$palette.append($('<div></div>').css({clear:'both', height:0, fontSize:0, lineHeight:0, marginTop:-1}))
					counter = 0;
				}
				
				counter++;
			}
			
			return $palette;
		},
		
		colorSelect: function($this, color)
		{
			color = $this.toHex(color);;
			
			$this.customTarget.css('backgroundColor', color);
			$this.currentColor = color;
			$this.customInput.val(color);
			
			if($this.settings.onSelect) $this.settings.onSelect(color);
			
			if($this.buttonColor)
			{
				$this.buttonColor.css('backgroundColor', color);
				$this.hidePalette($this);
			} 
		},
		
		colorHoverOn: function($this, $element)
		{
			$element.parent().children('active').removeClass('active');
			$element.addClass('active').next().addClass('activeLeft');
			$element.nextAll('.' + $element.attr('id') + ':first').addClass('activeTop');
			
			var color = $this.toHex($element.css('backgroundColor'));
			
			$this.customTarget.css('backgroundColor', color);
			$this.customInput.val(color);
			
			if($this.settings.onMouseover) $this.settings.onMouseover(color);
		},
		
		colorHoverOff: function($this, $element)
		{
			$element.removeClass('active').next().removeClass('activeLeft')
			$element.nextAll('.' + $element.attr('id') + ':first').removeClass('activeTop')
			
			$this.customTarget.css('backgroundColor', $this.currentColor);
			$this.customInput.val($this.currentColor);
			
			if($this.settings.onMouseout) $this.settings.onMouseout($this.currentColor);
		},
		
		appendToElement: function($element)
		{
			var $this = this;
			
			if($this.settings.mode == 'flat') $element.append($this.colorPicker);
			else
			{
				//setup button
				$this.paletteHolder = $('<div class="_wColorPicker_paletteHolder"></div>').css({position: 'absolute', overflow: 'hidden', width: 1000}).append($this.colorPicker);
				
				$this.buttonColor = $('<div class="_wColorPicker_buttonColor"></div>').css({width: $this.settings.buttonSize, height: $this.settings.buttonSize});
				
				var buttonHolder =
				$('<div class="_wColorPicker_buttonHolder"></div>')
				.css({position: 'relative'})
				.append($('<div class="_wColorPicker_buttonBorder"></div>').append($this.buttonColor))
				.append($this.paletteHolder);

				$element.append(buttonHolder);
				
				$this.width = $this.colorPicker.outerWidth();
				$this.height = $this.colorPicker.outerHeight();
				$this.paletteHolder.css({width: $this.width, height: $this.height}).hide();
				
				if($this.settings.effect == 'fade') $this.paletteHolder.css({opacity: 0});
				
				//setup events
				if($this.settings.mode == 'hover')
				{
					buttonHolder.hover(
						function(e){$this.showPalette(e, $this);},
						function(e){$this.hidePalette($this);}
					)
				}
				else if($this.settings.mode == 'click')
				{
					$(document).click(function(){if($this.paletteHolder.hasClass('active'))$this.hidePalette($this);});
					
					buttonHolder
					.click(function(e)
					{
						e.stopPropagation();
						$this.paletteHolder.hasClass('active') ? $this.hidePalette($this) : $this.showPalette(e, $this);
					});
				}
				
				$this.colorSelect($this, $this.settings.initColor);
			}
		},
		
		showPalette: function(e, $this)
		{
			var offset = $this.paletteHolder.parent().offset();
			
			//init some vars
			var left = 0;
			var top = $this.paletteHolder.parent().outerHeight();
			$this.slideTopToBottom = top;
			
			if(offset.left - $(window).scrollLeft() + $this.width > $(window).width()) left = -1 * ($this.width - $this.paletteHolder.parent().outerWidth());
			if(offset.top - $(window).scrollTop() + $this.height > $(window).height())
			{
				$this.slideTopToBottom = 0;
				top = -1 * ($this.height);
			}
			
			$this.paletteHolder.css({left: left, top: top});
			
			$this.paletteHolder.addClass('active')
			
			if($this.settings.effect == 'slide')
			{
				$this.paletteHolder.stop(true, false).css({height: 0, top: ($this.slideTopToBottom == 0 ? 0 : top)}).show().animate({height: $this.height, top: top}, $this.settings.showSpeed);
			}
			else if($this.settings.effect == 'fade')
			{
				$this.paletteHolder.stop(true, false).show().animate({opacity: 1}, $this.settings.showSpeed);
			}
			else
			{
				$this.paletteHolder.show();
			}
		},
		
		hidePalette: function($this)
		{
			//need this to avoid the double hide when you click on colour (once on click, once on mouse out) - this way it's only triggered once
			if($this.paletteHolder.hasClass('active'))
			{
				$this.paletteHolder.removeClass('active');
				
				if($this.settings.effect == 'slide')
				{
					$this.paletteHolder.stop(true, false).animate({height: 0, top: ($this.slideTopToBottom == 0 ? 0 : $this.slideTopToBottom)}, $this.settings.hideSpeed, function(){$this.paletteHolder.hide()});
				}
				else if($this.settings.effect == 'fade')
				{
					$this.paletteHolder.stop(true, false).animate({opacity: 0}, $this.settings.hideSpeed, function(){$this.paletteHolder.hide()});
				}
				else
				{
					$this.paletteHolder.hide();
				}
			}
		},
		
		toHex: function(color)
		{
			if(color.substring(0,3) == 'rgb')
			{
				var rgb = color.substring(4, color.length - 1).replace(/\s/g, '').split(',');
				
				for(i in rgb)
				{
					rgb[i] = parseInt(rgb[i]).toString(16);
					if(rgb[i] == '0') rgb[i] = '00';
				}
				
				var hex = '#' + rgb.join('').toUpperCase();
			}
			else
			{
				hex = color;//color.substring(0, 1) == '#' ? color.substring(1, color.length) : color;
			}
			
			return  hex;
		},
		
		validHex: function(hex)
		{			
			return '#' + hex.replace(/[^0-9a-f]/ig, '').substring(0,6).toUpperCase();
		}
	}

})(jQuery);

// Underscore.js 1.3.3
// (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function r(a,c,d){if(a===c)return 0!==a||1/a==1/c;if(null==a||null==c)return a===c;a._chain&&(a=a._wrapped);c._chain&&(c=c._wrapped);if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return!1;switch(e){case "[object String]":return a==""+c;case "[object Number]":return a!=+a?c!=+c:0==a?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
    c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if("object"!=typeof a||"object"!=typeof c)return!1;for(var f=d.length;f--;)if(d[f]==a)return!0;d.push(a);var f=0,g=!0;if("[object Array]"==e){if(f=a.length,g=f==c.length)for(;f--&&(g=f in a==f in c&&r(a[f],c[f],d)););}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return!1;for(var h in a)if(b.has(a,h)&&(f++,!(g=b.has(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(b.has(c,h)&&!f--)break;
    g=!f}}d.pop();return g}var s=this,I=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,J=k.unshift,l=p.toString,K=p.hasOwnProperty,y=k.forEach,z=k.map,A=k.reduce,B=k.reduceRight,C=k.filter,D=k.every,E=k.some,q=k.indexOf,F=k.lastIndexOf,p=Array.isArray,L=Object.keys,t=Function.prototype.bind,b=function(a){return new m(a)};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=b),exports._=b):s._=b;b.VERSION="1.3.3";var j=b.each=b.forEach=function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       c,d){if(a!=null)if(y&&a.forEach===y)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(d,a[e],e,a)===o)break}else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===o)break};b.map=b.collect=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.map===z)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});if(a.length===+a.length)e.length=a.length;return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(A&&
    a.reduce===A){e&&(c=b.bind(c,e));return f?a.reduce(c,d):a.reduce(c)}j(a,function(a,b,i){if(f)d=c.call(e,d,a,b,i);else{d=a;f=true}});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(B&&a.reduceRight===B){e&&(c=b.bind(c,e));return f?a.reduceRight(c,d):a.reduceRight(c)}var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            c,b){var e;G(a,function(a,g,h){if(c.call(b,a,g,h)){e=a;return true}});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(C&&a.filter===C)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(D&&a.every===D)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,
    a,g,h)))return o});return!!e};var G=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(E&&a.some===E)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;if(q&&a.indexOf===q)return a.indexOf(c)!=-1;return b=G(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(b.isFunction(c)?c||a:a[c]).apply(a,d)})};b.pluck=
    function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&
(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var b=[],d;j(a,function(a,f){d=Math.floor(Math.random()*(f+1));b[f]=b[d];b[d]=a});return b};b.sortBy=function(a,c,d){var e=b.isFunction(c)?c:function(a){return a[c]};return b.pluck(b.map(a,function(a,b,c){return{value:a,criteria:e.call(d,a,b,c)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c===void 0?1:d===void 0?-1:c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};
    j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:b.isArray(a)||b.isArguments(a)?i.call(a):a.toArray&&b.isFunction(a.toArray)?a.toArray():b.values(a)};b.size=function(a){return b.isArray(a)?a.length:b.keys(a).length};b.first=b.head=b.take=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,
    0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,
    e=[];a.length<3&&(c=true);b.reduce(d,function(d,g,h){if(c?b.last(d)!==g||!d.length:!b.include(d,g)){d.push(g);e.push(a[h])}return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1),true);return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=
    i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d){d=b.sortedIndex(a,c);return a[d]===c?d:-1}if(q&&a.indexOf===q)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(F&&a.lastIndexOf===F)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){if(arguments.length<=
    1){b=a||0;a=0}for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;){g[f++]=a;a=a+d}return g};var H=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));H.prototype=a.prototype;var b=new H,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=
    i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(null,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i,j=b.debounce(function(){h=
    g=false},c);return function(){d=this;e=arguments;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);j()},c));g?h=true:i=a.apply(d,e);j();g=true;return i}};b.debounce=function(a,b,d){var e;return function(){var f=this,g=arguments;d&&!e&&a.apply(f,g);clearTimeout(e);e=setTimeout(function(){e=null;d||a.apply(f,g)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments,0));
    return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=L||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&
c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};b.pick=function(a){var c={};j(b.flatten(i.call(arguments,1)),function(b){b in a&&(c[b]=a[b])});return c};b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=
    function(a){if(a==null)return true;if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(b.has(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};b.isArguments(arguments)||(b.isArguments=function(a){return!(!a||!b.has(a,"callee"))});b.isFunction=function(a){return l.call(a)=="[object Function]"};
    b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isFinite=function(a){return b.isNumber(a)&&isFinite(a)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)=="[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.has=function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 b){return K.call(a,b)};b.noConflict=function(){s._=I;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.result=function(a,c){if(a==null)return null;var d=a[c];return b.isFunction(d)?d.call(a):d};b.mixin=function(a){j(b.functions(a),function(c){M(c,b[c]=a[c])})};var N=0;b.uniqueId=
        function(a){var b=N++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var u=/.^/,n={"\\":"\\","'":"'",r:"\r",n:"\n",t:"\t",u2028:"\u2028",u2029:"\u2029"},v;for(v in n)n[n[v]]=v;var O=/\\|'|\r|\n|\t|\u2028|\u2029/g,P=/\\(\\|'|r|n|t|u2028|u2029)/g,w=function(a){return a.replace(P,function(a,b){return n[b]})};b.template=function(a,c,d){d=b.defaults(d||{},b.templateSettings);a="__p+='"+a.replace(O,function(a){return"\\"+n[a]}).replace(d.escape||
        u,function(a,b){return"'+\n_.escape("+w(b)+")+\n'"}).replace(d.interpolate||u,function(a,b){return"'+\n("+w(b)+")+\n'"}).replace(d.evaluate||u,function(a,b){return"';\n"+w(b)+"\n;__p+='"})+"';\n";d.variable||(a="with(obj||{}){\n"+a+"}\n");var a="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+a+"return __p;\n",e=new Function(d.variable||"obj","_",a);if(c)return e(c,b);c=function(a){return e.call(this,a,b)};c.source="function("+(d.variable||"obj")+"){\n"+a+"}";return c};
    b.chain=function(a){return b(a).chain()};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var x=function(a,c){return c?b(a).chain():a},M=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);J.call(a,this._wrapped);return x(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];m.prototype[a]=function(){var d=this._wrapped;b.apply(d,arguments);var e=d.length;(a=="shift"||a=="splice")&&e===0&&delete d[0];return x(d,
        this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return x(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=true;return this};m.prototype.value=function(){return this._wrapped}}).call(this);


