module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        preserveComments: false
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            src: ['*'],
            dest: 'dist/server-side',
            filter: 'isFile',
            noProcess: 'main.js',
            cwd: 'src'
          },
        ],
      },
    },
    jasmine: {
      customTemplate: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/**/*.js'
        }
      }
    },
    replace: {
      injectConstructorFunctionsIntoMainJs: {
        options: {
          patterns: [{
            match: 'asynchronous-for-each',
            replacement: '<%= grunt.file.read("src/asynchronous-for-each.js") %>'
          }, {
            match: 'kwire',
            replacement: '<%= grunt.file.read("node_modules/kwire/dist/kwire.js") %>'
          }, {
            match: 'niid',
            replacement: '<%= grunt.file.read("node_modules/niid/dist/niid.js") %>'
          }, {
            match: 'mixx',
            replacement: '<%= grunt.file.read("node_modules/mixx/dist/mixx.js") %>'
          }]
        },
        files: [{
          src: ['src/main.js'],
          dest: 'dist/<%= pkg.name %>.js'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['replace', 'uglify', 'copy']);
};