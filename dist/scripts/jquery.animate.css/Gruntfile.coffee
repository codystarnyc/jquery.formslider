'use strict'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'dist/jquery.animate.css.js': 'src/jquery.animate.css.coffee'
    coffeelint:
      app:
        [ 'src/*.coffee' ]
    uglify:
      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      build:
        files: 'dist/jquery.animate.css.min.js': 'dist/jquery.animate.css.js'
    compress:
      main:
        options:
          mode: 'gzip'
        files: [ {
          src: [ 'dist/jquery.animate.css.min.js' ]
          dest: 'dist/jquery.animate.css.js.gz'
        }]

  # Loading dependencies
  for key of grunt.file.readJSON('package.json').devDependencies
    if key != 'grunt' and key.indexOf('grunt') == 0
      grunt.loadNpmTasks key

  grunt.registerTask 'default', [
    'coffeelint'
    'coffee'
    'uglify'
    'compress'
  ]

  grunt.registerTask 'test', [
    'coffee'
  ]
