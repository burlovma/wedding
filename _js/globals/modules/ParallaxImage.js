/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');

/**
 * Parallax image
 */
class FullWidthParallax {
    /*
     * Creates FullWidthParallax object
     * @param {obj} elem - parallax container object
     */
    constructor(elem, topMargin = 0, supports3d = true) {
        let fwi;

        this.maxWidth = 480; // want it on mobile too? yes and no

        this.imgCont = elem;

        this.supports3d = supports3d;

        fwi = elem.getElementsByClassName('full-width-image');

        this.img = fwi ? fwi[0].getElementsByTagName('img') : [];
        this.topVal = 0;
        this.longPage = false;
        this.isBanner = Helper.hasClass(elem, 'page-banner');
        this.toTop = Helper.hasClass(elem, 'image-to-top');
        this.centered = 0;
        if (this.img.length) {
            // there are images, so set as first
            this.img = this.img[0];
            this.topMargin = topMargin;

            window.addEventListener('scroll', () => {
                this.runOnScroll();
            });
            window.addEventListener('resize', () => {
                this.runOnResize();
            });
            window.addEventListener('load', () => {
                this.runOnResize();
            });

            this.runOnResize();
        }
    }

    // add css prefixes
    setStyle(el, prop, val) {
        var uc = prop.substr(0, 1).toUpperCase() + prop.substr(1);
        el.style['Webkit' + uc] = val;
        el.style['Moz' + uc] = val;
        el.style['ms' + uc] = val;
        el.style['O' + uc] = val;
        el.style[prop] = val;
    }

    /**
     * Get updated window dimensions and update right column box if switched
     * between desktop and mobile
     */
    runOnResize() {
        var de = document.documentElement,
            maxPos,
            absTop,
            minTop;

        this.imgH = this.img.clientHeight;
        this.contH = this.imgCont.clientHeight;
        this.centered = Math.round(this.imgH - this.contH) / -2;
        this.winW = Math.max(de.clientWidth, window.innerWidth || 0);
        this.winH = Math.max(de.clientHeight, window.innerHeight || 0);

        if (this.toTop || !this.isBanner || this.centered >= 0)
            this.centered = 0;

        // if desktop size and container visible
        if (this.winW > this.maxWidth && this.contH > 0) {

            // top position of container, when touching bottom of viewport
            maxPos = this.winH - this.contH;

            // top position of image within container at lowest point
            absTop = Math.round((this.topMargin - maxPos) / 2);

            // lowest value for top of image
            minTop = this.contH - this.imgH;

            // image does not stay within bounds, with standard calculation (taller viewport)
            this.longPage = (absTop < minTop);
            this.runOnScroll();

        // else if mobile size reset image to top
        } else if (this.topVal !== this.centered && this.contH > 0) {

            if (this.supports3d) {
                this.setStyle(
                    this.img,
                    'transform',
                    `translate3d(0, ${this.centered}px, 0)`
                );
            } else {
                this.img.style.top = `${this.centered}px`;
            }
            this.topVal = this.centered;
        }
    }

    /*
     * Called using onscroll event
     * Checks if scrolled up or down, then calls setPosition
     */
    runOnScroll() {
        var viewPos = this.imgCont.getBoundingClientRect(),
            imgContPos = this.topMargin - viewPos.top,
            imgTop = Math.round(imgContPos / 2),
            minView = this.winH - viewPos.top,
            pPos,
            minPos,
            minTop = this.contH - this.imgH,
            percent;

        // do nothing if it's a smaller window or not in view
        if (this.winW > this.maxWidth && minView > 0 && imgContPos <= this.contH) {

            if (this.longPage && !this.isBanner) {

                // percent container has moved within viewport (between top margin and bottom of screen)
                percent = (viewPos.top - this.topMargin) * 100;
                percent = percent / (this.winH - this.contH - this.topMargin);

                // apply percent to top position of image (based on min top value)
                imgTop = percent * minTop / 100;

            } else if (this.isBanner) {

                pPos = window.pageYOffset || document.documentElement.scrollTop;
                minPos = this.topMargin - (pPos + viewPos.top);
                imgTop -= Math.round(minPos / 2);
            }

            imgTop += this.centered;

            imgTop = (imgTop < this.centered && this.isBanner) ?
                this.centered :
                imgTop;

            if (this.supports3d) {
                this.setStyle(
                    this.img,
                    'transform',
                    `translate3d(0, ${imgTop}px, 0)`
                );
            } else {
                this.img.style.top = `${imgTop}px`;
            }
            this.topVal = imgTop;
        } else if (this.topVal !== this.centered) {

            if (this.supports3d) {
                this.setStyle(
                    this.img,
                    'transform',
                    `translate3d(0, ${this.centered}px, 0)`
                );
            } else {
                this.img.style.top = `${this.centered}px`;
            }
            this.topVal = this.centered;
        }
    }

};

class ParallaxImage {

    /*
     * Creates FullWidthParallax object(s)
     * @param {int} topMargin - margin to top of full width image object
     * (optional since FullWidthParallax class defaults it to 0)
     */
    constructor(topMargin) {
        let banners = document.querySelectorAll('.parallax-image'),
            supports3d = this.caniuse();

        banners.forEach(banner => {
            new FullWidthParallax(banner, topMargin, supports3d);
        });
    }

    // caniuse xD
    caniuse() {
        let el = document.createElement('div'),
            supports3d,
            val = 'translate3d(0px, 0px, 0px)';

        el.style.WebkitTransform = val;
        el.style.MozTransform = val;
        el.style.msTransform = val;
        el.style.OTransform = val;
        el.style.transform = val;

        supports3d = el.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);

        this.supports3d = (supports3d && supports3d.length === 1);
    }

};

export default ParallaxImage;