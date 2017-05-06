require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*global document, window, require, YT*/

/*jshint esversion: 6 */

var Helper = require('Helper');

(function () {
    'use strict';

    var heart = document.querySelector('.you-make-my-heart-skip-a-beat'),
        heartClicks = 0,
        overlay = document.querySelector('.overlay'),
        player = void 0;

    if (overlay) {
        var keys = [],
            konami = "38,38,40,40,37,39,37,39,66,65";

        window.addEventListener('keydown', function (e) {
            keys.push(e.keyCode);

            if (keys.toString().indexOf(konami) >= 0) openOverlay();
        });

        heart.addEventListener('click', function () {
            heartClicks++;
            heartBeat();

            if (heartClicks === 10) openOverlay();
        });

        overlay.addEventListener('click', function (e) {

            if (Helper.hasClass(e.target, 'overlay') || Helper.hasClass(e.target, 'overlay-inner') || Helper.hasClass(e.target, 'close-overlay') || Helper.hasClass(e.target, 'fa-window-close-o')) {
                e.preventDefault();

                keys = [];

                player.pauseVideo();

                Helper.removeClass(overlay, 'visible');
            }
        });
    }

    function heartBeat() {
        heart.style.fontSize = '2em';

        setTimeout(function () {
            heart.style.fontSize = '1em';
        }, 250);
    }

    function openOverlay() {
        Helper.addClass(overlay, 'visible');

        heartClicks = 0;

        if (!document.getElementById('yt-script')) constructPlayer();else player.playVideo();
    }

    function constructPlayer() {
        var firstScriptTag = void 0,
            tag = document.createElement('script');

        tag.id = 'yt-script';
        tag.src = 'https://www.youtube.com/iframe_api';

        firstScriptTag = document.getElementsByTagName('script')[0];

        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    /**
     * This function creates an <iframe> (and YouTube player)
     * after the API code downloads.
     * 
     * needs to be global - attached to window
     */
    window.onYouTubeIframeAPIReady = function () {
        var bounds = void 0,
            container = overlay.querySelector('.yt-container');

        bounds = container.getBoundingClientRect();

        player = new YT.Player('player', {
            height: Math.round(bounds.height),
            width: Math.round(bounds.width),
            videoId: '3H6amDbAwlY', // tequila!
            // videoId: 'dQw4w9WgXcQ', // never gonna give you up
            // videoId: 'JnsV87X26DI', // sexual harrassment panda
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    // The API will call this function when the video player is ready.
    function onPlayerReady(e) {
        e.target.playVideo();
    }

    // The API calls this function when the player's state changes.
    function onPlayerStateChange(e) {
        if (e.data == YT.PlayerState.ENDED) player.stopVideo();
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
