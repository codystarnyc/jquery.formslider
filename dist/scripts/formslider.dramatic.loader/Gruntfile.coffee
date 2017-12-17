'use strict'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'dist/formslider.dramatic.loader.js': 'src/formslider.dramatic.loader.coffee'
    coffeelint:
      app:
        [ 'src/*.coffee' ]
    uglify:
      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      build:
        files: 'dist/formslider.dramatic.loader.min.js': 'dist/formslider.dramatic.loader.js'
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
  ]

  grunt.registerTask 'build', [
    'default'
  ]
