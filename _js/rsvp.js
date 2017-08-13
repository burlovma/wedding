/*global document, window, require*/

var Helper = require('Helper'),
    Validate = require('./globals/modules/Validate');

(function() {
    'use strict';

    var form = document.forms['rsvp-form'],
        toggleRow = document.querySelector('.field-row.expandable');

    function callback() {
        let elems = form.elements,
            msg = 'new rsvp!\n\n';

        msg += `from: ${elems.invitee_name.value} (email: ${elems.invitee_email.value})\n\n`;

        if (elems.not_coming.checked)
            msg += '\n\nparty pooper: true\n\n';
        else
            msg += `food selected: ${elems.invitee_food.value}`;

        if (elems.plus_one.checked) {
            msg += `\n\nguest info:\n\n${elems.guest_name.value}\n\n`;
            msg += `food selected: ${elems.guest_food.value}\n\n`;
        }

        msg += `personal message: ${elems.message.value}`;

        window.open(`mailto:brettandmelissanolf@gmail.com?subject=RSVP&body=${encodeURIComponent(msg)}`);
        // location.href = '/rsvp/';

        Helper.addClass(document.querySelector('.rsvp-form'), 'hidden');
        Helper.removeClass(document.querySelector('.thanks'), 'hidden');

        if (elems.not_coming.checked)
            document.querySelector('.text').textContent = `Sorry we won't see you on June 2nd.`;
        else
            document.querySelector('.text').textContent = `Can't wait to see you on June 2nd!`;
    }

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

        new Validate(form, callback);
    }

})();