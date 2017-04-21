/*global document, window, require*/

var Helper = require('Helper');

(function() {
    'use strict';

    var form = document.forms['rsvp-form'],
        toggleRow = document.querySelector('.field-row.expandable');

    if (form) {
        form.elements.plus_one.addEventListener(
            'click',
            function() {
                Helper.toggleClass(toggleRow, 'hide');
            },
            false
        );
    }

})();