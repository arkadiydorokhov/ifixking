/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=71302de5c334d16fa768)
 * Config saved to config.json and https://gist.github.com/71302de5c334d16fa768
 */
if (typeof jQuery === "undefined") { throw new Error("Bootstrap's JavaScript requires jQuery") }

/* ========================================================================
 * Bootstrap: alert.js v3.2.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert   = function (el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.VERSION = '3.2.0'

    Alert.prototype.close = function (e) {
        var $this    = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.hasClass('alert') ? $this : $this.parent()
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one('bsTransitionEnd', removeElement)
                .emulateTransitionEnd(150) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.alert

    $.fn.alert             = Plugin
    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }

    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.2.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
        this.$element  = $(element)
        this.options   = $.extend({}, Button.DEFAULTS, options)
        this.isLoading = false
    }

    Button.VERSION  = '3.2.0'

    Button.DEFAULTS = {
        loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
        var d    = 'disabled'
        var $el  = this.$element
        var val  = $el.is('input') ? 'val' : 'html'
        var data = $el.data()

        state = state + 'Text'

        if (data.resetText == null) $el.data('resetText', $el[val]())

        $el[val](data[state] == null ? this.options[state] : data[state])

        // push to event loop to allow forms to submit
        setTimeout($.proxy(function () {
            if (state == 'loadingText') {
                this.isLoading = true
                $el.addClass(d).attr(d, d)
            } else if (this.isLoading) {
                this.isLoading = false
                $el.removeClass(d).removeAttr(d)
            }
        }, this), 0)
    }

    Button.prototype.toggle = function () {
        var changed = true
        var $parent = this.$element.closest('[data-toggle="buttons"]')

        if ($parent.length) {
            var $input = this.$element.find('input')
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
                else $parent.find('.active').removeClass('active')
            }
            if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
        }

        if (changed) this.$element.toggleClass('active')
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.button')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.button', (data = new Button(this, options)))

            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }

    var old = $.fn.button

    $.fn.button             = Plugin
    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
    }


    // BUTTON DATA-API
    // ===============

    $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        Plugin.call($btn, 'toggle')
        e.preventDefault()
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.2.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type       =
            this.options    =
                this.enabled    =
                    this.timeout    =
                        this.hoverState =
                            this.$element   = null

        this.init('tooltip', element, options)
    }

    Tooltip.VERSION  = '3.2.0'

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled   = true
        this.type      = type
        this.$element  = $(element)
        this.options   = this.getOptions(options)
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options  = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(document.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

            var pos          = this.getPosition()
            var actualWidth  = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var $parent      = this.$element.parent()
                var parentDim    = this.getPosition($parent)

                placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                        placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                            placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                                placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function () {
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one('bsTransitionEnd', complete)
                    .emulateTransitionEnd(150) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip   = this.tip()
        var width  = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop  = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top  = offset.top  + marginTop
        offset.left = offset.left + marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth  = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowPosition       = delta.left ? 'left'        : 'top'
        var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
        this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
    }

    Tooltip.prototype.setContent = function () {
        var $tip  = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function () {
        var that = this
        var $tip = this.tip()
        var e    = $.Event('hide.bs.' + this.type)

        this.$element.removeAttr('aria-describedby')

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            that.$element.trigger('hidden.bs.' + that.type)
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && this.$tip.hasClass('fade') ?
            $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(150) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function ($element) {
        $element   = $element || this.$element
        var el     = $element[0]
        var isBody = el.tagName == 'BODY'
        return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
            width:  isBody ? $(window).width()  : $element.outerWidth(),
            height: isBody ? $(window).height() : $element.outerHeight()
        }, isBody ? { top: 0, left: 0 } : $element.offset())
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
            placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
                placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset  = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o  = this.options

        title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

        return title
    }

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function () {
        return (this.$tip = this.$tip || $(this.options.template))
    }

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.validate = function () {
        if (!this.$element[0].parentNode) {
            this.hide()
            this.$element = null
            this.options  = null
        }
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }

    Tooltip.prototype.destroy = function () {
        clearTimeout(this.timeout)
        this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && option == 'destroy') return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip             = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(jQuery);

var Acuity = Acuity || {};

Acuity.Calendar = function (params) {
    var that = this;
    var _lastTimesRequest = null;

    function getAddons()
    {
        if (typeof params.getAddons == 'function') {
            return params.getAddons();
        } else {
            return [];
        }
    }

    /**
     * Load calendar for given cal/type selection
     */
    this.loadCalendar = function (month) {
        var $calendar = params.$calendar;

        // Show loading...
        $calendar.html(Acuity.Config.loadingHtml).show();
        params.clearTimes();

        var loadCalendarRequestedAt = new Date();

        var owner = $('#owner').val();
        $.post('/schedule.php?action=showCalendar&fulldate=1&owner='+owner, {
            type: params.getType(),
            addons: getAddons(),
            calendar: params.getCalendar(),
            month: month,
            timezone: params.getTimezone(),
            skip: true
        }).done(function (data) {
            $calendar.html(data).find('.calendar').on('click', '.activeday', function (ev) {
                that.loadTimes($(ev.currentTarget).attr('day'))
            });

            if (!$calendar.find('.activeday').length) {
                // no times are available! show them
                $calendar.find('.calendar').append('<div class="no-dates-available">No appointments are available this month</div>');
            }

            if ($calendar.find('.cmd-hide-calendar').length) {
                $calendar.hide();
            }

            var calendarWidth = Math.max(225, $calendar.find('.calendar').width());
            $calendar.find('.calendarHeading').width(calendarWidth);

            // If we passed a month, we're clicking in this area so don't need to focus on it
            if (!month && top.frames.length>1 && Acuity.pageLoadTime && (loadCalendarRequestedAt - Acuity.pageLoadTime)>500 ) {
                $('.calendarHeading select').focus();
            }
        }).fail(function () {
            $calendar.html('Failed to get calendar, <a href="#" class="retry">retry</a>?').on('click', '.retry', function () {
                that.loadCalendar(month);
            });
        });
    }


    /**
     * Load times for a given date, assuming cal and type already selected
     */
    this.loadTimes = function (date) {
        params.$calendar.find('.selectedday').removeClass('selectedday');
        params.$calendar.find('.scheduleday[day="'+date+'"]').addClass('selectedday');

        params.dateSelected(date);

        // If user clicks multiple times, but out of order
        //	don't let a previous request trigger
        if (_lastTimesRequest) {
            _lastTimesRequest.abort();
        }

        var additionalTimes = [];
        var additionalDates = [];
        // Keep additionalTimes empty, the full date+time is now included in one field
        $('#selected-times:visible [name="time[]"]').each(function(){
            additionalDates.push($(this).val());
        });

        var owner = $('#owner').val();
        _lastTimesRequest = $.post('/schedule.php?action=availableTimes&showSelect=0&fulldate=1&owner='+owner, {
            type: params.getType(),
            addons: getAddons(),
            calendar: params.getCalendar(),
            date: date,
            timezone: params.getTimezone(),
            ignoreAppointment: params.ignoreAppointment || '',
            a_time: additionalTimes,
            a_date: additionalDates
        }).done(function (data) {
            params.timesLoaded(data);
        }).fail(function () {
            params.timesLoaded(undefined);
        });
    }

    this.params = params;

    self.showCalendar = this.loadCalendar;
};


(function () {
    if (!window.console || !window.console.log) return;
    var ua = (window.navigator.userAgent || '');
    if (
        ua.indexOf('Chrome') >= 0 || ua.indexOf('Chromium') >= 0 ||
        ua.indexOf('Firefox') >= 0 || ua.indexOf('Safari') >= 0
    ) {
        console.log(
            '\n\n%cAcuity Scheduling, Inc.%c\nWelcome developer!  You can find out more about customizing the client scheduler at %chttps://developers.acuityscheduling.com%c or by contacting developers@acuityscheduling.com\n ',
            'color: #444; font-family: sans-serif; font-size: 32px; line-height: 32px;',
            'color: #555; font-family: sans-serif; font-size: 15px; line-height: 24px;',
            'color: #469E9F; font-family: sans-serif; font-size: 15px; line-height: 24px; text-decoration: underline; font-style: normal;',
            'color: #555; font-family: sans-serif; font-size: 15px; line-height: 24px;'
        );
    }
})();

var Acuity = Acuity || {};

Acuity.Focus = (function () {
    /**
     * Add some styling when focused
     */
    function init($container)
    {
        $container.on('focus', 'input, select, textarea', function (ev) {
            $('.is-focused').removeClass('is-focused');
            $(ev.target).closest('.form-group').addClass('is-focused');
        });

        $container.on('blur', 'input, select, textarea', function (ev) {
            $(ev.target).closest('.form-group').removeClass('is-focused');
        });
    }

    return {
        init: init
    }
})();
// Namespace
var Acuity = Acuity || {};

Acuity.Config = {
    loadingHtml: '<div class="loading-container"><span class="progress-spinner small"></span> Loading...</div>'
}

Acuity.pageLoadTime = false;
$(function () {
    Acuity.pageLoadTime = new Date();
});

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function async(script, cb)
{
    $.ajaxSetup({
        cache: true
    });
    $.getScript(script, cb);
}

AcuityStorage = {
    setItem: function (name, value) {
        try {
            sessionStorage[name] = value;
        } catch (e) {
            return;
        }
    },
    getItem: function (name) {
        try {
            return sessionStorage[name];
        } catch (e) {
            return;
        }
    }
};

function isEmailValid(email) {
    // multiple e-mails can be entered, make sure there's at least the hint of _one_ valid
    var re = /([^@]+)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,20}(?:\.[a-z]{2})?)/i;
    return re.test(email.trim());
}

function normalizeEmail(email)
{
    // Should be similar to CertificateCodeEmail::normalizeEmail
    return $.trim(email).toLowerCase();
}


function isOldIE()
{
    return /MSIE [678]/g.test( navigator.userAgent );
}

/**
 * Shim for some backward compatibility with prototype
 */
if (typeof window.$F != 'function') {
    window.$F = function (id) {
        return $('#'+id).val();
    }
}

if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

// defaults for jquery
$.fx.speeds._default = 150;

/**
 * For different touch styling
 */
if ('ontouchstart' in document) {
    $('body').removeClass('no-touch');
}

/**
 * Select actions
 */
if (isOldIE()) {
    $(document).on('click', 'label', function(ev){
        // fix for IE8 where clicking label doesn't select
        if ($(this).attr("for") != "") {
            $("#" + $(this).attr("for")).prop('checked', true).click().change();
        }
    });
}

/**
 * Handle appointment type and calendar select.
 *
 * Listen to click event instead.  At the end, send a message to select the item.
 * SamsungBrowser had some issues with the change event.
 *
 * https://trello.com/c/HdYdSGXX/2671-timezone-not-showing-on-android-bug
 */
$('.select').on('click', 'input[type="radio"], .select-label, .caret', function (ev) {
    var $current = $(ev.currentTarget);
    //$current.closest('.select:has(input[type="radio"]:checked)').toggleClass('closed');
    // close it...
    // start from last non-selected non-open and hide
    var $select = $current.closest('.select:has(input[type="radio"]:checked)');

    var animateDuration = $.fx.speeds._default / ($select.find('input').length);

    var $thisLabel = $select.find('input[type="radio"]:checked+label');

    var superLongListDuration = 2.5;
    var longListDuration = 10;
    function hideLast() {
        var $last = $select.find('input[type="radio"]+label, .select-label, .select-item-no-input').not($thisLabel).filter(':visible');

        // If super long list, hide it immediately, otherwise do it one at a time for an animation effect
        if (animateDuration > superLongListDuration) {
            $last = $last.last();
        }

        if ($last.length) {
            if (animateDuration < longListDuration) {
                $last.hide();
                setTimeout(hideLast);
            } else {
                $last.slideUp(animateDuration, hideLast);
            }
        } else {
            // double check everything hidden, in case parent was hidden at time of this
            $select.find('input[type="radio"]+label, .select-label, .select-item-no-input').not($thisLabel).hide();
            $select.addClass('closed');
        }
    }

    function showFirst() {
        $select.removeClass('closed');

        var $last = $select.find('input[type="radio"]+label, .select-label, .select-item-no-input').not($thisLabel).filter(':hidden').first();
        if (animateDuration > superLongListDuration) {
            $last = $last.first();
        }

        if ($last.length) {
            if (animateDuration < longListDuration) {
                $last.show();
                setTimeout(showFirst);
            } else {
                $last.slideDown(animateDuration, showFirst);
            }
        }
    }

    if ($select.hasClass('closed')) {
        showFirst();
    } else {
        Select.selectItem($select);
        hideLast();
    }
});

// Init if clicked back button
$('.select input[type="radio"]:checked').prop('checked', false);

// Hide things for babel only if unchanged
$(function () {
    $('.hidden-xs-nobabel').each(function () {
        var $this = $(this);
        var originalText = $this.attr('data-original-text');
        var currentText = $this.text();

        if (!originalText || originalText == currentText) {
            $this.addClass('hidden-xs');
        } else {
            $this.removeClass('hidden-xs');
        }
    });
});

var Select = (function (){
    function reset($select) {
        $select.removeClass('closed');
        $select.find('.select-label').show();
    }

    /**
     * Select the first item in the list
     */
    function selectItem($select) {
        var $current = $select.find('input[type="radio"]:checked');
        $current.closest('.select')
            .attr('data-value', $current.val())
            .trigger('acuity:checked', [$current.val()]);
    }

    function selectFirstItem() {
        $('.select-type input[type="radio"]').prop('checked', true).click();
    }

    return {
        selectFirstItem: selectFirstItem,
        selectItem: selectItem,
        reset: reset
    };
})();


// TODO: get a better implementation
JSON.parse = JSON.parse || function (str) {
        if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    };

Popup = (function(){
    var _lastShownTime;


    function insertHtml(html, $insertBefore)
    {
        // Remove if one exists already
        $('#popup-content.inline-popup').remove();
        $('<div id="popup-content" class="inline-popup" />')
            .html(html)
            .insertBefore($insertBefore);
    }

    function showHtml(html, cb)
    {
        _lastShownTime = new Date();
        $('#popup-content').html(html);
        $('.content').addClass('animating-popup').addClass('showing-popup');
        if ($('.content').is(':visible')) {
            $('#popup').slideDown();
        } else {
            $('#popup').show();
        }

        $('#popup-content a.popup-link').click(function (ev) {
            ev.preventDefault();
            showUrl($(ev.currentTarget).attr('href') + '&popup=1&ajax=1');
        });

        // Go to top
        $('body, html').animate({ scrollTop: '0px' }, 150);
        if (typeof Acuity.Embed != 'undefined') {
            Acuity.Embed.scrollTop();
        }

        if (typeof cb == 'function') {
            setTimeout(function () { cb($('#popup-content')); }, 0);
        }
    }

    function showUrl(url, cb)
    {
        showHtml(Acuity.Config.loadingHtml);
        $.get(url)
            .done(function (data) {
                showHtml(data, cb);
            }).fail(function() {
            showHtml('Error, failed to load. Please try again.');
        });
    }

    function hide(onlyHideBigPopup)
    {
        $('.content').removeClass('showing-popup');
        if (!onlyHideBigPopup) $('#popup-content.inline-popup').remove();
        $('#popup').slideUp(function () {
            $('.content').removeClass('animating-popup');
            $('#popup-content').html('');
        });
    }


    function isVisible()
    {
        // Firefox doesn't set visible immediately for redirect in PayPal, use recent times for that
        return $('.inline-popup').is(':visible') || $('#popup').is(':visible') || (_lastShownTime && (new Date()-_lastShownTime)<500 );
    }


    $('#popup').on('click', '.close-popup', function () {
        hide(true);
    });

    $('a.popup-link').click(function (ev) {
        ev.preventDefault();
        showUrl($(ev.currentTarget).attr('href') + '&popup=1&ajax=1');
    });

    $(document).keyup(function(e) {
        // Escape pressed
        if (e.keyCode == 27) {
            hide(true);
        }
    });

    return {
        insertHtml: insertHtml,
        showHtml: showHtml,
        showUrl: showUrl,
        hide: hide,
        isVisible: isVisible
    }
})();
/**
 * Handle the logic of going between different steps
 */
Steps = (function () {
    function goToStep(nextStep) {
        // clear everything...
        $('.step-container').hide();
        $('.steps .active').removeClass('active');

        var initFunc = null
        if (nextStep == 'forms') {
            // defer init until after all actions complete here
            initFunc = Acuity.Forms.init;
        } else if (nextStep == 'pick-appointment') {
            initFunc = Acuity.PickAppointment.init;
        } else if (nextStep == 'confirmation') {
            initFunc = Acuity.Confirmation.init;
        }

        if (initFunc) setTimeout(initFunc, 0);

        $('[data-step="'+nextStep+'"]').show();
        $('.steps .step-'+nextStep).addClass('active');

        // trigger step changed
        $(window).trigger('acuity:stepChanged', [nextStep]);
    }

    function next() {
        $('.error-flash').hide();
        var currentStepName = getCurrentStepName();
        var nextStep = currentStepName;

        if (currentStepName == 'pick-appointment') {
            // go to forms
            nextStep = 'forms';
        }

        if (currentStepName == 'forms') {
            nextStep = 'confirmation';
        }

        goToStep(nextStep);
    }

    function getCurrentStepName() {
        var $currentStep = $('.step-container:visible');
        return $currentStep.attr('data-step');
    }

    $('.steps .step-pick-appointment a, .change-pick-appointment').click(function (ev) {
        // go to it...
        var currentStep = getCurrentStepName();
        goToStep('pick-appointment');
        if (currentStep != 'confirmation') {
            ev.preventDefault();
        }
    });
    $('body').on('click', '.change-pick-appointment', function (ev) {
        // go to it...
        goToStep('pick-appointment');
    });


    $('body').on('click', '.btn-next-step', function (ev) {
        ev.preventDefault();
        $(document).scrollTop(0);
        next();
    });

    function error(msg) {
        goToStep('pick-appointment');
        $('.error-flash').html(msg).show();
    }

    return {
        next: next,
        error: error
    };
})();
Acuity.Subscription = (function () {
    function initPaymentForm($container)
    {
        Acuity.CreditCard.initPaymentContainer($container);
    }

    $('.btn-set-subscription-billing').click(function (ev) {
        ev.preventDefault();
        Popup.showHtml($('#change-payment-template').html(), initPaymentForm);
    });
})();
Timezone = (function(){
    function getTimezoneName() {
        tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
        so = -1 * tmSummer.getTimezoneOffset();
        tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
        wo = -1 * tmWinter.getTimezoneOffset();

        if (-660 == so && -660 == wo) return 'Pacific/Midway';
        if (-600 == so && -600 == wo) return 'Pacific/Honolulu';
        if (-570 == so && -570 == wo) return 'Pacific/Marquesas';
        if (-540 == so && -600 == wo) return 'America/Adak';
        if (-540 == so && -540 == wo) return 'Pacific/Gambier';
        if (-480 == so && -540 == wo) return 'America/Anchorage';
        if (-480 == so && -480 == wo) return 'Pacific/Pitcairn';
        if (-420 == so && -480 == wo) return 'America/Los_Angeles';
        if (-420 == so && -420 == wo) return 'America/Phoenix';
        if (-360 == so && -420 == wo) return 'America/Denver';
        if (-360 == so && -360 == wo) return 'America/Guatemala';
        if (-360 == so && -300 == wo) return 'Pacific/Easter';
        if (-300 == so && -360 == wo) return 'America/Chicago';
        if (-300 == so && -300 == wo) return 'America/Bogota';
        if (-240 == so && -300 == wo) return 'America/New_York';
        if (-240 == so && -240 == wo) return 'America/Caracas';
        if (-240 == so && -180 == wo) return 'America/Santiago';
        if (-180 == so && -240 == wo) return 'Canada/Atlantic';
        if (-180 == so && -180 == wo) return 'America/Montevideo';
        if (-180 == so && -120 == wo) return 'America/Sao_Paulo';
        if (-150 == so && -210 == wo) return 'America/St_Johns';
        if (-120 == so && -180 == wo) return 'America/Godthab';
        if (-120 == so && -120 == wo) return 'America/Noronha';
        if (-60 == so && -60 == wo) return 'Atlantic/Cape_Verde';
        if (0 == so && -60 == wo) return 'Atlantic/Azores';
        if (0 == so && 0 == wo) return 'Africa/Casablanca';
        if (60 == so && 0 == wo) return 'Europe/London';
        if (60 == so && 60 == wo) return 'Africa/Algiers';
        if (60 == so && 120 == wo) return 'Africa/Windhoek';
        if (120 == so && 60 == wo) return 'Europe/Amsterdam';
        if (120 == so && 120 == wo) return 'Africa/Harare';
        if (180 == so && 120 == wo) return 'Europe/Athens';
        if (180 == so && 180 == wo) return 'Africa/Nairobi';
        if (240 == so && 180 == wo) return 'Europe/Moscow';
        if (240 == so && 240 == wo) return 'Asia/Dubai';
        if (270 == so && 210 == wo) return 'Asia/Tehran';
        if (270 == so && 270 == wo) return 'Asia/Kabul';
        if (300 == so && 240 == wo) return 'Asia/Baku';
        if (300 == so && 300 == wo) return 'Asia/Karachi';
        if (330 == so && 330 == wo) return 'Asia/Calcutta';
        if (345 == so && 345 == wo) return 'Asia/Katmandu';
        if (360 == so && 300 == wo) return 'Asia/Yekaterinburg';
        if (360 == so && 360 == wo) return 'Asia/Colombo';
        if (390 == so && 390 == wo) return 'Asia/Rangoon';
        if (420 == so && 360 == wo) return 'Asia/Almaty';
        if (420 == so && 420 == wo) return 'Asia/Bangkok';
        if (480 == so && 420 == wo) return 'Asia/Krasnoyarsk';
        if (480 == so && 480 == wo) {
            // China and Perth are identical time zone, default to biz
            if (ownerTz == 'Asia/Shanghai') return 'Asia/Shanghai';
            else return 'Australia/Perth';
        }
        if (540 == so && 480 == wo) return 'Asia/Irkutsk';
        if (540 == so && 540 == wo) return 'Asia/Tokyo';
        if (570 == so && 570 == wo) return 'Australia/Darwin';
        if (570 == so && 630 == wo) return 'Australia/Adelaide';
        if (600 == so && 540 == wo) return 'Asia/Yakutsk';
        if (600 == so && 600 == wo) return 'Australia/Brisbane';
        if (600 == so && 660 == wo) return 'Australia/Sydney';
        if (630 == so && 660 == wo) return 'Australia/Lord_Howe';
        if (660 == so && 600 == wo) return 'Asia/Vladivostok';
        if (660 == so && 660 == wo) return 'Pacific/Guadalcanal';
        if (690 == so && 690 == wo) return 'Pacific/Norfolk';
        if (720 == so && 660 == wo) return 'Asia/Magadan';
        if (720 == so && 720 == wo) return 'Pacific/Fiji';
        if (720 == so && 780 == wo) return 'Pacific/Auckland';
        if (765 == so && 825 == wo) return 'Pacific/Chatham';
        if (780 == so && 780 == wo) return 'Pacific/Enderbury'
        if (840 == so && 840 == wo) return 'Pacific/Kiritimati';
        return '';
    }

    function shouldDetectTimezone()
    {
        return typeof requireTZ!='undefined' && requireTZ && autodetect_timezone;
    }

    return {
        getTimezoneName: getTimezoneName,
        shouldDetectTimezone: shouldDetectTimezone
    }
})();
var locales = {
    en: {
        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        dateEndings: 'th_st_nd_rd_th_th_th_th_th_th_th_th_th_th_th_th_th_th_th_th_th_st_nd_rd_th_th_th_th_th_th_th_st'.split('_'),
        ampm: true
    }
};

function getCurrentLocale() {
    if (typeof LOCALE == 'undefined') return 'en';
    if (LOCALE_SETTINGS && typeof locales[LOCALE]=='undefined') {
        locales[LOCALE] = LOCALE_SETTINGS;
    }
    return (!! locales[LOCALE] ? LOCALE : 'en');
}

function getLocaleDateFormat() {
    if (typeof locales[getCurrentLocale()]['dateFormat'] != 'undefined') {
        return locales[getCurrentLocale()]['dateFormat'];
    } else {
        return '%m %d, %y';
    }
}

var FriendlyDates = (function () {
    var currentLocale = getCurrentLocale();

    return {
        dateEnding: (locales[currentLocale].dateEndings || ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']),
        months: locales[currentLocale].months,
        weekday: locales[currentLocale].weekdays
    }
})();


function formatTimeForHuman(d)
{
    if (!d) return '';

    if (typeof d == 'string') {
        if (d.toLowerCase().indexOf('am')>-1 || d.toLowerCase().indexOf('pm')>-1) {
            return d;
        }
        var parts = d.split(/:/);
        if (parts.length != 2) {
            return d;
        }

        d = new Date();
        d.setUTCHours(parts[0]);
        d.setUTCMinutes(parts[1]);
    }
    var ampm = '';

    var min = ''+d.getUTCMinutes();
    if (min.length == 1) {
        min = '0' + min;
    }
    var hour = d.getUTCHours();

    if (locales[getCurrentLocale()].ampm) {
        if (hour > 12) {
            hour -= 12;
        }

        ampm = d.getUTCHours()<12 ? 'am' : 'pm';
    }


    return hour+':'+min+ampm;
}


function newUTCDate(year, month, day)
{
    return new Date(year, month, day, (-(new Date(year, month, day).getTimezoneOffset())/60)+1, 0, 0, 0);
}

function dateObjectFromString(d) {
    if (!d) return d;

    var parts = d.split(/-/);
    if (parts.length != 3) {
        return null;
    }
    var d = newUTCDate(parts[0], parts[1]-1, parts[2]);
    return d;
}
function formatDateForHuman(d)
{
    if (typeof d == 'string') {
        var dt = dateObjectFromString(d);
    } else {
        var dt = d;
    }

    if (!dt) {
        return d;
    }

    var month = FriendlyDates.months[dt.getUTCMonth()];
    var date = dt.getUTCDate();
    var year = dt.getUTCFullYear();

    return getLocaleDateFormat().replace('%y', year).replace('%d', date).replace('%m', month)
        .replace('%Y', year).replace('%e', date).replace('%B', month);
}


function formatForTimeElement(d)
{
    if (!d) return '';

    var ampm = d.getUTCHours()<12 ? 'am' : 'pm';
    var min = ''+d.getUTCMinutes();
    if (min.length == 1) {
        min = '0' + min;
    }
    var hour = ''+d.getUTCHours();
    if (hour.length == 1) {
        hour = '0' + hour;
    }

    return hour+':'+min;
}
var Acuity = Acuity || {};

Acuity.FormUtilities = Acuity.FormUtilities || {};
/**
 * Make sure all required fields filled in
 */
Acuity.FormUtilities.validate = function ($container)
{
    var isValid = true;

    $container.find('.required-field:visible').each(function () {
        // Find the inputs in this form-group
        //	even all of the different types
        var allCompleted = true;
        $(this).find('select, textarea, input[type="email"], input[type="text"], input[type="hidden"]').each(function () {
            if (!$(this).val()) allCompleted = false;
        });

        // If there are radios/checkboxes, but they're not checked, that's a problemo
        if ($(this).find('input[type="checkbox"], input[type="radio"]').length > 0
            && $(this).find('input[type="checkbox"]:checked, input[type="radio"]:checked').length ==0)
        {
            allCompleted = false;
        }

        // manually marked as error?
        if (allCompleted && !$(this).attr('data-is-manual-error')) {
            // all good
            $(this).removeClass('has-error');
        } else {
            // not all good
            $(this).addClass('has-error');
            isValid = false;
        }
    });

    return isValid;
};
(function (){
    // Just for the loading button
    $('.checkout-container').submit(function (ev) {
        $('.checkout-container .btn-primary[data-loading-text]').button('loading');
    });

    if (!$('#ccnumber').val()) {
        $('#ccnumber').focus();
    }

    var requestCardNonce = function () {};
    var nonceReceivedCallback = function (nonce) {};

    var initSquarePayments = function (applicationId) {
        if (typeof paymentForm != 'undefined') paymentForm.destroy();

        paymentForm = new SqPaymentForm({
            applicationId: applicationId,
            inputClass: 'sq-input',
            inputStyles: [
                {
                    fontSize: '15px'
                }
            ],
            cardNumber: {
                elementId: 'ccnumber',
                placeholder: 'â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢'
            },
            cvv: {
                elementId: 'cvv2',
                placeholder: 'CVV'
            },
            expirationDate: {
                elementId: 'sq-expiration-date',
                placeholder: 'MM/YY'
            },
            postalCode: {
                elementId: 'billing-zip'
            },
            callbacks: {
                cardNonceResponseReceived: function(errors, nonce, cardData) {
                    if (errors) {
                        // handle errors
                        var errorMessage = '';
                        errors.forEach(function(error) { errorMessage += error.message + '<br />\n'; });

                        $('#general-credit-card-error').html(errorMessage).show();
                        $('.btn-primary').button('reset');
                        $('[name="ccnumber"]').val('');
                    } else {
                        // handle nonce
                        $('#general-credit-card-error').hide();
                        $('.credit-card-form .has-error').removeClass('has-error');
                        $('[name="ccnumber"]').val(nonce);
                        $('[name="zip"]').val(cardData['billing_postal_code']);
                        nonceReceivedCallback(nonce);

                    }
                },
                unsupportedBrowserDetected: function() {
                    $('#general-credit-card-error').html('Cannot enter credit cards through Square, your browser is not supported.').show();
                },
                inputEventReceived: function(inputEvent) {
                    // Something changed? Reset nonce
                    $('[name="ccnumber"]').val('');
                    $('#new-credit-card-container .has-error').removeClass('has-error');

                    switch (inputEvent.eventType) {
                        case 'focusClassAdded':
                            // Handle as desired
                            break;
                        case 'focusClassRemoved':
                            // Handle as desired
                            break;
                        case 'errorClassAdded':
                            // Handle as desired
                            break;
                        case 'errorClassRemoved':
                            // Handle as desired
                            break;
                        case 'cardBrandChanged':
                            // Handle as desired
                            break;
                        case 'postalCodeChanged':
                            // Handle as desired
                            break;
                    }
                }
            }
        });

        paymentForm.build();

        requestCardNonce = function () {
            paymentForm.requestCardNonce();
        }


        // Create the field to accept the nonce...
        if ($('[name="ccnumber"]').length == 0) {
            $('#ccnumber').after('<input type="hidden" name="ccnumber" value="" />');
        }
        if ($('[name="zip"]').length == 0) {
            $('#billing-zip').after('<input type="hidden" name="zip" value="" />');
        }
        if ($('[name="cvv2"]').length == 0) {
            $('#cvv2').after('<input type="hidden" name="cvv2" value="n/a" />');
        }

        $('form.checkout-container').submit(function (ev) {
            // Get nonce if we don't have it, submit when we do
            if (!$('[name="ccnumber"]').val()) {
                ev.preventDefault();
                nonceReceivedCallback = function () {$('form.checkout-container').submit();};
                requestCardNonce();
            }
        });

        $('.square-loading-indicator').hide();
        $('.credit-card-form').show();
    };

    function initSquare() {
        if (typeof squareApplicationId!='undefined') {
            async('https://js.squareup.com/v2/paymentform', function () {
                initSquarePayments(squareApplicationId);
            });
        }
    }

    function isUsingSquare()
    {
        return $('.sq-input').length > 0;
    }

    // This will only init on payment page
    initSquare();
})();

Acuity.Certificate = (function () {
    function showCertificateInput($btn)
    {
        var $group = $btn.closest('div');

        $btn.hide();
        $group.find('.certificate-input').show();
        var $input = $group.find('.certificate-input input').focus();

        if (!getCertificate() && $('.redeem-email-message').is(':visible')) {
            // Default to redeeming email
            $input.val($('#email').val()).change();
        }

        // Load up past codes if logged in...
        if (typeof currentClient != 'undefined') {
            $pastCodes = $group.find('.past-codes').html(Acuity.Config.loadingHtml);
            var params = {
                action: 'getCodes',
                owner: $('#owner').val(),
                email: currentClient.email,
                type: Acuity.PickAppointment.getType()
            };

            if (SID) {
                var sidParts = SID.split('=');
                params[sidParts[0]] = sidParts[1];
            }

            $.get('/schedule.php', params).done(function (data) {
                try {
                    var codes = JSON.parse(data);
                    var html = '';

                    // Show the codes to the user
                    for (var i=0; i<codes.length; i++) {
                        // Only 1? No need to show it,  it's in the box
                        html += '<div class="code-hint-container">';
                        if (codes.length > 1) html += '<em>' + codes[i].code + '</em> ';
                        html += codes[i].name + '<br />';
                        if (codes[i].expires && codes.length > 1) {
                            html += '<div class="small"><span class="code-expires">Expires:</span> ' + formatDateForHuman(codes[i].expires) + '</div>';
                        }
                        html += '</div>';
                    }
                    $pastCodes.html(html);

                    if (!$input.val() && codes.length) {
                        $input.val(codes[codes.length-1].code).change();
                    }
                } catch (e) {
                    $pastCodes.html('');
                }
            }).fail(function () {
                $pastCodes.html('');
            });
        }
    }

    function getCertificate()
    {
        return $('#certificate').val();
    }

    function setCertificate(val)
    {
        showCertificateInput($('.forms-action-container .show-certificate-input'));
        $('.certificate-field').val(val);
        checkCertificateCode($('.forms-action-container .certificate-input'));
    }

    $('#appointment-form').on('click', '.show-certificate-input', function (ev) {
        ev.preventDefault();
        showCertificateInput($(ev.currentTarget));
    });


    $('#appointment-form').on('keyup change', '.certificate-input', function (ev) {
        var $group = $(ev.currentTarget);
        $group.find('.certificate-apply-btn').show();

        // Make sure all other inputs always have the same values
        var $changedField = $group.find('.certificate-field');
        $('.certificate-field').not($changedField).each(function () {
            if ($(this).val() != $changedField.val()) {
                $(this).val($changedField.val());
                // Also make sure the closest button is gone and this is showing
                showCertificateInput($(this).closest('.pane').find('.show-certificate-input'));
            }
        });
    });

    $('.pick-appointment-pane .certificate-field').on('change', function (ev) {
        // Just on the first certificate input, if it is an email make sure that the email address matches and can't be edited
        var val = $(this).val();
        if (isEmailValid(val)) {
            $('#email').val(val);
        }
    });


    function revertToOriginalPrices()
    {
        $('.has-discounted-price')
            .removeClass('has-discounted-price')
            .find('.discounted-price')
            .remove();
    }


    function setDiscountedPrices(typePrices)
    {
        // Show the discounted prices
        for (var id in typePrices) {
            var $priceContainer = $('label[for="appointmentType-'+id+'"]').find('.price');
            var $discountedPrice = $priceContainer.addClass('has-discounted-price').find('.discounted-price');
            if ($discountedPrice.length == 0) {
                var $discountedPrice = $('<span class="discounted-price" />').appendTo($priceContainer);
            }
            $discountedPrice.html(typePrices[id]);
        }

        $(document).trigger('acuity:changeSummary');
    }


    var lastCheckValue = '';
    var lastCheckType = '';
    function checkCertificateCode ($group) {
        if (typeof $group == 'undefined' || typeof $group.find != 'function') {
            $group = $('.certificate-input').first();
        }

        var $certificateInput = $group.find('.certificate-field');

        if ($group.length == 0 || $certificateInput.length == 0) {
            return;
        }

        if (typeof Acuity.PickAppointment == 'undefined' || typeof Acuity.PickAppointment.getType != 'function') {
            return;
        }

        var code = $certificateInput.val().trim();
        if (lastCheckValue == code && lastCheckType == Acuity.PickAppointment.getType() ) {
            return;
        }

        var $help = $group.find('.help-block-generic');
        $group.find('.form-control-feedback').hide();
        $group.removeClass('has-success').removeClass('has-error');
        $help.hide();

        if (!code) {
            // blur with no val? hide it
            $('.show-certificate-input').show();
            $('.certificate-input').hide();
            return;
        }

        revertToOriginalPrices();

        lastCheckValue = code;
        lastCheckType = Acuity.PickAppointment.getType();

        // validate!
        $.get('/schedule.php', {
            action: 'checkCode',
            owner: $('#owner').val(),
            type: Acuity.PickAppointment.getType(),
            code: code
        }).done(function (data) {
            try {
                var result = JSON.parse(data);
                if (result.error) {
                    $group.addClass('has-error').addClass('has-feedback');
                    $group.find('.feedback-error').show();
                    $help.text(result.message).show();
                } else {
                    $group.addClass('has-success').addClass('has-feedback');
                    $group.find('.feedback-success').show();
                    $group.find('.certificate-apply-btn').hide();
                    $help.html('<div class="certificate-amount-remaining">'+result.remaining+'</div>').show();
                    setDiscountedPrices(result['types']);
                }
            } catch (ex) {
                lastCheckValue = '';
            }
        }).fail(function () {
            lastCheckValue = '';
        });
    }

    $('#appointment-form').on('click', '.certificate-apply-btn', function (ev) {
        ev.preventDefault();
        checkCertificateCode($(ev.currentTarget).closest('.certificate-input'));
    });
    $('#appointment-form').on('blur', '.certificate-field', function (ev) {
        checkCertificateCode($(ev.currentTarget).closest('.certificate-input'));
    });
    $(document).on('acuity:forms-loaded', function () {
        checkCertificateCode($('.forms-action-container .certificate-input'));
    });


    return {
        checkCertificateCode: checkCertificateCode,
        setCertificate: setCertificate,
        getCertificate: getCertificate
    };
})();
Acuity.Confirmation = (function() {
    /**
     * Show popup to confirm cancellation
     */
    function confirmCancel(href)
    {
        var html = '<p>Are you sure you want to cancel this appointment?</p><a href="'+href+'" class="btn btn-primary">Yes, cancel appointment</a> <a href="#" class="margin-left btn btn-link close-popup">No, don\'t cancel</a>';
        Popup.showHtml(html);
    }


    /**
     * Validate registration
     */
    function initClientRegister($container)
    {
        var $form = $container.find('form');
        $error = $form.find('.error-msg');
        $form.submit(function (ev) {
            $error.html('').hide();

            var error = '';
            if (!$('#username').val().trim()) {
                error += 'Please enter a username<br />';
            }

            if (!$('#password').val().trim()) {
                error += 'Please enter a password<br />';
            }

            if ($('#password').val() != $('#password_confirm').val()) {
                error += 'Passwords do not match<br />';
            }

            if (error) {
                ev.preventDefault();
                $error.html(error).show();
            }
        });
    }


    /**
     * Validate payments
     */
    function initPayment($container)
    {
        Acuity.CreditCard.initPaymentContainer($container);
    }


    /**
     * Handle fancy rescheduling
     */
    function initReschedule($container)
    {
        function showTimesHtml(html) {
            $container.find('.reschedule-choose-time-container').show();
            $container.find('.reschedule-choose-time').html(html);
        }

        function clearTimes() {
            $container.find('.reschedule-choose-time-container, .reschedule-choose-time-actions').hide();
            $container.find('.reschedule-choose-time').html('');
        }

        function timesLoaded(data) {
            if (typeof data == 'undefined') {
                showTimesHtml('Unable to load times, please try again');
            } else {
                showTimesHtml(data);
            }
        }

        function dateSelected(date) {
            $container.find('#reschedule-date').val(date);
            showTimesHtml(Acuity.Config.loadingHtml);
        }

        /**
         * Show reschedule button on time select.
         *
         * Listen to click event instead.  At the end, send a message to select the item.
         * SamsungBrowser had some issues with the change event.
         *
         * https://trello.com/c/HdYdSGXX/2671-timezone-not-showing-on-android-bug
         */
        $('.reschedule-choose-time').on('click', 'input, label', function (ev) {
            // allow reschedule
            $container.find('.reschedule-choose-time-actions').show();
        });

        $container.find('.reschedule-form').submit(function (ev){
            $container.find('.reschedule-btn').button('loading');
        });

        var acuityCalendar = new Acuity.Calendar({
            $calendar: $container.find('.choose-date'),
            clearTimes: clearTimes,
            getType: function () { return currentAppointment.type; },
            getCalendar: function () { return currentAppointment.calendar; },
            timesLoaded: timesLoaded,
            dateSelected: dateSelected,
            getTimezone: function () { return currentAppointment.timezone; },
            ignoreAppointment: currentAppointment.id
        });

        acuityCalendar.loadCalendar(currentAppointment.time);
    }


    /**
     * Edit forms on appointment
     */
    function initEditForms($container)
    {
        // TODO: validate required fields completed before enabling submit
        Acuity.Focus.init($container);

        $container.find('form').on('submit', function (ev) {
            if (!Acuity.FormUtilities.validate($container)) {
                ev.preventDefault();

                $firstError = $container.find('.has-error:first');
                $('body, html').animate({ scrollTop: $firstError.offset().top + 'px' }, 150);
                $firstError.find('textarea, input:first').focus();
            }
        });
    }


    /**
     * Are we on the confirmation step?
     */
    function isOnConfirmationStep()
    {
        return $('.schedule-confirmation-loaded').length > 0;
    }


    function showPaymentForm()
    {
        var template = $('#payment-template').html();
        if (!template) return;
        Popup.showHtml(template, initPayment);
    }


    function init()
    {
        // Start at the top
        $('body, html').scrollTop(0);

        $('#appt-cancel').click(function (ev) {
            var href = $(ev.currentTarget).attr('data-confirm-href');
            confirmCancel(href);
        });

        $('#client-edit-forms').click(function (ev) {
            Popup.showHtml($('#edit-forms-template').html(), initEditForms);
        });


        $('.client-register-btn').click(function (ev) {
            ev.preventDefault();
            Popup.showUrl($(ev.currentTarget).attr('href'), initClientRegister);
        });

        $('#appt-reschedule').click(function (ev) {
            Popup.showHtml($('#reschedule-template').html(), initReschedule);
        });


        $('#appt-pay').click(showPaymentForm);
        if (document.location.href.indexOf('#payment') > -1) {
            showPaymentForm();
        }

        if (isOnConfirmationStep()) {
            var newText = 'Confirmed!';
            $('.step-confirmation a').attr('data-original-text', newText).text(newText);
        }

        $(document).trigger('acuity:stepLoaded');
    }

    init();

    return {
        init: init,
        isOnConfirmationStep: isOnConfirmationStep
    };
})();

var Acuity = Acuity || {};

(function() {
    function setTip(tipAmount) {
        tipAmount = parseFloat(tipAmount.replace('$', ''));
        if (!tipAmount || tipAmount<=0) {
            tipAmount = 0.00;
        }

        var baseAmount = $('#label-total-amount').attr('data-base-total');
        $('#value-total-amount').text( (parseFloat(baseAmount) + tipAmount).toFixed(2) );
    }

    // Tipping!
    $('body').on('change', 'input[name="tip[choice]"]', function (ev) {
        $current = $(ev.currentTarget);
        if ($current.val() != 'custom') {
            var tipAmount = $current.closest('.btn').find('.tip-value').text();
            $('#tip-amount').val(tipAmount);
            $('#tip-amount-container').hide().closest('.btn').addClass('tip-choice-fixed');
        } else {
            // show form for custom
            var tipAmount = $('#tip-amount').val();
            $('#tip-amount-container').show().closest('.btn').removeClass('tip-choice-fixed');
            $('#tip-amount').focus();
        }

        setTip(tipAmount);
    });

    // Did they choose a different source?
    $('body').on('change', 'input[name="paymentSource"]', function (ev) {
        if ($(ev.currentTarget).val() == 'new') {
            $('#new-credit-card-container').slideDown(200).find('input[value=""]').first().focus();
        } else {
            $('#new-credit-card-container').slideUp(200);
        }
    });

    $('body').on('keyup change', '#tip-amount', function (ev) {
        setTip($('#tip-amount').val());
    });

    $('body').on('click', '.show-what-is-cvv2', function (ev) {
        $('#what-is-cvv2').toggle();
        ev.preventDefault();
    });

    $('body').on('click', '.show-transaction-secure', function (ev) {
        $('#transaction-secure').toggle();
        ev.preventDefault();
    });


    /**
     * Handle Square payments
     */
    var requestCardNonce = function () {};

    var initSquarePayments = function (applicationId) {
        if (typeof paymentForm != 'undefined') paymentForm.destroy();

        paymentForm = new SqPaymentForm({
            applicationId: applicationId,
            inputClass: 'sq-input',
            inputStyles: [
                {
                    fontSize: '15px'
                }
            ],
            cardNumber: {
                elementId: 'ccnumber',
                placeholder: 'â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢'
            },
            cvv: {
                elementId: 'cvv2',
                placeholder: 'CVV'
            },
            expirationDate: {
                elementId: 'sq-expiration-date',
                placeholder: 'MM/YY'
            },
            postalCode: {
                elementId: 'billing-zip'
            },
            callbacks: {
                cardNonceResponseReceived: function(errors, nonce, cardData) {
                    if (errors) {
                        // handle errors
                        var errorMessage = '';
                        errors.forEach(function(error) { errorMessage += error.message + '<br />\n'; });
                        // TODO: show error
                        $('#general-credit-card-error').html(errorMessage).show();
                        $('#popup .btn-primary').button('reset');
                        $('[name="ccnumber"]').val('');
                    } else {
                        // handle nonce
                        $('#general-credit-card-error').hide();
                        $('.credit-card-form .has-error').removeClass('has-error');
                        $('[name="ccnumber"]').val(nonce);
                        $('[name="zip"]').val(cardData['billing_postal_code']);
                        Acuity.CreditCard.nonceReceivedCallback(nonce);
                    }
                },
                unsupportedBrowserDetected: function() {
                    $('#general-credit-card-error').html('Cannot enter credit cards through Square, your browser is not supported.').show();
                },
                inputEventReceived: function(inputEvent) {
                    // Something changed? Reset nonce
                    $('[name="ccnumber"]').val('');
                    $('#new-credit-card-container .has-error').removeClass('has-error');

                    switch (inputEvent.eventType) {
                        case 'focusClassAdded':
                            // Handle as desired
                            break;
                        case 'focusClassRemoved':
                            // Handle as desired
                            break;
                        case 'errorClassAdded':
                            // Handle as desired
                            break;
                        case 'errorClassRemoved':
                            // Handle as desired
                            break;
                        case 'cardBrandChanged':
                            // Handle as desired
                            break;
                        case 'postalCodeChanged':
                            // Handle as desired
                            break;
                    }
                }
            }
        });

        paymentForm.build();

        requestCardNonce = function () {
            paymentForm.requestCardNonce();
        }


        // Create the field to accept the nonce...
        if ($('[name="ccnumber"]').length == 0) {
            $('#ccnumber').after('<input type="hidden" name="ccnumber" value="" />');
        }
        if ($('[name="zip"]').length == 0) {
            $('#billing-zip').after('<input type="hidden" name="zip" value="" />');
        }

        $('.square-loading-indicator').hide();
        $('.credit-card-form, .square-new-cc-container').show();
    };

    function initSquare($container) {
        var squareApplicationId = $('#squareApplicationId').val();
        if (typeof squareApplicationId!='undefined') {
            async('https://js.squareup.com/v2/paymentform', function () {
                initSquarePayments(squareApplicationId);
                $('#ccnumber').closest('.required-field').removeClass('required-field');
            });
        }
    }

    function isUsingSquare()
    {
        return $('.sq-input').length > 0;
    }


    Acuity.CreditCard = {
        nonceReceivedCallback: function (nonce) {},
        initSquare: initSquare,
        isUsingSquare: isUsingSquare,
        requestCardNonce: function () {
            requestCardNonce();
        },
        isNewCard: function () {
            return ($('[name="paymentSource"]:checked').val() == 'new' || $('[name="paymentSource"]').length==0);
        },
        validateCustomForm: function () {
            var $paymentSource = $('input[name="paymentSource"]');
            if ($paymentSource.length && !$paymentSource.filter(':checked').length) {
                $('.payment-source-list').addClass('has-error');
                $('#has-credit-card-error').show();
                return false;
            } else {
                $('.payment-source-list').removeClass('has-error');
                $('#has-credit-card-error').hide();
                return true;
            }
        },
        initPaymentContainer: function ($container) {
            Acuity.CreditCard.initSquare();

            $container.find('input[value=""]:first').focus();
            $container.find('form').submit(function (ev) {
                var $this = $(this);
                if (Acuity.CreditCard.validateCustomForm() && Acuity.FormUtilities.validate($container)) {
                    // All good so far...
                    if (!$('[name="ccnumber"]').val() && Acuity.CreditCard.isUsingSquare() && Acuity.CreditCard.isNewCard()) {
                        ev.preventDefault();
                        $container.find('input[type="submit"]').button('loading');
                        Acuity.CreditCard.nonceReceivedCallback = function () {
                            // Resubmit this once we have the nonce...
                            $this.submit();
                        };

                        Acuity.CreditCard.requestCardNonce();
                    } else {
                        $container.find('input[type="submit"]').button('loading');
                    }
                } else {
                    $container.find('.has-error input').first().focus();
                    ev.preventDefault();
                }
            });
        }
    };
})();
Acuity.Embed = (function () {
    function sendMessage(type, val)
    {
        window.parent.postMessage(type+':'+val, '*');
    }

    function isEmbedded() {
        try {
            var userAgent = window.navigator.userAgent.toLowerCase();
            var ios = /iphone|ipod|ipad/.test(userAgent);
            var safari = /safari/.test(userAgent);
            if (document.location.href.indexOf('notembedded=1') > 0) {
                return false;
            }

            return (
                (window.self !== window.top) || // Browser embedded
                (ios && !safari && !window.navigator.standalone) // iOS app embedded
                // I haven't seen a reliable way to detect android webviews
            );
        } catch (e) {
            return true;
        }
    }

    function watchHeightChange()
    {
        var lastHeight = 0;
        var lastUrl = document.location.href;

        function checkHeightChange(){
            var newHeight = Math.max(document.body.clientHeight, 200);

            var heightElements = ['.choose-time-container:visible', '#popup-content:visible'];
            for (var i=0; i<heightElements.length; i++) {
                var $el = $(heightElements[i]);

                if ($el.length) {
                    newHeight = Math.max(newHeight, $el.height() + $el.offset().top);
                }
            }

            var heightDifference = newHeight-lastHeight;
            if( heightDifference>20 || heightDifference<-50 ) {
                sendMessage('sizing', (newHeight+38));
                lastHeight = newHeight;
            }

            if (lastUrl != document.location.href) {
                lastUrl = document.location.href;
                sendMessage('load', '');
            }
        }
        if (window.parent && typeof window.parent.postMessage == 'function') {
            setInterval(checkHeightChange, 300);
        }
    }

    $(window).on("message", function(ev) {
        var data = ev.originalEvent.data;
        if (data == 'acuity:init') {
            // We have communication with the parent!
            // Remove scrollbars, on resize the iframe can cause flickering
            $('html').css({
                overflow: 'hidden'
            });
        }
    });

    function scrollTop() {
        sendMessage('load', '');
    }

    var exports = {
        scrollTop: scrollTop
    };

    // Collapsing the appt type list can change the height quite a bit, this should really scroll to that element, but instead just scroll to top
    $('.select-type').on('acuity:checked', function () {
        if ($('.select-type').height()*($('.select-type input[type="radio"]').length-1) > 400/*tall-ish, roughly 2 calendar heights*/) {
            sendMessage('scrollTo', $('.select-type').offset().top);
        }
    });

    // Not framed? Stop right here.
    if (!isEmbedded()) {
        return exports;
    }

    // All frames beyond this point...
    if (typeof isFree!='undefined' && isFree) {
        // After load, show error
        $(function () {
            Steps.error('Embedding Acuity Scheduling is only available with paid accounts, <a href="https://secure.acuityscheduling.com/preferences.php?action=myaccount" target="_blank">please upgrade</a> to remove this message.');
        });
    }

    $.get('/schedule.php', {
        action: 'embed',
        owner: $('#owner').val()
    });

    // watch for height changes and alert on that
    watchHeightChange();

    // change the style when embedded...
    $('body').addClass('is-embedded');

    return exports;
})();
Acuity.Forms = (function(){
    // style focus
    Acuity.Focus.init($('#step-forms'));

    /**
     * Watch for submit of payment form
     */
    function initPaymentForm($container)
    {
        // For authorize.net focus on address first
        if ($('textarea[name="address"]').focus().length == 0) {
            $('#ccnumber').focus();
        }

        var $form = $container.find('form');
        var $button = $container.find('.btn-primary');

        Acuity.CreditCard.initSquare($container);

        $form.submit(function (ev) {
            var action = $form.attr('action');
            if (action.indexOf('https://') != -1) {
                // external submit, like paypal? handle normally
                return;
            }

            function doSubmit() {
                $.post(action+'&ajax=1', $form.serialize())
                    .done(function (data, textStatus, jqXHR) {
                        handleSubmitResult(data, jqXHR);
                    }).error(function () {
                    $button.button('reset');
                });
            }

            ev.preventDefault();
            $button.button('loading');

            // If entering a new card, get the nonce before submitting (this validates too)
            if (Acuity.CreditCard.isUsingSquare() && Acuity.CreditCard.isNewCard()) {
                Acuity.CreditCard.nonceReceivedCallback = doSubmit;
                Acuity.CreditCard.requestCardNonce();
            } else {
                doSubmit();
            }

        });
    }


    /**
     * Handle parsing result and setting next state
     */
    function handleSubmitResult(data, jqXHR)
    {
        try {
            var result = JSON.parse(data);
            if (result.success) {
                Popup.hide();
                if (jqXHR && jqXHR.getResponseHeader('X-PJAX-URL') && typeof window.history!='undefined' && typeof window.history.pushState == 'function') {
                    window.history.pushState({"html":data,"pageTitle": 'Appointment Confirmed'}, "", jqXHR.getResponseHeader('X-PJAX-URL'));
                }
                $('#step-confirmation').html(result.success);
                Steps.next();
            } else if(result.error) {
                Popup.hide();
                Steps.error(result.error);
            } else {
                Popup.hide();
                Steps.error('Failed to confirm appointment, unknown error, please try again.');
            }
        } catch (ex) {
            // Just for curiosity, is this ever _not_ a payment form?
            if (data.indexOf('action=complete_payment')>-1 || data.indexOf('paypal-redirect-identifier')>-1) {
                // Not json?
                //	more HTML for us to complete in this step for payment...
                Popup.showHtml(data, initPaymentForm);
            } else {
                if (typeof trackJs=='function') {
                    trackJs('Non-Payment showing popup, success index:' + data.indexOf('{"success"') + ' location:' + document.location.href);
                }
                window.location.reload();
            }
        }
    }


    /**
     * Init everything, load the dynamic forms
     */
    function init()
    {
        // Hide the "Upcoming Appointments" or other leftover alerts from first page
        $('.alert-success.dynamic-alert').hide();

        var serializedForms = $('#appointment-form').serialize();
        $('#custom-forms').html(Acuity.Config.loadingHtml);

        var loadingMessageTimer = setInterval(function () {
            // Did they fill in all the required fields?
            //	let 'em know the submit is coming
            if ($('#first-name, #last-name, #email').filter(function() {return $(this).val().trim()=='';} ).length == 0) {
                $('#custom-forms').html(Acuity.Config.loadingHtml + ' Still loading, you\'ll be able to confirm your appointment after this loads...');
            }
        }, 5000);

        // Get any custom forms...
        $.post('/schedule.php?action=getForms&owner='+$('#owner').val()+'&'+SID, serializedForms
        ).done(function (data) {
            // Doing the clear here to avoid any potential race between this and always being called, is that even possible?
            clearInterval(loadingMessageTimer);
            $('#custom-forms').html(data);
            initCustomForms();
        }).fail(function (data) {
            $('#custom-forms').html('Failed to get custom forms. <a href="#" class="retry">Retry?</a>').on('click', '.retry', function () {
                init();
            });
        }).always(function () {
            clearInterval(loadingMessageTimer);
        });

        $('#first-name').focus();

        // Show the appointment summary at the top...
        $('#forms-appt-summary').html(Acuity.PickAppointment.getSummary());
        $(document).on('acuity:changeSummary', function () {
            if (!Acuity.PickAppointment.areTimesAvailable()) {
                $('#forms-appt-summary').html('No times are available. Please go back and choose a different time.');
                if ($('#forms-appt-summary').is(':visible')) {
                    // are we on the forms page? go back...
                    Steps.error('Your times are no longer available, please choose a new appointment time.');
                }
            } else {
                $('#forms-appt-summary').html(Acuity.PickAppointment.getSummary());
            }
        });

        $(document).trigger('acuity:stepLoaded');
    }




    /**
     * Initialize form validation for custom stuff
     */
    function initCustomForms()
    {
        // No submitting form directly!
        $('#appointment-form').submit(function (ev) {
            ev.preventDefault();
        });

        // Only submit through buttons
        var paymentButtonSelector = '.submit-forms-nopay, .submit-forms-payment, .submit-forms-deposit';
        $(paymentButtonSelector).click(function (ev) {
            if (Acuity.FormUtilities.validate($('#step-forms'))) {
                if (!quickValidateEmail()
                    || !validateCertificateCodeByEmail()
                ) {
                    ev.preventDefault();
                    return;
                }

                // cool, send it!
                var $target = $(ev.currentTarget);
                $('.error-message-submit-failed').hide();
                $submitButton = $target.button('loading');

                var serializedForms = $('#appointment-form').serialize();

                // If they hit enter the first button, even if hidden, will be clicked
                //	instead default to first visible
                var $clickedTarget = ($target.is(':visible') ? $target : $(paymentButtonSelector).filter(':visible').first());

                // Include payment option picked
                if ($clickedTarget.hasClass('submit-forms-nopay')) {
                    serializedForms += '&pay_later=1';
                } else if ($clickedTarget.hasClass('submit-forms-deposit')) {
                    serializedForms += '&pay_deposit=1';
                } else if ($clickedTarget.hasClass('submit-forms-payment')) {
                    serializedForms += '&payment=1';
                }

                if ($(ev.currentTarget).hasClass('pay-paypal')) {
                    serializedForms += '&payment_paypal=1';
                }



                $.post('/schedule.php?action=confirm&ajax=1&owner='+$('#owner').val()+'&'+SID, serializedForms
                )
                    .done(function (data, textStatus, jqXHR) {
                        handleSubmitResult(data, jqXHR);
                    }).error(function () {
                    $('.error-message-submit-failed').show();
                }).always(function () {
                    $submitButton.button('reset');
                });
            } else {
                // err!
                $firstError = $('.has-error:first');
                $('body, html').animate({ scrollTop: $firstError.offset().top + 'px' }, 150);
                var $input = $firstError.find('textarea, input, select');
                if ($input.length == 1) {
                    $input.focus();
                } else {
                    $input.filter(function() { return this.value == ""; }).first().focus();
                }
            }
            ev.preventDefault();
        });

        $(document).trigger('acuity:forms-loaded');
    }


    /**
     * Validate e-mail quickly, just a regex and some basics
     */
    function quickValidateEmail()
    {
        var email = $('#email').val().toLowerCase();
        var $formGroup = $('#email').closest('.form-group');

        // If they renamed the label, then don't validate
        if ($formGroup.find('label').text().indexOf('mail') < 0) {
            return true;
        }

        if (email=='none' || email=='n/a' || email=='na' || isEmailValid(email)) {
            // It's valid!
            return true;
        } else {
            // it's invalid, show the error
            $formGroup.addClass('has-error')
                .attr('data-is-manual-error', 'true')
                .find('input').focus();
            $('#email-error-domain').hide();
            return false;
        }
    }

    /**
     * Show the errors for an invalid e-mail, this does some fancy server side checking
     */
    function handleValidateEmailResponse(data)
    {
        // only invalid if returned 0
        var result = false;
        try {
            result = JSON.parse(data);
        } catch (e) {
            // ...
            return;
        }

        if (!result.emailValid) {
            var email = $('#email').val();
            var $formGroup = $('#email').closest('.form-group');

            // it's invalid, show the error
            $formGroup.addClass('has-error');
            $formGroup.attr('data-is-manual-error', 'true');
            $('#email-error-help').show();

            // if they typed an @ then it's probably their domain that's incorrect
            if (email.indexOf('@')>-1) {
                $('#email-error-domain').show();
            } else {
                $('#email-error-domain').hide();
            }
        }

        if (result.codes && !Acuity.Certificate.getCertificate()) {
            // Let 'em know they can redeem something if they want
            $('.redeem-email-message').html(result.codes.message).show();
        } else {
            $('.redeem-email-message').hide();
        }

        $('.already-registered-warning').remove();
        if (result.timesValid === false && result.timesErrorMessage) {
            // Show the error message
            $('<div class="alert alert-warning already-registered-warning">'+result.timesErrorMessage+'</div>').insertBefore('.forms-action-container');
        }
    }


    /**
     * If we're redeeming a certificate code by email,
     * it _must_ match the email on the appt or it won't be able to be applied
     */
    function validateCertificateCodeByEmail()
    {
        var $container = $('.forms-action-container .certificate-input');
        $container.removeClass('has-error');
        $container.find('.help-block-certificate-email').hide();

        var code = Acuity.Certificate.getCertificate();
        code = normalizeEmail(code);
        if (!isEmailValid(code) || !code) {
            return true;
        }

        // Ok, code is an email, does it match?
        var apptEmail = normalizeEmail($('#email').val());
        if (code == apptEmail) {
            return true;
        }

        // Code is an email and doesn't match, show our error and stop
        $container.removeClass('has-success').addClass('has-error');
        $container.find('.help-block-certificate-email').show();
        $container.find('.help-block-certificate-email .certificate-email-now').text(apptEmail);
        $container.find('.help-block-certificate-email .certificate-email-intended').text(code);
        return false;
    }


    var clickingReload = false;
    $('#custom-forms').on('click', '.reload-page', function (ev) {
        clickingReload = true;
        document.location.reload();
    });


    $('#email').blur(function (ev) {
        // Validate certificate if needed
        validateCertificateCodeByEmail();

        // Validate they entered a good e-mail
        var $formGroup = $(ev.currentTarget).closest('.form-group');

        if ($formGroup.find('label').text().indexOf('mail') > -1) {
            // ok, it is still labeled as e-mail not renamed through babel
            //	validate it
            $formGroup.removeClass('has-error');
            $formGroup.attr('data-is-manual-error', '');
            $('#email-error-help').hide();

            var email = $('#email').val();
            $.post('/schedule.php?action=validateEmail&owner='+$('#owner').val(), $('#appointment-form').serialize(), handleValidateEmailResponse);
        }
    });

    window.onbeforeunload = function() {
        // If popup visible could be payment
        if ($('.step-forms.active').length > 0 && !Popup.isVisible() && !clickingReload) {
            return "Your appointment has *not* been completed";
        }
    }

    return {
        init: init
    };
})();
Acuity.Hints = (function () {
    /**
     * These hints are inline on the CSP
     */
    var hints = [
        {
            selectors: ['.btn-recurring'],
            hint: 'Disable recurring appointments <a href="https://secure.acuityscheduling.com/preferences.php?tab=customize&hnav=options" target="_blank">under Scheduling Page Options</a>'
        }
    ];

    /**
     * Show this hint
     */
    function enableHint(selector, hint)
    {
        var $hintButton = $('<div class="hint-btn"><i class="fa fa-circle-o"></i></div>').css({
            top: $(selector).position().top + 'px',
            left: ($(selector).position().left-15) + 'px'
        })
            .insertBefore($(selector).not('.hint-set'));
        $(selector).addClass('hint-set');

        var timeout = null;
        $hintButton.hover(function () {
            var $this = $(this);
            clearTimeout(timeout);

            if ($this.find('.hint-tooltip').length) {
                return;
            }

            $('.hint-tooltip').remove();
            $tooltip = $('<div class="hint-tooltip"></div>').html(hint);
            $this.append($tooltip);
        }, function () {
            var $this = $(this);
            timeout = setTimeout(function() {
                $this.find('.hint-tooltip').remove();
            }, 150);

        });
    }

    function reset() {
        $('.hint-tooltip, .hint-btn').remove();
        $('.hint-set').removeClass('hint-set');
    }

    function loadHints() {
        for (var i=0; i<hints.length; i++) {
            for (var j=0; j<hints[i]['selectors'].length; j++) {
                enableHint(hints[i]['selectors'][j], hints[i]['hint']);
            }
        }
    }

    var watchTimers = {};
    function watchYPosition(selector) {
        if (typeof JSON=='undefined' || typeof JSON.stringify != 'function') {
            return;
        }

        if (watchTimers[selector]) {
            // Already watching
            return;
        }

        var checkPosition = function () {
            var offset = $(selector).offset();
            var currentY = 0;
            if (offset) {
                currentY = offset.top;
            }

            if (currentY != lastYPosition) {
                lastYPosition = currentY;
                var val = {
                    selector: selector,
                    top: currentY
                };
                window.parent.postMessage('acuity:ypos:'+JSON.stringify(val), '*');
            }
        };

        var lastYPosition = -1;
        watchTimers[selector] = setInterval(checkPosition, 200);
        setTimeout(checkPosition, 50);
    }

    function init () {
        $(document).on('acuity:stepLoaded', function () {
            loadHints();
        });

        var resizeTimeout = null;
        $(window).resize(function () {
            clearTimeout(resizeTimeout);

            resizeTimeout = setTimeout(function () {
                reset();
                loadHints();
            }, 50);
        });
    }

    return {
        init: init,
        watchYPosition: watchYPosition
    }
})();
Acuity.Login = (function (){
    function reloadAfterLogin()
    {
        if (Acuity.Confirmation.isOnConfirmationStep() || Acuity.PickAppointment.isOnPickStep()) {
            if (document.location.href.indexOf(SID) == -1) {
                // Add SID
                var newHref = document.location.href;
                newHref = newHref + (newHref.indexOf('?') == -1 ? '?' : '&') + SID;
                document.location.href = newHref;
            } else {
                // Already has SID, just reload
                document.location.reload();
            }
            return;
        }

        var beforeLoginHtml = $('.login-container').html();

        $('.login-container').html(Acuity.Config.loadingHtml);
        // reload login prompt
        $.get('/schedule.php?action=getLogin&owner='+$('#owner').val()+'&'+SID,
            function (data) {
                $('.login-container').html(data);
                if (typeof currentClient == 'undefined') {
                    currentClient = {};
                }

                $('#first-name').val(currentClient.firstName || '');
                $('#last-name').val(currentClient.lastName || '');
                $('#phone').val(currentClient.phone || '');
                $('#email').val(currentClient.email || '');
            }).fail(function () {
            // revert back...
            $('.login-container').html(beforeLoginHtml);
        });

        // Also re-init forms
        Acuity.Forms.init();
    }


    function initLoginForm($container)
    {
        if ($container.find('#username').val()) {
            $container.find('#password').focus();
        } else {
            $container.find('#username').focus();
        }

        // form loaded, do stuff
        if ($container.attr('data-form-init')) {
            return;
        }

        $container.attr('data-form-init', true);
        $container.on('submit', 'form.client-login-form', function (ev) {
            ev.preventDefault();

            // submit it ajaxy!
            $form = $(ev.currentTarget);
            var action = $form.attr('action');
            var data = $form.serialize();

            Popup.showHtml(Acuity.Config.loadingHtml);

            $.post(action, data)
                .done(function (data) {
                    // ... error? success?
                    // On error, it's the login form again
                    try {
                        var results = JSON.parse(data);

                        if (results.error) {
                            Popup.showHtml(results.error, initLoginForm);
                        } else if (results.success) {
                            reloadAfterLogin();
                            Popup.hide();
                        }
                    } catch (ex) {
                        Popup.showHtml('Error, failed to log in. Please refresh the page and try again.');
                        trackJs.track('client login failed');
                        trackJs.track(ex);
                    }

                }).fail(function () {
                Popup.showHtml('Error, failed to log in. Please check your internet connection, then refresh the page and try again.');
                trackJs.track('client login failed to post');
            });
        });
    }


    /**
     * Validate form
     */
    function initChangePassword($container)
    {
        $container.find('input[type="password"]:first').focus();
        $error = $container.find('.error-msg').hide();

        $container.on('submit', 'form', function (ev) {
            // validate
            var error = '';
            if (!$('#password1').val()) {
                error = 'Password cannot be blank';
            } else if ($('#password1').val() != $('#password2').val()) {
                error = 'Passwords do not match';
            }

            if (error) {
                ev.preventDefault();
                $error.html(error).show();
                $container.find('input[type="password"]:first').focus();
            }
        });
    }


    $('body').on('click', '.client-login-btn', function (ev) {
        ev.preventDefault();
        var url = $(ev.currentTarget).attr('href') + '&ajax=1';
        $.get(url, function (data) {
            try {
                var result = JSON.parse(data);
                // Logged in from somewhere else
                if (result.success) {
                    reloadAfterLogin();
                    Popup.hide();
                }
            } catch (ex) {
                // Good, not json!
                Popup.showHtml(data);
            }
        }).fail(function () {
            Popup.showHtml('Failed to load login, please check your internet connection and try again.');
        });
        Popup.showUrl(url, initLoginForm);
    });

    $('.client-login, #appointment-form').on('click', '.change-password-btn', function (ev){
        ev.preventDefault();
        var url = $(ev.currentTarget).attr('href') + '&ajax=1';
        Popup.showUrl(url, initChangePassword);
    });

    $(function (ev) {
        if (document.location.href.indexOf('#login') > -1) {
            $('.client-login-btn').first().click();
        }
    });

    return {
        // ...
    }
})();
/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-input-inputtypes-testprop-testallprops-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function x(a){i.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}function E(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)r[c[d]]=c[d]in j;return r.list&&(r.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),r}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,g,h,i=a.length;d<i;d++)j.setAttribute("type",g=a[d]),e=j.type!=="text",e&&(j.value=k,j.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(g)&&j.style.WebkitAppearance!==c?(f.appendChild(j),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(j,null).WebkitAppearance!=="textfield"&&j.offsetHeight!==0,f.removeChild(j)):/^(search|tel)$/.test(g)||(/^(url|email)$/.test(g)?e=j.checkValidity&&j.checkValidity()===!1:e=j.value!=k)),q[a[d]]=!!e;return q}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.7.1",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j=b.createElement("input"),k=":)",l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!D("transform")};for(var F in p)w(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.input||E(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),h=j=null,e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

$(function () {
    // downgrade navs if needed
    if (!Modernizr.csstransforms) {
        $('body').addClass('no-transforms');
    } else {
        $('body').addClass('has-transforms');
    }

    // enable labels if no placeholders
    if (!Modernizr.input.placeholder) {
        $('body').addClass('no-placeholder');
    }
});

/**
 * Acuity namespace for helper functions that still interact with DOM
 */
Acuity.PickAppointment = (function () {
    var _lastTimesRequest = null;
    var acuityCalendar = new Acuity.Calendar({
        $calendar: $('.choose-date'),
        clearTimes: clearTimes,
        getType: getType,
        getAddons: getAddons,
        getCalendar: getCalendar,
        timesLoaded: timesLoaded,
        dateSelected: dateSelected,
        getTimezone: function () {
            return $('#timezone').val();
        }
    });

    function getType() {
        return $('.select-type').attr('data-value');
    }

    function getAddons() {
        return $('.addon-option:checked').map(function(){
            return $(this).val();
        }).get();
    }

    function getCalendar() {
        return $('.select-calendar').attr('data-value');
    }

    function clearSelectedTimes() {
        // Only clear out the times if we can choose another one, if the calendar is available
        if ($('.choose-date-time:visible').length == 0 || $('.calendar').length) {
            $('#selected-times').html('');
            $('#selected-times-container').hide();
        }
    }

    function isSuperNarrow() {
        return $('body').width() <= 400;
    }

    /**
     * Is a group appointment type selected?
     */
    function isGroupTypeSelected() {
        return $('.select-type input[value="'+getType()+'"]').attr('data-is-group') == 1;
    }


    function getGroupQuantity() {
        if (!isGroupTypeSelected()) {
            return 1;
        }
        var $qty = $('#group-quantity');

        var qtyVal = parseInt($qty.val());
        if ($qty.length != 1 || !qtyVal) {
            return 1;
        } else {
            return Math.max(1, qtyVal);
        }
    }

    $('#group-quantity').on('keyup change', function (ev) {
        $(this).closest('.group-quantity-container').removeClass('has-error');
    });

    /**
     * In some cases group quantity is required,
     */
    function groupQuantityError()
    {
        $qty = $('#group-quantity');
        if ($qty.is(':visible') && $qty.val()==='0') {
            $('.group-quantity-container').addClass('has-error');
            $qty.focus();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clear the calendar date and time
     */
    function clearDate(dontHideContainer) {
        // Hide the time zone selection if we're changing this
        Popup.hide();

        clearTimes();
        $('.choose-date').html('');
        $('.choose-date-time').hide();
        // Clearing selected times makes sure its hidden
        clearSelectedTimes();
        if (dontHideContainer) $('.choose-date-time').show();
    }


    function isSelectedTimeOnDifferentDay()
    {
        // Parenthesis means time is on a different day, like:
        //	January 21, 2015  4:00am (January 22)
        return $('#selected-times').text().indexOf('(') >= 0;
    }

    function normalizeTimes()
    {
        // go through, find anything that's not right
        var times = [];
        var elementsInOrder = [];

        $('#selected-times .selected-time').each(function () {
            var time = $(this).find('[name="time[]"]').val();
            times.push(time);
            elementsInOrder.push(this);
        });

        $.getJSON('/schedule.php', {
            owner: $('#owner').val(),
            action: 'normalizeTimes',
            timezone: $('#timezone').val(),
            'times': times
        }, function (data) {
            // Anything amiss from when we sent?
            if (typeof data.length=='undefined' || data.length != elementsInOrder.length) {
                return;
            }

            for (var i=0; i<data.length; i++) {
                $(elementsInOrder[i]).find('.selected-time-description').text(data[i]);
            }
            $(document).trigger('acuity:changeSummary');
        });
    }


    var normalizeTimesDebounced = debounce(function () {
        // If nothing on a different day then they look
        //	dandy just the way they are
        if (!isSelectedTimeOnDifferentDay()) {
            return;
        }

        normalizeTimes();
    }, 50);


    /**
     * Generate the calendar list based on appt type
     */
    function loadCalendarSelect(typeId)
    {
        var calendars = typeToCalendars[typeId];
        $('#select-calendar-options').html('');
        if (!calendars) {
            return;
        }

        // ok build the list...
        var html = '';

        function addCalendarOption(id, label) {
            if (!label) label = 'Blank Name';
            html += '<input type="radio" name="calendar" id="calendar-'+id+'" value="'+id+'" /><label class="select-item '+(id!='any'?'babel-ignore':'')+'" for="calendar-'+id+'">'+label+'</label>';
        }

        if (calendars.length > 1 && !self.alwaysChooseAnyAvailable) {
            if (!self.hideAnyAvailable) addCalendarOption('any', 'Any available');

            for (var i=0; i<calendars.length; i++) {
                addCalendarOption(calendars[i][0], calendars[i][1]);
            }
        } else {
            // only one option, don't even show it just pick it
            var calendarId = 'any';
            if (calendars.length == 1) {
                calendarId = calendars[0][0];
            }

            html = '<input type="radio" name="calendar" value="'+calendarId+'" checked="checked" />';
            $('.select-calendar').attr('data-value', calendarId);
            $('.select-calendar').hide(0);
            showDateTimePicker();
        }

        $('#select-calendar-options').html(html);
        // Focus on a non-visible input to jump to top
        //	even if
        if (Acuity.pageLoadTime && top.frames.length>1) {
            setTimeout(function () {
                $('#jump-to-top').show().focus();
            }, 10);
            setTimeout(function () {
                $('#jump-to-top').focus();
            }, 250);
            setTimeout(function () {
                $('#jump-to-top').blur();
            }, 300);
        }
        Select.reset( $('.select-calendar') );
    }

    /**
     * Invalidate current time selection and hide it
     */
    function clearTimes() {
        $('.choose-time').html('');
        $('.choose-time-container, .choose-time-actions').hide();
    }



    /**
     * Position the time container depending on widths of everything
     */
    function positionTimeContainer()
    {
        // Border size on .choose-time-container
        var borderWidth = 2;
        var timeMinWidth = 140;
        var buttonWidth = 102;

        var dayWidth = $('.selectedday').outerWidth() + borderWidth*2;
        var chooseDatePosition = $('.choose-date').position();
        var dayPosition = $('.selectedday').position();

        var chooseTimeWidth = Math.max(dayWidth, timeMinWidth);

        // If our min is bigger than the date offset it slightly to center
        var offsetWidth = 0;
        if (timeMinWidth > dayWidth) {
            offsetWidth = (timeMinWidth - dayWidth)/2;
        }

        var chooseTimeLeft = dayPosition.left + chooseDatePosition.left - borderWidth - offsetWidth;

        // Make sure it's far enough from right so that choose button shows
        var bodyWidth = $('html, body').width();
        var spaceForButton = bodyWidth - (chooseTimeLeft+chooseTimeWidth);

        // Super narrow is show inline so this wouldn't matter then
        if ( !isSuperNarrow() && spaceForButton < buttonWidth ) {
            chooseTimeLeft -= Math.min(60, buttonWidth-spaceForButton);
        }

        $('.choose-time-container')
            .css({
                top: dayPosition.top + chooseDatePosition.top - 1,
                left: Math.max(0, chooseTimeLeft),
                width: chooseTimeWidth
            })
    }


    /**
     * Called after a date is selected, before times loaded
     */
    function dateSelected(date)
    {
        var $time = $('.choose-time');
        $('.choose-time-actions').hide();

        // select the date...
        $('#date').val(date);

        $(document).trigger('acuity:selected-date', [date]);

        $time.html(Acuity.Config.loadingHtml).show();
        $('.choose-time-container')
            .show()
            .find('h1').text($('.selectedday').text());

        positionTimeContainer();
    }


    /**
     * Load times for a given date, assuming cal and type already selected
     */
    function timesLoaded(data) {
        var $time = $('.choose-time');

        // TODO: fail nicer
        if (typeof data == 'undefined') {
            $time.html('Failed to load times');
            return;
        }

        $time.hide().html(data).slideDown(150, function () {
            $('body, html').animate({ scrollTop: $time.offset().top + 'px' }, 150);

            // reposition times, if scrollbar appeared it will change width
            positionTimeContainer();
        });

        // Cross out any times if they don't have enough spots free
        if (groupQuantityError()) {
            $time.html('Please set a quantity and then choose a date again');
            $('#group-quantity').focus();
        } else {
            var numSpotsRequested = getGroupQuantity();
            $time.find('input[data-available]').each(function () {
                var numAvailable = $(this).attr('data-available');
                if (numAvailable && numAvailable < numSpotsRequested) {
                    $(this).next('label').addClass('not-enough-spots');
                }
            });
        }

        // only one? select it
        var $times = $time.find('label');
        if ($times.length == 1) {
            // Select the input and trigger change so button shows
            $times.click();
        }
    }

    /**
     * Were any date/times passed in as an argument to us?
     *	set them if they were
     */
    function loadDefaultDateTimes()
    {
        // Do we have any default times to choose?
        if (typeof defaultTimes != 'undefined' && defaultTimes) {
            clearDate(true/*dont hide date time container*/);

            for (var i=0; i<defaultTimes.length; i++) {
                addSelectedTime(defaultTimes[i].date, defaultTimes[i].time, defaultTimes[i].readableTime, true, defaultTimes[i].readableDate);
            }
            normalizeTimes();

            return true;
        } else {
            return false;
        }
    }


    /**
     * Load the calendar, or whatever is passed in
     */
    function loadCalendar()
    {
        if (loadDefaultDateTimes()) {
            // next step if there is nothing to fill out at all
            $('.choose-date').hide();
            if ( ($('#show-redeem-certificate-code').length==0 || $('#certificate').val())
                && $('#addons-container input').length==0
                && !isGroupTypeSelected()
            ) {
                setTimeout(Steps.next, 0);
            }
        } else {
            // Nothing passed in, let the client choose
            acuityCalendar.loadCalendar();
        }
    }


    /**
     * Show calendar
     */
    function showDateTimePicker()
    {
        clearDate();
        if (timezonePopupShouldShow) {
            showTimezonePopup(function () {
                timezonePopupShouldShow = false;
                // Actually load it
                showDateTimePicker();
            });
        } else {
            $('.choose-date-time').show();
            loadCalendar();
        }
    }

    /**
     * If the date/time picker is already showing, refresh it
     */
    function refreshDateTimePicker()
    {
        if ($('.choose-date-time').is(':visible')) {
            loadCalendar();
        }
    }


    /**
     * Deselect the current date/time options
     */
    function deselectDateTime()
    {
        $('.pick-appointment-pane .selectedday').removeClass('selectedday');
        $('#date').val('');

        $('.pick-appointment-pane .choose-time').slideUp(function () {
            clearTimes();
        });
    }


    function getReadableDate() {
        return $('#date').val();
    }

    function getBusinessDate() {
        var val = $('.choose-time input:checked').val();
        if (!val) return;
        return val.split(' ')[0];
    }

    /**
     * Get the value for the current time
     */
    function getBusinessTime() {
        var val = $('.choose-time input:checked').val();
        if (!val) return;
        return val.split(' ')[1];
    }

    /**
     * Get the time, but client's time zone
     */
    function getReadableTime() {
        var text = $($('.choose-time input:checked+label').contents()[0]).text();
        return text;
    }


    /**
     * Are there still times available that the client picked?
     */
    function areTimesAvailable()
    {
        return $('#selected-times .selected-time').not('.time-conflict').length > 0;
    }

    /**
     * Get an HTML summary of the appointments selected
     */
    function getSummary()
    {
        var typeTimeSeparator = ' on ';
        if (typeof LOCALE!='undefined' && LOCALE && LOCALE!='en') {
            typeTimeSeparator = ' ';
        }

        // Name of type
        var typeId = getType();
        var typeName = $('.select-type label[for="appointmentType-'+typeId+'"]').html();

        // Addons text
        var addonsText = $('#addons-container label:has(.addon-option:checked)').map(function() {
            return $(this).find('.addon-name').text() + ' ' + ($(this).find('.addon-attributes').html()||'');
        }).get().join(', ');

        if (addonsText) {
            typeName = typeName + ', ' + addonsText;
        }

        var numTimes = $('#selected-times .selected-time').length;
        var times = '';
        var timesCounts = {};

        // Find all the distinct times and count how many of each
        $('#selected-times .selected-time').not('.time-conflict').each(function(){
            var text = $(this).find('.selected-time-description').text();
            timesCounts[text] = 1 + (timesCounts[text] || 0)
        });

        // Show all the times with the quantity next to them
        for (var k in timesCounts) {
            var text = k;
            if (timesCounts[k] > 1) {
                text += ' <span class="appt-quantity">(x' + timesCounts[k] + ')</span>';
            }

            if (numTimes <= 1) {
                times += text;
            } else {
                times += '<div class="selected-time-summary">' + text + '</div>';
            }
        }

        if (!times) {
            return '';
        }

        return typeName + typeTimeSeparator + times;
    }



    /**
     * Handle changing the time zone label
     */
    function timezoneChanged()
    {
        // okie dokie, change it and get the friendly name
        var tzValue = $('#timezone').val();
        var tzName = $('#timezone option[value="'+tzValue+'"]').text();
        $('#timezone-label').text(tzName);
        $('#timezone').hide();

        // Someone might set this but not do a request
        AcuityStorage.setItem('TZ', tzValue);

        // and clear out any times that were previously selected...
        clearSelectedTimes();
        // and re-show the date picker
        refreshDateTimePicker();
    }


    /**
     * Show/hide the continue button at the top of the list of times
     * 	if there are alot of them we want it on both top and bottom
     */
    function toggleTopContinue() {
        var numSelectedTimes = $('#selected-times .selected-time').length;
        if (numSelectedTimes > 8) {
            $('.btn-next-step-top').show();
        } else {
            $('.btn-next-step-top').hide();
        }
    }


    /**
     * Add the individual selected time to the list
     */
    var _lastSelectedTimeId = 0;
    function addSelectedTimeToList(date, time, readableTime, dontShowRemove, readableDate) {
        if (!readableDate) {
            readableDate = date;
        }

        var dateTimeSeparator = ' at ';
        if (typeof LOCALE!='undefined' && LOCALE && LOCALE!='en') {
            dateTimeSeparator = ' ';
        }

        var form = '<input type="hidden" name="date[]" value="'+readableDate+'" />';
        form += '<input type="hidden" name="time[]" value="'+date+' '+time+'" />';

        var description = formatDateForHuman(readableDate);
        description += dateTimeSeparator + readableTime;

        var removeLink = '<a href="#" class="remove">remove</a>';
        if (dontShowRemove) {
            removeLink = '';
        }

        var $div = $('<div class="selected-time" id="selected-time-'+(_lastSelectedTimeId++)+'"></div>');
        $div.html(form + '<span class="selected-time-description">' + description + '</span>' + removeLink).on('click', '.remove', function (ev) {
            ev.preventDefault();
            $div.slideUp(function () {
                $div.remove();

                // Removing this emptied out last time? No more continue button...
                if (!$('.selected-time').length) {
                    clearSelectedTimes();
                }

                toggleTopContinue();
            });
        });

        $('#selected-times').append($div);
        $('#selected-times-container').show();

        toggleTopContinue();

        normalizeTimesDebounced();

        queueCheckConflict(date, time, $div.attr('id'));
    }


    function checkConflict(times) {
        $.post('/schedule.php?action=checkConflict&owner='+$('#owner').val(), {
            times: times,
            calendarID: getCalendar(),
            type: getType()
        }, function (data) {
            var result = [];
            try {
                result = JSON.parse(data);
            } catch (ex) {
                return;
            }

            for (var i=0; i<result.length; i++) {
                var why = result[i]['why'];
                if (why) {
                    var title = why;
                    if (why == 'conflicts') {
                        title = 'This conflicts with another appointment or is outside business hours';
                    } else if (why == 'past' || why == 'reallypast') {
                        title = 'This time is in the past';
                    } else if (why == 'advance') {
                        title = 'This time is too far in advance';
                    }

                    var $div = $('#'+result[i]['id']);
                    $div.attr('title', title)
                        .tooltip({placement: 'top'})
                        .addClass('time-conflict')
                        .find('input').remove();
                }
            }


            if (result) {
                // Show that it's not available, and remove the input so it won't be scheduled
                $(document).trigger('acuity:changeSummary');
            }
        });
    }

    var checkConflictTimes = [];
    var checkConflictTimer = null;
    function queueCheckConflict(date, time, id)
    {
        checkConflictTimes.push({id:id, date:date, time:time});

        if (checkConflictTimer) {
            clearTimeout(checkConflictTimer);
        }

        checkConflictTimer = setTimeout(function () {
            var times = jQuery.extend(true, {}, checkConflictTimes);
            checkConflictTimes = [];
            checkConflict(times);
        }, 50);
    }


    /**
     * Add selected time to table and form
     */
    function addSelectedTime(date, time, readableTime, dontShowRemove, readableDate) {
        if (!date || !time) {
            return;
        }

        var qty = getGroupQuantity();
        for (var i=0; i<qty; i++) {
            addSelectedTimeToList(date, time, readableTime, dontShowRemove, readableDate);
        }
    }


    /**
     * Show and load the addons
     */
    function loadAddons()
    {
        $('#addons-container').html(Acuity.Config.loadingHtml);
        $.get('/schedule.php', {
            owner: $('#owner').val(),
            type: getType(),
            action: 'getAddonsPartial'
        }, function (data) {
            if (data) {
                $('#addons-container').html('<div id="addons-prompt">Add to your appointment...</div>' + data);
            } else {
                $('#addons-container').html('');
            }
        });
    }


    /**
     * Show the popup to select timezone
     */
    function showTimezonePopup(cb)
    {
        var popupContent = '<div id="timezone-prompt" data-original-text="Confirm your time zone:">Set your time zone to continue:</div>';
        var newTz = $('#timezone').clone();
        newTz.attr('id', 'verify-timezone');
        newTz.show();

        popupContent += '<div class="margin-top-small">'+$('<div />').append(newTz).html()+'</div>';
        popupContent += '<input type="button" id="popup-set-timezone" class="btn btn-primary margin-top-small" value="Set time zone" />';
        Popup.insertHtml(popupContent, $('.choose-date-time'));

        $('#verify-timezone').val($('#timezone').val());

        $('#popup-set-timezone').click(function (ev) {
            $('#timezone').val($('#verify-timezone').val());
            Popup.hide();
            timezoneChanged();

            if (typeof cb == 'function') {
                cb();
            }
        });
    }


    /**
     * Is this step active?
     */
    function isOnPickStep()
    {
        return $('#step-pick-appointment:visible').length > 0;
    }

    /**
     * Init, this is called when coming to this page for the first time or returning from a step
     *	if returning, clear out old times, that way if recurring is disabled they can't add another
     *	and when people go back to this step it's usually because a time isn't available, or want to change times
     */
    function init()
    {
        clearSelectedTimes();
        $(document).trigger('acuity:stepLoaded');
    }

    var leftOffset = 2; // border radius

    /**
     * Handle time select.
     *
     * Listen to click event instead.  At the end, send a message to select the item.
     * SamsungBrowser had some issues with the change event.
     *
     * https://trello.com/c/HdYdSGXX/2671-timezone-not-showing-on-android-bug
     */
    $('.choose-time').on('click', 'label', function (ev) {
        $('.choose-time .choose-time-actions').remove();

        var $current = $(ev.currentTarget).prev('input[type="radio"]');
        if (!$current.size()) console.error('expected to have input.');

        // Make *sure* if the label is clicked that the checkbox is checked
        //	possible problem with Samsung browser where faking a click when a single time
        //	is in the list isn't actually checking this
        $current.prop('checked', true);

        // selected a time
        // slide out
        $('.choose-time .checked').removeClass('checked');
        var lblPosition = $(ev.currentTarget).addClass('checked').position();
        var boxPosition = $('.choose-time').position();
        $('.choose-time-actions').css({
            top: lblPosition.top + boxPosition.top + 'px',
            left: leftOffset + 'px'
        });

        var numSlotsAvailable = $current.attr('data-available');
        $('.error-not-enough-slots').remove();

        // Error out if not enough spots are available
        if (numSlotsAvailable && numSlotsAvailable < getGroupQuantity()) {
            $('<div class="error small error-not-enough-slots">Not enough spots are available</div>').insertAfter($('.choose-time .checked'));
            $('.choose-time-actions .btn').attr('disabled', true);
        } else {
            $('.choose-time-actions .btn').attr('disabled', false);
        }

        // Copy the buttons to below the selected time
        if (isSuperNarrow()) {
            var actions = $('<div class="choose-time-actions" />').html($('.choose-time-actions').html());
            $(ev.currentTarget).after(actions);

            // If needed, scroll to show the actions so they aren't hidden
            var amountOff = Math.max(0, $('.choose-time .choose-time-actions').position().top+$('.choose-time .choose-time-actions').height()-$('.choose-time').height());
            if (amountOff) {
                $('.choose-time').scrollTop( $('.choose-time').scrollTop() + amountOff);
            }
        } else {
            $('.choose-time-actions').show().animate({left: $('.choose-time-container').width()+leftOffset})
        }


        var time = $current.val();
        $(document).trigger('acuity:selected-time', [time]);
    });


    /**
     * Changing group quantity changes the default times if there are any
     */
    $('#group-quantity').on('change keyup', function (ev) {
        if (!Popup.isVisible()) {
            loadDefaultDateTimes();
        }
    });


    /**
     * Show next option only after choosing one...
     */
    var lastTypeValue = null;
    $('.select-type').on('acuity:checked', function (ev, val) {
        if (lastTypeValue != val) {
            lastTypeValue = val;

            $('.group-quantity-container').toggleClass('showing', isGroupTypeSelected());

            // Reload calendar selection
            $('.select-calendar').show();
            lastCalendarValue = null;
            clearDate();
            loadCalendarSelect(lastTypeValue);

            // And also the addons...
            if (hasAddons) loadAddons();
        }
    });

    var lastCalendarValue = null;
    $('.select-calendar').on('acuity:checked', function (ev, val) {
        // on handle change
        if (lastCalendarValue != val) {
            lastCalendarValue = val;

            showDateTimePicker();
        }
    });


    $('.select-type').on('acuity:checked', function () {
        setTimeout(Acuity.Certificate.checkCertificateCode, 0);
    });




    // Change the time zone manually
    $('.change-timezone').click(function (ev){
        $('#timezone').show();
        ev.preventDefault();
    });

    $('#timezone').change(function (ev) {
        timezoneChanged();
    });


    /**
     * Show autodetect popup
     */
    var timezonePopupShouldShow = false;
    if (Timezone.shouldDetectTimezone()) {
        var rememberedTz = AcuityStorage.getItem('TZ');
        var $rememberedTzOption = $('#timezone option[value="'+rememberedTz+'"]');
        // Always show the time zone option now, it's less annoying these days
        timezonePopupShouldShow = true;
        if (rememberedTz && $rememberedTzOption.length) {
            $('#timezone').val(rememberedTz);
        } else {
            // Try to auto-detect it
            $('#timezone').val(Timezone.getTimezoneName());
        }
        timezoneChanged();
    }

    /**
     * Show the popup to choose a recurring time
     */
    $('body').on('click', '.btn-recurring', function (ev) {
        Acuity.Recurring.showPopup();
        deselectDateTime();
    });

    $('.btn-additional').click(function (ev){
        ev.preventDefault();
    });

    /**
     * Add time to list when we click continue
     */
    $('body').on('click', '#step-pick-appointment .choose-time-container .btn-next-step, .btn-additional', function (ev) {
        // add current date/time to list
        var date = getBusinessDate();
        var readableDate = getReadableDate();
        var time = getBusinessTime();
        var readableTime = getReadableTime();

        deselectDateTime();

        // Add this time selection to the list...
        addSelectedTime(date, time, readableTime, false, readableDate);
    });

    /**
     * Hide time selection when click anywhere
     */
    $('html, body').click(function (ev) {
        $current = $(ev.target);

        // time selection is visible, and we clicked outside of it
        //	or we clicked inside one of the empty tds
        if ( ($('.choose-time-container').is(':visible') && $current.closest('.choose-date-time').length == 0)
            ||  ($current.closest('.choose-time-container').length==0 && $current.text()=='') ) {
            // close it
            deselectDateTime();
        }
    });


    /**
     * Only one option for appointment type? Select it
     */
    if ($('.select-type input[type="radio"], .select-item-no-input').length == 1) {
        Select.selectFirstItem();
    }

    /**
     * We're pretty much loaded, show it now
     */
    $('#page-loading').hide();
    $('#appointment-form').show();


    setTimeout(Acuity.Certificate.checkCertificateCode, 0);
    init();

    Acuity.addSeriesTime = addSelectedTime;

    return {
        isOnPickStep: isOnPickStep,
        getType: getType,
        getAddons: getAddons,
        getCalendar: getCalendar,
        getSummary: getSummary,
        areTimesAvailable: areTimesAvailable,
        init: init,
        /* These are exposed for recurring */
        addSelectedTime: addSelectedTime,
        getTime: getBusinessTime,
        getReadableTime: getReadableTime,
        getReadableDate: getReadableDate,
        getBusinessDate: getBusinessDate
    };
})();

/**
 * Handle highlighting and previews on CSP from admin side
 */
Acuity.Preview = (function () {
    function handleMessage(action, settings)
    {
        if (action == 'highlight' && typeof settings.selector != 'undefined') {
            $('.preview-highlight').removeClass('preview-highlight');
            $(settings.selector).addClass('preview-highlight');
        }

        if (action == 'text') {
            $(settings.selector).text(settings.text);
        }

        if (action == 'html') {
            $(settings.selector).html(settings.html).show();
        }

        if (action == 'toggle') {
            $(settings.selector).toggle(settings.show);
        }

        if (action == 'stophighlight') {
            $('.preview-highlight').removeClass('preview-highlight');
        }

        if (action == 'css') {
            setCss(settings.selector, settings.css);
        }

        if (action == 'noembed') {
            $('body').removeClass('is-embedded');
            Acuity.Hints.init();
        }

        if (action == 'watchY') {
            for (var i=0; i<settings.selectors.length; i++) {
                Acuity.Hints.watchYPosition(settings.selectors[i]);
            }
        }
    }


    function setCss(selector, css)
    {
        // Find the css with this id
        $style = $('[id="'+selector+'"]');

        if ($style.length) {
            $style.html(css);
        } else {
            $('body').append($('<style type="text/css"></style>').attr('id', selector).html(css));
        }
    }


    $(window).on("message", function(ev) {
        // Remove 127.0.0.1 after testing
        var origin = ev.origin || ev.originalEvent.origin;

        if (origin !== "https://secure.acuityscheduling.com" && origin !== "https://staging.acuityscheduling.com" && origin !== 'http://127.0.0.1' && origin !== 'http://10.16.7.11' && origin !== 'http://192.168.1.66') {
            return;
        }

        var data = ev.originalEvent.data;
        if (typeof data.split != 'function') {
            return;
        }
        var parts = data.split(':');

        if (parts.length < 2 || parts[0] != 'acuity') {
            return;
        }

        var action = parts[1];
        var settings = {};

        if (parts.length>2) {
            try {
                parts.shift();
                parts.shift();
                settings = JSON.parse(parts.join(':'));
            } catch (ex) {
                // ...
            }
        }

        handleMessage(action, settings);
    });
})();
Acuity.Recurring = (function () {
    var currentDate;
    var currentReadableDate;
    var currentTime;
    var currentReadableTime;

    function incrementDate(d, recurType, weekdayOfMonth)
    {
        var originalDate = d.getUTCDate();

        if (recurType=='daily') {
            d.setUTCDate(d.getUTCDate()+1);
        } else if (recurType=='weekly') {
            d.setUTCDate(d.getUTCDate()+7);
        } else if(recurType=='biweekly') {
            d.setUTCDate(d.getUTCDate()+14);
        } else if(recurType=='triweekly') {
            d.setUTCDate(d.getUTCDate()+21);
        } else if(recurType=='monthly') {
            d.setUTCMonth(d.getUTCMonth()+1);
            if (d.getUTCDate() != originalDate) {
                d.setUTCDate(originalDate);
            }
        } else if(recurType=='quadweekly') {
            d.setUTCDate(d.getUTCDate()+28);
        } else if (recurType=='monthly-day') {
            // i.e. 3rd Saturday of every month
            var weekday = d.getUTCDay();

            // go to the first of next month
            d.setUTCMonth(d.getUTCMonth()+1);
            d.setUTCDate(1);
            var weekdayOfFirst = d.getUTCDay();

            // now go ahead...
            if (weekdayOfFirst>weekday) weekday += 7;
            d.setUTCDate(weekdayOfMonth*7 + (weekday-weekdayOfFirst) + 1);
        }

        return d;
    }


    function addCustomRecurringTime(fnAddDate)
    {
        var d = dateObjectFromString(currentDate);
        var dReadable = dateObjectFromString(currentReadableDate);

        var recurType = $('#recur-type').val();

        var weekdayOfMonth = parseInt( (d.getUTCDate()-1)/7);

        for(var i=0; i<$('#recur-times').val(); ++i) {
            rd = ''+d.getUTCFullYear()+'-'+(d.getUTCMonth()+1)+'-'+d.getUTCDate();
            rdReadble = ''+dReadable.getUTCFullYear()+'-'+(dReadable.getUTCMonth()+1)+'-'+dReadable.getUTCDate();
            fnAddDate(rd, rdReadble);

            d = incrementDate(d, recurType, weekdayOfMonth);
            dReadable = incrementDate(dReadable, recurType, weekdayOfMonth);
        }
    }

    function updateRecurringTime(startDate, startTime) {
        var weekday= FriendlyDates.weekday;
        var months = FriendlyDates.months;
        var dateEnding = FriendlyDates.dateEnding;

        var p = startDate.split('-');
        var date = new Date(p[0], p[1]-1, p[2], (-(new Date().getTimezoneOffset())/60)+1, 0, 0, 0);
        var dow = weekday[date.getUTCDay()];

        var weekdayOfMonth = parseInt( (date.getUTCDate()-1) /7)+1;

        $('#recur-weekly').text('Every '+dow);
        $('#recur-biweekly').text('Every other '+dow);
        $('#recur-triweekly').text('Every third '+dow);
        $('#recur-quadweekly').text('Every fourth '+dow);
        $('#recur-monthly').text('The '+date.getUTCDate()+dateEnding[date.getUTCDate()]+' of every month');
        $('#recur-monthly-day').text('The '+weekdayOfMonth+dateEnding[weekdayOfMonth]+' '+dow+' of every month');

        $('.recur-time').text(startTime.toLowerCase());
        $('.recur-start').text(formatDateForHuman(date));
    }

    function initRecurring($container)
    {
        updateRecurringTime(currentReadableDate, currentReadableTime);

        $container.find('.btn-additional').click(function (ev) {
            Acuity.PickAppointment.addSelectedTime(currentDate, currentTime, currentReadableTime, false/*dontShowRemove*/, currentReadableDate);
            Popup.hide();
        });

        $('#add-recur-times').click(function (ev){
            addCustomRecurringTime(function (date, readableDate){
                // okie dokie, add it to the list!
                Acuity.PickAppointment.addSelectedTime(date, currentTime, currentReadableTime, false/*dontShowRemove*/, readableDate);
            });

            Popup.hide();

            // now scroll to make sure the "Continue >>" button is in view
            var $el = $('#selected-times-container');
            $('body, html').animate({ scrollTop: $el.offset().top+'px' }, 150);
        });

        // Focus on an input so that wierd nested scrolling works ok
        $('#recur-type').focus();
    }


    function showPopup()
    {
        // First part of the system time is the system date
        currentDate = Acuity.PickAppointment.getBusinessDate();
        currentReadableDate = Acuity.PickAppointment.getReadableDate();
        currentTime = Acuity.PickAppointment.getTime();
        currentReadableTime = Acuity.PickAppointment.getReadableTime();

        Popup.showHtml($('#recurring-template').html(), initRecurring);
    }

    return {
        showPopup: showPopup
    }
})();