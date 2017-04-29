require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*global document, window, require*/

// var Lazy = require('./globals/modules/LazyLoadImages');
var Lazy = require('lazy-load-images');

(function () {
    'use strict';

    // new Lazy();

    Lazy.init();

    window.addEventListener('scroll', function () {
        Lazy.refresh();
    });
})();

},{"lazy-load-images":2}],2:[function(require,module,exports){
"use strict";

var liveOnStage = require('live-on-stage'),
    
    ATTR = 'data-lazy-load-src',
    SELECTOR = 'img[' + ATTR + ']',
    LAZY_LOADED = 'lazy-loaded',

    /*
        Add lazy-loaded class
        
        @param [DOM]: Element to show
    */
    addLoadedClass = function (element) {
        if (element.classList) {
            element.classList.add(LAZY_LOADED);
        } else {
            element.className += ' ' + LAZY_LOADED;
        }
    };

module.exports = {

    /*
        Initialise lazy load
    */
    init: function () {
        liveOnStage.track(
            SELECTOR,
            function (element) {
                var src = element.getAttribute(ATTR);

                element.addEventListener('load', function () {
                    addLoadedClass(element);
                });
                
                if (element.complete) {
                    addLoadedClass(element);
                }
                
                element.setAttribute('src', src);
                
                return true;
            }
        );
    },
    
    /*
        Refresh selection
    */
    refresh: function () {
        liveOnStage.refresh(SELECTOR);
    }
};
},{"live-on-stage":3}],3:[function(require,module,exports){
"use strict";

var cache = require('./utils/cache.js'),
    cacheElements = require('./utils/cache-elements.js'),
    notify = require('./utils/notify.js'),
    viewport = require('./utils/viewport.js'),
    
    resizeComplete, // Resize complete timer
    
    liveOnStage = {
    
        /*
            Check element's onScreen position
        */
        check: function () {
            viewport.update();

            for (var key in cache) {
                if (cache.hasOwnProperty(key)) {
                    this.checkCache(key);
                }
            }
        },
        
        /*
            Check individual cache
            
            @param [object]: Cache to check
        */
        checkCache: function (key) {
            var thisCache = cache[key];

            thisCache.elements.forEach(function (element, i) {
                var elementIsOnStage = viewport.checkOnStage(element),
                    stopTracking = false;

                // If element is on stage and previously wasn't, fire onstage event
                if (elementIsOnStage && !element.isOnStage) {
                    stopTracking = notify(element, true, thisCache.onStage);
                
                // If element isn't on stage and previously was, fire offstage event
                } else if (!elementIsOnStage && element.isOnStage) {
                    stopTracking = notify(element, false, thisCache.offStage);
                }
                
                if (stopTracking) {
                    element.dom.setAttribute('data-stop-tracking', true);
                    delete thisCache.elements[i];
                }
            });
        },
    
        /*
            Refresh cached elements
            
            @param [string] (optional): Name of cache to refresh
        */
        refresh: function (selector) {
            // If an attribute has been provided, refresh that cache
            if (cache[selector]) {
                this.track(selector, cache[selector].onStage, cache[selector].offStage);
                
            // Or refresh all caches
            } else {
                for (var key in cache) {
                    if (cache.hasOwnProperty(key)) {
                        this.track(key, cache[key].onStage, cache[key].offStage);
                    }
                }
            }
        },
        
        /*
            Track elements
            
            @param [string || NodeList]: CSS selector or DOM selection
            @param [function]: Function to call when element appears on stage
            @param [function]: Function to call when element leaves stage
        */
        track: function (selector, onStage, offStage) {
            var trackElements = (typeof selector == 'string') ? document.querySelectorAll(selector) : selector;
            
            if (trackElements.length) {
                viewport.update();

                cache[selector] = {
                    elements: cacheElements(trackElements),
                    onStage: onStage,
                    offStage: offStage
                };
                
                this.check();
            }
        }
    };

// Check all cached elements every time the viewport changes position
window.addEventListener('scroll', function () { liveOnStage.check(); });

// Refresh position of all elements when the screen resizes
window.addEventListener('resize', function () {
    clearTimeout(resizeComplete);

    resizeComplete = setTimeout(function () {
        liveOnStage.refresh();
    }, 200);
});

module.exports = liveOnStage;

},{"./utils/cache-elements.js":4,"./utils/cache.js":5,"./utils/notify.js":6,"./utils/viewport.js":7}],4:[function(require,module,exports){
"use strict";

var viewport = require('./viewport.js');

module.exports = function (elements) {
    var elementArray = [];

    [].slice.call(elements).forEach(function (element) {
        var rect = element.getBoundingClientRect(),
            buffer = element.getAttribute('data-buffer');
            
        if (element.getAttribute('data-stop-tracking') !== 'true') {
            elementArray.push({
                dom: element,
                isOnStage: false,
                buffer: parseInt(buffer) || 0,
                top: rect.top + viewport.top,
                left: rect.left + viewport.left,
                bottom: rect.bottom + viewport.top,
                right: rect.right + viewport.left
            });
        }
    });
    
    return elementArray;
};
},{"./viewport.js":7}],5:[function(require,module,exports){
module.exports = {};
},{}],6:[function(require,module,exports){
"use strict";

/*
    Notify DOM element of new onScreen status
*/
module.exports = function (element, isOnStage, callback) {
    element.isOnStage = isOnStage;

    if (callback) {
        return (callback(element.dom));
    }
};
},{}],7:[function(require,module,exports){
"use strict";

var docElement = document.documentElement;

module.exports = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    
    /*
        Update viewport measurements
    */
    update: function () {
        this.top = document.body.scrollTop;
        this.left = document.body.scrollLeft;
        this.bottom = this.top + docElement.clientHeight;
        this.right = this.left + docElement.clientWidth;
    },
    
    /*
        Check if element is within viewport
        
        @param [object]: Cached element
    */
    checkOnStage: function (element) {
        var buffer = element.buffer;
    
        return !(
            this.bottom < (element.top - buffer) || // Element off bottom
            this.top > (element.bottom + buffer) || // Element off top
            this.left > (element.right + buffer) || // Element off left
            this.right < (element.left - buffer)    // Element off right
        );
    }
};
},{}],"Helper":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = function () {
    function Helper() {
        _classCallCheck(this, Helper);
    }

    _createClass(Helper, null, [{
        key: 'hasClass',
        value: function hasClass(el, className) {
            if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        }
    }, {
        key: 'addClass',
        value: function addClass(el, className) {
            if (el.classList) el.classList.add(className);else if (!this.hasClass(el, className)) el.className += ' ' + className;
        }
    }, {
        key: 'removeClass',
        value: function removeClass(el, className) {
            if (el.classList) el.classList.remove(className);else if (this.hasClass(el, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                el.className = el.className.replace(reg, ' ');
            }
        }
    }, {
        key: 'toggleClass',
        value: function toggleClass(el, className) {
            if (this.hasClass(el, className)) this.removeClass(el, className);else this.addClass(el, className);
        }
    }]);

    return Helper;
}();

;

exports.default = Helper;
module.exports = exports['default'];

},{}]},{},[1]);
