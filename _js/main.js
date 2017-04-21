/*global document, window, require*/

var Helper = require('Helper');

(function() {
    'use strict';

    var btn = document.querySelector('header .menu-btn a'),
        header = document.getElementsByTagName('header')[0],
        open,
        overlay = document.querySelector('.overlay');

    if (overlay) {
        open = document.getElementById('open');

        open.addEventListener(
            'click',
            function(e) {
                e.preventDefault();

                Helper.addClass(overlay, 'visible');
            },
            false
        );

        overlay.addEventListener(
            'click',
            function(e) {

                if (Helper.hasClass(e.target, 'overlay') ||
                    Helper.hasClass(e.target, 'o-container') ||
                    Helper.hasClass(e.target, 'close-overlay') ||
                    Helper.hasClass(e.target, 'fa-times')) {
                    e.preventDefault();
                    Helper.removeClass(overlay, 'visible');
                }
            },
            false
        );
    }

    btn.addEventListener(
        'click',
        function(e) {
            e.preventDefault();

            Helper.toggleClass(header, 'open');
        },
        false
    );

})();