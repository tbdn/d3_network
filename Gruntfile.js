"use strict";

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    // Load all grunt tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: { // 'destination': 'source'
                    'css/main.css': 'scss/main.scss'
                }
            },
            prod: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: { // 'destination': 'source'
                    'css/main.css': 'scss/main.scss'
                }
            }
        },
        watch: {
            sass: {
                files: [
                    './scss/*.scss'
                ],
                tasks: ['sass:dev']
            }
        },
    });

    // Grunt Tasks
    grunt.registerTask('default', ['sass:dev']);
};
