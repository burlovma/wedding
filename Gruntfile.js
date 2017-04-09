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
                    '_js/main.js': '_js/main.js'
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
                files: ['_js/*.js', '_scss/*.scss'],
                tasks: ['browserify', 'uglify', 'sass'],
                options: {
                    spawn: false
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n   Written by Brett Nolf \n\n',
                mangle: true,
                compress: true,
                beautify: false
            },
            build: {
                files: [{
                    src: [
                        '_js/main.js'
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