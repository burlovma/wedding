/*global document, window, require*/

var Helper = require('Helper'),
    Validate = require('./globals/modules/Validate');

(function() {
    'use strict';

    var form = document.forms['rsvp-form'],
        toggleRow = document.querySelector('.field-row.expandable');

    if (form) {
        form.elements.plus_one.addEventListener(
            'click',
            () => {
                let el,
                    guest = form.elements.guest_name,
                    guestFood = form.elements.guest_food,
                    msg = form.elements.message;

                Helper.toggleClass(toggleRow, 'hide');

                guest.required = guest.required ? false : true;
                guestFood.required = guestFood.required ? false : true;

                if (Helper.hasClass(guest, 'invalid'))
                    Helper.removeClass(guest, 'invalid');

                el = guest.required ? guest : msg;

                el.focus();
            }
        );

        new Validate(form);
    }

})();