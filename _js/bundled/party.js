require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*global document, window, require*/

var Helper = require('Helper');

(function () {
    'use strict';

    var people = document.querySelectorAll('.party-person.hide'),
        unseen = document.querySelectorAll('.unseen'),
        w = window;

    onScroll();
    w.addEventListener('scroll', onScroll);

    function onScroll() {
        people.forEach(function (item) {

            if (inView(item)) {

                show(item);

                unseen = document.querySelectorAll('.unseen');
                people = document.querySelectorAll('.party-person.hide');
            }
        });

        if (!unseen.length) w.removeEventListener('scroll', onScroll);
    }

    function inView(el) {
        var bounds = el.getBoundingClientRect(),
            heightRestriction = w.innerHeight - bounds.height / 2,
            vTop = w.pageYOffset || document.documentElement.scrollTop,
            vBottom = vTop + w.innerHeight;

        return bounds.top < vBottom && bounds.top < heightRestriction || bounds.bottom < vTop && bounds.bottom < heightRestriction;
    }

    function show(parent) {
        var items = parent.children;

        Helper.removeClass(parent, 'hide');

        Array.prototype.slice.call(items).forEach(function (item) {
            Helper.removeClass(item, 'unseen');
            Helper.addClass(item, 'seen');
        });
    }
})();

},{"Helper":"Helper"}],"Helper":[function(require,module,exports){
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
