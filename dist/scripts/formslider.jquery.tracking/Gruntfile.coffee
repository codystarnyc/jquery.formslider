'use strict'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'dist/formslider.jquery.tracking.js': 'src/formslider.jquery.tracking.coffee'
    coffeelint:
      app:
        [ 'src/*.coffee' ]
    uglify:
      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      build:
        files: 'dist/formslider.jquery.tracking.min.js': 'dist/formslider.jquery.tracking.js'
    compress:
      main:
        options:
          mode: 'gzip'
        files: [ {
          src: [ 'dist/formslider.jquery.tracking.min.js' ]
          dest: 'dist/formslider.jquery.tracking.js.gz'
        }]
    watch:
      options: livereload: true
      files: 'src/*.coffee'
      tasks: 'default'

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
