/*global document, window, require*/

// var Lazy = require('./globals/modules/LazyLoadImages');
var Lazy = require('lazy-load-images');

(function() {
    'use strict';

    // new Lazy();

    Lazy.init();

    window.addEventListener('scroll', () => {
        Lazy.refresh();
    });

})();