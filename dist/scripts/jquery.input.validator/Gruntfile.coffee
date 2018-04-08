execSync = require('child_process').execSync

module.exports = (grunt) ->

  # configuration
  grunt.initConfig
    # pkg
    pkg: grunt.file.readJSON 'package.json'

    # coffee
    coffee:
      dist:
        options: { sourceMap: true }
        files:
          'dist/jquery.input.validator.js': 'build/jquery.input.validator.coffee'

      specs:
        options: { sourceMap: true, inline: true, flatten: false, expand: false }
        files:
          'build/spec/helper.js':             'spec/helper.coffee'
          'build/spec/validation.spec.js':    'spec/validation.spec.coffee'
          'build/spec/trigger.spec.js':       'spec/trigger.spec.coffee'
          'build/spec/hint.spec.js':          'spec/hint.spec.coffee'
          'build/spec/reset.spec.js':         'spec/reset.spec.coffee'
          'build/spec/rules_builtin.spec.js': 'spec/rules_builtin.spec.coffee'
          'build/spec/rules_custom.spec.js':  'spec/rules_custom.spec.coffee'

    # includes
    includes:
      files:
        src: ['src/jquery.input.validator.coffee']
        dest: 'build'
        flatten: true
        cwd: '.'
        options:
          includeRegexp: /^(\s*)#=\s*include\s+(\S+)\s*$/
          silent: true
          banner: '# <% includes.files.dest %>'

    # coffeelint
    coffeelint:
      lint: [ 'src/*.coffee' ]

    # uglyfy
    uglify:
      options:
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      build:
        files: 'dist/jquery.input.validator.min.js': 'dist/jquery.input.validator.js'

    # replace
    replace:
      dist:
        files: [{ src: ['dist/**/*'],  dest: 'dist/', expand: true, flatten: true }]
        options:
          patterns: [{ match: /__VERSION__/, replacement: '<%= pkg.version %>' }]

      bower:
        files: [{ src: [ 'bower.json', 'package.json' ], dest: './', expand: true, flatten: true }]
        options:
          patterns: [{
              match: /"version": "([^"]*)"/,     replacement: '"version": "<%= pkg.version %>"'
            },{
              match: /"description": "([^"]*)"/, replacement: '"description": "<%= pkg.description %>"'
          }]

    # clean
    clean:
      build: 'build'
      dist:  'dist'

    # jasmine
    jasmine:
      jquery1:
        src: 'dist/jquery.input.validator.js'
        options:
          specs:   'build/spec/*spec.js'
          helpers: 'build/spec/*helper.js'
          vendor: [
            # yes this is ugly, but npm doesnt support multiple versions of a package
            "vendor/jquery-1/jquery.min.js"
            "node_modules/jasmine-jquery/lib/jasmine-jquery.js"
          ]
      jquery2:
        src: 'dist/jquery.input.validator.js'
        options:
          specs:   'build/spec/*spec.js'
          helpers: 'build/spec/*helper.js'
          vendor: [
            # yes this is ugly, but npm doesnt support multiple versions of a package
            "vendor/jquery-2/dist/jquery.min.js"
            "node_modules/jasmine-jquery/lib/jasmine-jquery.js"
          ]
      jquery3:
        src: 'dist/jquery.input.validator.js'
        options:
          specs:   'build/spec/*spec.js'
          helpers: 'build/spec/*helper.js'
          vendor: [
            # yes this is ugly, but npm doesnt support multiple versions of a package
            "vendor/jquery-3/dist/jquery.min.js"
            "node_modules/jasmine-jquery/lib/jasmine-jquery.js"
          ]

          template: require 'grunt-template-jasmine-istanbul'
          templateOptions:
            coverage: 'coverage/json/coverage.json'
            report: [
              {type: 'html', options: {dir: 'coverage/html'}}
              {type: 'lcov', options: {dir: 'coverage/lcov'}}
            ]

    coveralls:
      options:
        force: false

      default:
        src: 'coverage/lcov/*.info'
        options: {}

  # Loading dependencies
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  })

  # register tasks
  grunt.registerTask 'compile',  [ 'run-once:clean', 'run-once:includes', 'run-once:coffee', 'run-once:replace' ]

  grunt.registerTask 'test',     [ 'run-once:compile', 'jasmine:jquery3' ]
  grunt.registerTask 'test-all', [ 'run-once:compile', 'jasmine'         ]

  grunt.registerTask 'build',    [ 'run-once:compile', 'run-once:coffeelint', 'test-all', 'uglify' ]

  grunt.registerTask 'default',  [ 'test' ]


  # automated release creation (build, push, tag, npm publish)
  execAndReturn = (cmd, print=true) ->
    console.log "exec: #{cmd}" if print
    execSync(cmd).toString()

  grunt.registerTask 'release:check:option:tag', (n) ->
    unless grunt.option('tag')
      grunt.fail.fatal "\n\n\tmissing argument '--tag' (--tag=1.x.x)\n\n"

  grunt.registerTask 'release:check:git:status', (n) ->
    # check if repo clean
    git_status = execAndReturn('git status', false)
    if git_status.indexOf('working tree clean') == -1
      grunt.fail.fatal "\n\n\tuncomitted changes, use 'git status'\n\n"

  grunt.registerTask 'release:check:git:tag', (n) ->
    semver = grunt.option('tag')
    # check if tag exists (will print the semver version if present)
    git_tag_list = execAndReturn("git tag -l #{semver}", false)
    if git_tag_list.indexOf(semver) != -1
      grunt.fail.fatal "\n\n\ttag '#{semver}' already exists\n\n"

  grunt.registerTask 'release:config:update', (n) ->
    semver = grunt.option('tag')
    # pre checks ok
    console.log "info: creating release #{semver}"
    # this will be used from task replace and some others
    grunt.config('pkg.version', semver)

  grunt.registerTask 'release:git:prepare', (n) ->
    semver = grunt.option('tag')
    execAndReturn("git add ./dist ./bower.json ./package.json")
    execAndReturn("git commit --allow-empty -m 'dist v#{semver}'")
    execAndReturn("git tag -a #{semver} -m #{semver}")

  grunt.registerTask 'release:git:push', (n) ->
    git_push = execAndReturn("git push && git push --tags")
    if git_push.indexOf('failed to push') != -1
      grunt.fail.fatal "\n\n\tcan not push, aborting\n\n"

  grunt.registerTask 'release:npm:publish', (n) ->
    execSync("npm publish")

  grunt.registerTask 'release', [
    'release:check:option:tag'
    'release:check:git:status'
    'release:check:git:tag'

    'release:config:update'
    'build'
    'release:git:prepare'

    'release:git:push'
    'release:npm:publish'
  ]
