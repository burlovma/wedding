/*global document, window, require*/

var Helper = require('Helper');

(function() {
    'use strict';

    let people = document.querySelectorAll('.party-person.hide'),
        unseen = document.querySelectorAll('.unseen'),
        w = window;

    if (people && w.innerWidth >= 768)
        w.addEventListener('scroll', onScroll);

    w.addEventListener('resize', () => {
        if (people && w.innerWidth >= 768)
            w.addEventListener('scroll', onScroll);
    });

    function onScroll() {
        people.forEach(item => {

            if (inView(item)) {

                show(item);

                unseen = document.querySelectorAll('.unseen');
                people = document.querySelectorAll('.party-person.hide');
            }
        });

        if (!unseen.length)
            w.removeEventListener('scroll', onScroll);
    }

    function inView(el) {
        let bounds = el.getBoundingClientRect(),
            heightRestriction = w.innerHeight - (bounds.height / 2),
            vTop = w.pageYOffset || document.documentElement.scrollTop,
            vBottom = vTop + w.innerHeight;

        return (bounds.top < vBottom && bounds.top < heightRestriction) ||
               (bounds.bottom < vTop && bounds.bottom < heightRestriction);
    }

    function show(parent) {
        let items = parent.children;

        Helper.removeClass(parent, 'hide');

        Array.from(items).forEach(item => {
            Helper.removeClass(item, 'unseen');
            Helper.addClass(item, 'seen');
        });

    }

    onScroll();

})();