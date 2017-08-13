/*jshint esversion: 6 */ /* ignore unnecessary semicolon */
/*global require*/

var Helper = require('./Helper');

class Validity {

    constructor(form, callback = null) {

        Array.prototype.slice.call(form.elements).forEach(el => {
            this.addListeners(el);
        });

        form.onsubmit = e => {
            let invalid = 0;

            e.preventDefault();

            // check all items once more on submit
            Array.prototype.slice.call(form.elements).forEach(el => {
                if (!this.markField(this.validationFn(el), el)) invalid++;
            });

            return (invalid > 0) ?
                false :
                callback ? callback() : form.submit();
        };
    }

    validationFn(el) {
        return el.checkValidity() || this.isValid(el);
    }

    addListeners(el) {
        let context = this;

        el.addEventListener(
            'blur',
            function() {
                let valid = this.required ? context.validationFn(this) : true;

                context.markField(valid, this);
            },
            false
        );

    }

    markField(valid, el) {
        if (!valid) {
            el.setCustomValidity('');

            Helper.addClass(el, 'invalid');

            return false;
        } else {
            if (Helper.hasClass(el, 'invalid'))
                Helper.removeClass(el, 'invalid');
        }

        return true;
    }

    isValid(el) {
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

    validateEmail(el) {
        // http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(el.value);
    }

    validatePhone(el) {
        return /^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(el.value);
    }

    validateUrl(el) {
        // http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gi.test(el.value);
    }

    validateCheckbox(el) {
        return el.checked;
    }

    isEmpty(el) {
        return el.value.length === 0 || !el.value.trim();
    }

    isPlaceholder(el) {
        return el.getAttribute('placeholder') && el.value === el.getAttribute('placeholder');
    }

}

export default Validity;