/*global document, window, require*/

var Helper = require('Helper');

(function() {
    'use strict';

    document.querySelector('header .menu-btn a').addEventListener(
        'click',
        (e) => {
            e.preventDefault();

            Helper.toggleClass(
                document.getElementsByTagName('header')[0],
                'open'
            );
        }
    );

})();