/*jshint esversion: 6 */
/*global require*/

const ATTR = 'data-lazy-load-src',
      LOADED_CLASS = 'lazy-loaded',
      SELECTOR = `img[${ATTR}]`;

var Helper = require('Helper');

class LazyLoadImages {

    constructor(point = '.gallery') {
        this.point = point;
        this.loaded = false;

        window.addEventListener('scroll', () => { this.loadImages(); });
    }

    loadImages() {
        let bounds = document.querySelector(this.point).getBoundingClientRect(),
            images = document.querySelectorAll(SELECTOR);

        // if scrolled to section and not yet loaded
        if (bounds.top <= window.innerHeight + 200 &&
            !this.loaded) {

            images.forEach(img => {
                this.makeImage(img);
                Helper.addClass(img, LOADED_CLASS);
            });

            this.loaded = true;

        }

    }

    makeImage(el) {
        let newImage = new Image(),
            newSrc = el.getAttribute(ATTR);

        newImage.onload = function() {
            el.setAttribute('src', newSrc);
        };

        newImage.setAttribute('src', newSrc);
    }

    inView(el) {
        let de = document.documentElement,
            w = window,
            viewport = {
                top : w.pageYOffset || de.scrollTop,
                left : w.pageXOffset || de.scrollLeft
            },
            { top, right, bottom, left } = el.getBoundingClientRect();

        viewport.right = viewport.left + w.innerWidth;
        viewport.bottom = viewport.top + w.innerHeight;

        // console.log(`viewport.right ${viewport.right} < left ${left}... ${viewport.right < left}`);
        // console.log(`viewport.left ${viewport.left} > right ${right}... ${viewport.left > right}`);
        // console.log(`viewport.bottom ${viewport.bottom} < top ${top}... ${viewport.bottom < top}`);
        // console.log(`viewport.top ${viewport.top} > bottom ${bottom}... ${viewport.top > bottom}`);

        return (!(viewport.right < left || viewport.left > right || viewport.bottom < top || viewport.top > bottom));
    }

}

export default LazyLoadImages;