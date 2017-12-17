'use strict'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'dist/jquery.debug.js': 'src/jquery.debug.coffee'
          'spec/test.spec.js': 'spec/test.spec.coffee'
    coffeelint:
      app:
        [ 'src/*.coffee' ]
    uglify:
      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      build:
        files: 'dist/jquery.debug.min.js': 'dist/jquery.debug.js'
    compress:
      main:
        options:
          mode: 'gzip'
        files: [ {
          src: [ 'dist/jquery.debug.min.js' ]
          dest: 'dist/jquery.debug.js.gz'
        }]
    jasmine:
      specs:
        src: 'dist/jquery.debug.js'
        options:
          specs: 'spec/*spec.js'
          vendor: [
            "bower_components/jquery/dist/jquery.min.js"
            "bower_components/js-cookie/src/js.cookie.js"
            "bower_components/js-url/url.min.js"
            "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
          ]
    watch:
      options: livereload: true
      files: '{src,spec}/*.coffee'
      tasks: 'default'

  # Loading dependencies
  for key of grunt.file.readJSON('package.json').devDependencies
    if key != 'grunt' and key.indexOf('grunt') == 0
      grunt.loadNpmTasks key

  grunt.registerTask 'default', [
    'coffeelint'
    'coffee'
    'jasmine'
    'uglify'
    'compress'
  ]

  grunt.registerTask 'test', [
    'coffee'
    'jasmine'
  ]
