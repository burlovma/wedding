require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion: 6 */ /* ignore unnecessary semicolon */
/*global require*/

var Helper = require('./Helper');

var Validity = function () {
    function Validity(form) {
        var _this = this;

        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, Validity);

        Array.prototype.slice.call(form.elements).forEach(function (el) {
            _this.addListeners(el);
        });

        form.onsubmit = function (e) {
            var invalid = 0;

            e.preventDefault();

            // check all items once more on submit
            Array.prototype.slice.call(form.elements).forEach(function (el) {
                if (!_this.markField(_this.validationFn(el), el)) invalid++;
            });

            return invalid > 0 ? false : callback ? callback() : form.submit();
        };
    }

    _createClass(Validity, [{
        key: 'validationFn',
        value: function validationFn(el) {
            return el.checkValidity() || this.isValid(el);
        }
    }, {
        key: 'addListeners',
        value: function addListeners(el) {
            var context = this;

            el.addEventListener('blur', function () {
                var valid = this.required ? context.validationFn(this) : true;

                context.markField(valid, this);
            }, false);
        }
    }, {
        key: 'markField',
        value: function markField(valid, el) {
            if (!valid) {
                el.setCustomValidity('');

                Helper.addClass(el, 'invalid');

                return false;
            } else {
                if (Helper.hasClass(el, 'invalid')) Helper.removeClass(el, 'invalid');
            }

            return true;
        }
    }, {
        key: 'isValid',
        value: function isValid(el) {
            if (el.getAttribute('type') === 'email') {

                return !this.isEmpty(el) && this.validateEmail(el) && !this.isPlaceholder(el);
            } else if (el.getAttribute('type') === 'tel') {

                return !this.isEmpty(el) && this.validatePhone(el) && !this.isPlaceholder(el);
            } else if (el.getAttribute('type') === 'url') {

                return !this.isEmpty(el) && this.validateUrl(el) && !this.isPlaceholder(el);
            } else if (el.getAttribute('type') === 'checkbox') {

                return this.validateCheckbox(el);
            } else {
                return !this.isEmpty(el) && !this.isPlaceholder(el);
            }
        }
    }, {
        key: 'validateEmail',
        value: function validateEmail(el) {
            // http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
            return (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(el.value)
            );
        }
    }, {
        key: 'validatePhone',
        value: function validatePhone(el) {
            return (/^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(el.value)
            );
        }
    }, {
        key: 'validateUrl',
        value: function validateUrl(el) {
            // http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
            return (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gi.test(el.value)
            );
        }
    }, {
        key: 'validateCheckbox',
        value: function validateCheckbox(el) {
            return el.checked;
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty(el) {
            return el.value.length === 0 || !el.value.trim();
        }
    }, {
        key: 'isPlaceholder',
        value: function isPlaceholder(el) {
            return el.getAttribute('placeholder') && el.value === el.getAttribute('placeholder');
        }
    }]);

    return Validity;
}();

exports.default = Validity;
module.exports = exports['default'];

},{"./Helper":"Helper"}],2:[function(require,module,exports){
'use strict';

/*global document, window, require*/

var Helper = require('Helper'),
    Validate = require('./globals/modules/Validate');

(function () {
    'use strict';

    var form = document.forms['rsvp-form'],
        toggleRow = document.querySelector('.field-row.expandable');

    function callback() {
        var elems = form.elements,
            msg = 'new rsvp!\n\n';

        msg += 'from: ' + elems.invitee_name.value + ' (email: ' + elems.invitee_email.value + ')\n\n';

        if (elems.not_coming.checked) msg += '\n\nparty pooper: true\n\n';else msg += 'food selected: ' + elems.invitee_food.value;

        if (elems.plus_one.checked) {
            msg += '\n\nguest info:\n\n' + elems.guest_name.value + '\n\n';
            msg += 'food selected: ' + elems.guest_food.value + '\n\n';
        }

        msg += 'personal message: ' + elems.message.value;

        window.open('mailto:brettandmelissanolf@gmail.com?subject=RSVP&body=' + encodeURIComponent(msg));
        // location.href = '/rsvp/';

        Helper.addClass(document.querySelector('.rsvp-form'), 'hidden');
        Helper.removeClass(document.querySelector('.thanks'), 'hidden');

        if (elems.not_coming.checked) document.querySelector('.text').textContent = 'Sorry we won\'t see you on June 2nd.';else document.querySelector('.text').textContent = 'Can\'t wait to see you on June 2nd!';
    }

    if (form) {
        form.elements.plus_one.addEventListener('click', function () {
            var el = void 0,
                guest = form.elements.guest_name,
                guestFood = form.elements.guest_food,
                msg = form.elements.message;

            Helper.toggleClass(toggleRow, 'hide');

            guest.required = guest.required ? false : true;
            guestFood.required = guestFood.required ? false : true;

            if (Helper.hasClass(guest, 'invalid')) Helper.removeClass(guest, 'invalid');

            el = guest.required ? guest : msg;

            el.focus();
        });

        new Validate(form, callback);
    }
})();

},{"./globals/modules/Validate":1,"Helper":"Helper"}],"Helper":[function(require,module,exports){
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

},{}]},{},[2]);
