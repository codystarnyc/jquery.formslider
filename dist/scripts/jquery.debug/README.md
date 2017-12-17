# jquery.debug [![Build Status](https://travis-ci.org/creative-workflow/jquery.debug.svg?branch=master)](https://travis-ci.org/creative-workflow/jquery.debug) [![Code Climate](https://codeclimate.com/github/creative-workflow/jquery.debug/badges/gpa.svg)](https://codeclimate.com/github/creative-workflow/jquery.debug)

This plugin helps managing debugging in javascript. It looks for a url param or cookie and prints conditional to the browser console. it is useful if you want to log debug informations to the browser console on development hosts per default, but not in production. You can enable the debug mode in production via a url parameter.

## Installation
    bower install jquery.debug

## Usage
### javascript
    $.debug(true);
    $.debug.log('msg'); //prints to console

    $.debug(false);
    $.debug.log('msg'); //doesnt print to console

    //sets 192.123.* hosts as development hosts
    $.debug({developmentHosts: ['192.123.']})

It also exposes the class `JQueryDebug` for manual instantiating.

### coffee script
    $.debug true
    $.debug.log 'msg' #prints to console

    $.debug false
    $.debug.log 'msg' #doesnt print to console

    #adds 192.123.* hosts to development hosts
    $.debug developmentHosts: [ '192.123.' ]

It also exposes the class `JQueryDebug` for manual instantiating and extending.

### Parameter
#### developmentHosts
List of hosts or host-substrings for development host detection. Default is:
* 127.0
* 192.168
* localhost

#### urlParam
Name of the url param to watch for, default is 'debug'. You van use:
* ?debug=0
* ?debug=false
* ?debug=1
* ?debug=true

#### cookieName
Name of the cookie for debug storing, default is 'debug'.

### Functions
#### $.debug(configuration|debugMode|null)
Initialize the plugin.
  * with a configuration object.
  * or sets the debug mode if one of `['1', 1, 'true', true, '0', 0, 'false', false]` is given.
  * If no parameter is given it returns the actual debug mode.

#### $.debug.config (options)
Updates the configuration.

#### $.debug.enable
Enables debug mode.

#### $.debug.disable
Disables debug mode.

#### $.debug.isEnabled
Returns the actual debug mode.

#### $.debug.setDebugMode (state)
Set the debug mode and stores it in the cookie. Valid values are:
* 0
* '0'
* false
* 'false'
* 1
* '1'
* true
* 'true'

#### $.debug.isDevelopment
Tells if the actual host is a development host.

#### $.debug.isProduction
Tells if the actual host is a production host.

#### $.debug.log (msg)
Logs a massage to the browser console if in debug mode.

#### $.debug.debug (msg)
Logs a debug massage to the browser console if in debug mode.

#### $.debug.error (msg)
Logs a error massage to the browser console if in debug mode.

#### $.debug.info (msg)
Logs a info massage to the browser console if in debug mode.

#### $.debug.warn (msg)
Logs a warning massage to the browser console if in debug mode.

#### $.debug.alert (msg)
Alerts a massage if in debug mode.

### Dependencies
  * [jquery](https://jquery.com)
  * [js-cookie](https://github.com/js-cookie/js-cookie)
  * [js-url](https://github.com/websanova/js-url)

### Resources
  * https://github.com/creative-workflow/jquery.debug
  * https://travis-ci.org/creative-workflow/jquery.debug
  * https://codeclimate.com/github/creative-workflow/jquery.debug
  * http://bower.io/search/?q=jquery.debug

### Authors

  [Tom Hanoldt](https://www.tomhanoldt.info)

# Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)
