root = exports ? this

# fix ie9 issue
if !window.console then window.console = {}
if !window.console.log then window.console.log = ->

class root.JQueryDebug
  @options =
    cookieName: 'debug'
    urlParam: 'debug'
    developmentHosts: [
      '127.0'
      '192.168'
      'localhost'
    ]

  constructor: (@options) ->
    @config jQuery.extend(@options, @constructor.options)
    @_href    = window.location.href
    @_console = console
    @_autodetectDebugModeAndSet()

  config: (options) =>
    @options = jQuery.extend(@options, options) if options
    @options

  _autodetectDebugModeAndSet: =>
    if jQuery.url("?#{@options.urlParam}") in ['0', '1', 'true', 'false']
      @setDebugMode jQuery.url("?#{@options.urlParam}")
      return

    if Cookies.get(@options.cookieName) in ['0', '1', 'true', 'false']
      @setDebugMode Cookies.get(@options.cookieName)
      return

    @setDebugMode !@isProduction()

  enable: =>
    @setDebugMode true

  disable: =>
    @setDebugMode false

  isEnabled: =>
    @debugEnabled

  setDebugMode: (state) =>
    @debugEnabled = true  if state in ['true', '1', 1, true]
    @debugEnabled = false if state in ['false', '0', 0, false]
    Cookies.set(@options.cookieName, @debugEnabled)

  isDevelopment: =>
    return true if @_href.indexOf('file://') > -1
    for host in @options.developmentHosts
      return true if @_href.indexOf(host) > -1
    false

  isProduction: =>
    !@isDevelopment()

  _log: (type, args)=>
    return if !@debugEnabled
    try
      @_console[type].apply @_console, args
    catch err
      # do nothing if we cannot log

  log:   => @_log('log',   arguments)
  debug: => @_log('debug', arguments)
  error: => @_log('error', arguments)
  info:  => @_log('info',  arguments)
  warn:  => @_log('warn',  arguments)

  alert: (msg) => alert msg if @debugEnabled

if typeof jQuery != 'undefined'
  instance = new JQueryDebug()
  $        = jQuery
  $.extend debug: ->
    return instance.isEnabled() unless arguments.length

    if arguments[0] in ['true', 1, true, 'false', 0, false]
      instance.setDebugMode arguments[0]
    else
      instance.config arguments[0]

  #for calling instance methods directly
  $.extend $.debug, instance

  #for test stubbing we need the real instance, the real this
  $.debug.instance = instance
