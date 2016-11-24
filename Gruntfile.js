'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    credentials: grunt.file.readJSON('credentials.json'),
    localOptions: grunt.file.readJSON('local-options.json'),

    // Configuration to be run.
    gcs: {
      options: {
        project: '<%= localOptions.project %>',
        bucket: '<%= localOptions.bucket %>',
        gzip: true,
        headers: {
          cacheControl: 'public, no-cache'
        },
        metadata: {
          'surrogate-key': 'gcs'
        }
      },
      keyAuth: {
        options: {
          keyFilename: '<%= localOptions.keyFilename %>'
        },
        cwd: '<%= localOptions.testFiles %>',
        src: '**'
      },
      credentialsAuth: {
        options: {
          credentials: grunt.file.readJSON('credentials.json')
        },
        cwd: '<%= localOptions.testFiles %>',
        src: '**'
      },
      emailKeyAuth: {
        options: {
          clientEmail: '<%= credentials.client_email %>',
          privateKey: '<%= credentials.private_key %>'
        },
        cwd: '<%= localOptions.testFiles %>',
        src: '**'
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    eslint: {
      options: {
        configFile: '.eslint.json'
      },
      target: [
        'tasks/{,**/}*.js'
      ]
    },


  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('test', ['eslint']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['gcs']);

};
