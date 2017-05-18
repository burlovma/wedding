module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: '_scss/globals/'
                },
                files: {
                    'css/style.css': '_scss/style.scss'
                }
            }
        },
        browserify: {
            libs: {
                files: {
                    '_js/bundled/main.js': ['_js/main.js', '_js/parallax-images.js']
                },
                options: {
                    transform: ['babelify'],
                    alias: [
                        './_js/globals/modules/Helper.js:Helper',
                        './_js/globals/modules/ParallaxImage.js:ParallaxImage'
                    ]
                }
            },
            rsvp: {
                files: {
                    '_js/bundled/rsvp.js': '_js/rsvp.js'
                },
                options: {
                    transform: ['babelify'],
                    alias: [
                        './_js/globals/modules/Helper.js:Helper'
                    ]
                }
            },
            lazy: {
                files: {
                    '_js/bundled/lazy.js': '_js/lazy.js'
                },
                options: {
                    transform: ['babelify'],
                    alias: [
                        './_js/globals/modules/Helper.js:Helper'
                    ]
                }
            },
            overlay: {
                files: {
                    '_js/bundled/overlay.js': '_js/overlay.js'
                },
                options: {
                    transform: ['babelify'],
                    alias: [
                        './_js/globals/modules/Helper.js:Helper'
                    ]
                }
            },
            party: {
                files: {
                    '_js/bundled/party.js': '_js/party.js'
                },
                options: {
                    transform: ['babelify'],
                    alias: [
                        './_js/globals/modules/Helper.js:Helper'
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: ['_js/*.js', '_js/globals/modules/*.js'],
                tasks: ['browserify', 'uglify'],
                options: {
                    spawn: false
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                mangle: true,
                compress: true,
                beautify: false
            },
            build: {
                files: [{
                    src: ['_js/bundled/main.js', '_js/bundled/party.js', '_js/bundled/overlay.js'],
                    dest: 'js/<%= pkg.name %>.min.js'
                },
                {
                    src: '_js/bundled/rsvp.js',
                    dest: 'js/rsvp.min.js'
                },
                {
                    src: '_js/bundled/lazy.js',
                    dest: 'js/lazy.min.js'
                }]
            }
        },
        critical: {
            test: {
                options: {
                    base: './',
                    css: [
                        '_site/css/style.css'
                    ],
                    dimensions: [{
                        width: 320,
                        height: 70
                    }, {
                        width: 768,
                        height: 500
                    }, {
                        width: 1200,
                        height: 900
                    }],
                    minify: false
                },
                src: '_site/index.html',
                dest: 'generated/critical.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-critical');

    grunt.registerTask('production', ['browserify', 'uglify']);

};