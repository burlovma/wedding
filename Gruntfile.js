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
                    src: [
                        '_js/bundled/main.js',
                        '_js/bundled/rsvp.js'
                    ],
                    dest: 'js/<%= pkg.name %>.min.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('production', ['sass', 'browserify', 'uglify']);

};