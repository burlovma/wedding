/*jshint esversion: 6 */ /* ignore unnecessary semicolon */
/*global require*/

var Helper = require('./Helper');

class Validity {

    constructor(form, submit = '', normalSubmit = false) {
        let context = this;

        context.validationFn = typeof form.checkValidity === 'function' ?
            function(el) { return el.checkValidity(); } :
            function(el) { return context.isValid(el); };

        Array.from(form.elements).forEach(el => {
            this.addListeners(el);
        });

        form.validate = function() {
            let i = 0,
                invalid = 0,
                len;

            // check all items once more on submit
            Array.from(this.elements).forEach(el => {
                console.log(`validating once more? ${el}`);
                if (!context.markField(context.validationFn(el), el))
                    invalid++;
            });

            if (invalid > 0) return false;

            // if you've gotten to this point, the form is good to go
            if (normalSubmit)
                this.submit();
            else
                return true;
        };

        form.onsubmit = submit || function () {
            if (!this.validate()) return false;
        };
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