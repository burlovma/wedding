/*global document, window, require, YT*/

/*jshint esversion: 6 */

var Helper = require('Helper');

(function() {
    'use strict';

    let heart = document.querySelector('.you-make-my-heart-skip-a-beat'),
        heartClicks = 0,
        overlay = document.querySelector('.overlay'),
        player;

    if (overlay) {
        let keys = [],
            konami = "38,38,40,40,37,39,37,39,66,65";

        window.addEventListener('keydown', (e) => {
            keys.push(e.keyCode);

            if (keys.toString().indexOf(konami) >= 0) openOverlay();
        });

        heart.addEventListener('click', () => {
            heartClicks++;
            heartBeat();

            if (heartClicks === 10) openOverlay();
        });

        overlay.addEventListener(
            'click',
            (e) => {

                if (Helper.hasClass(e.target, 'overlay') ||
                    Helper.hasClass(e.target, 'overlay-inner') ||
                    Helper.hasClass(e.target, 'close-overlay') ||
                    Helper.hasClass(e.target, 'fa-window-close-o')) {
                    e.preventDefault();

                    keys = [];

                    player.pauseVideo();

                    Helper.removeClass(overlay, 'visible');
                }
            }
        );
    }

    function heartBeat() {
        heart.style.fontSize = '2em';

        setTimeout(() => {
            heart.style.fontSize = '1em';
        }, 250);
    }

    function openOverlay() {
        Helper.addClass(overlay, 'visible');

        heartClicks = 0;

        if (!document.getElementById('yt-script'))
            constructPlayer();
        else
            player.playVideo();
    }

    function constructPlayer() {
        let firstScriptTag,
            tag = document.createElement('script');

        tag.id = 'yt-script';
        tag.src = 'https://www.youtube.com/iframe_api';

        firstScriptTag = document.getElementsByTagName('script')[0];

        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    /**
     * This function creates an <iframe> (and YouTube player)
     * after the API code downloads.
     * 
     * needs to be global - attached to window
     */
    window.onYouTubeIframeAPIReady = function() {
        let bounds,
            container = overlay.querySelector('.yt-container');

        bounds = container.getBoundingClientRect();

        player = new YT.Player('player', {
            height: Math.round(bounds.height),
            width: Math.round(bounds.width),
            videoId: '3H6amDbAwlY', // tequila!
            // videoId: 'dQw4w9WgXcQ', // never gonna give you up
            // videoId: 'JnsV87X26DI', // sexual harrassment panda
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    // The API will call this function when the video player is ready.
    function onPlayerReady(e) {
        e.target.playVideo();
    }

    // The API calls this function when the player's state changes.
    function onPlayerStateChange(e) {
        if (e.data == YT.PlayerState.ENDED) player.stopVideo();
    }

})();