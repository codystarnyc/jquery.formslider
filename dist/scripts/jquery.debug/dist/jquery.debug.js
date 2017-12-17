(function() {
  var $, instance, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if (!window.console) {
    window.console = {};
  }

  if (!window.console.log) {
    window.console.log = function() {};
  }

  root.JQueryDebug = (function() {
    JQueryDebug.options = {
      cookieName: 'debug',
      urlParam: 'debug',
      developmentHosts: ['127.0', '192.168', 'localhost']
    };

    function JQueryDebug(options1) {
      this.options = options1;
      this.alert = bind(this.alert, this);
      this.warn = bind(this.warn, this);
      this.info = bind(this.info, this);
      this.error = bind(this.error, this);
      this.debug = bind(this.debug, this);
      this.log = bind(this.log, this);
      this._log = bind(this._log, this);
      this.isProduction = bind(this.isProduction, this);
      this.isDevelopment = bind(this.isDevelopment, this);
      this.setDebugMode = bind(this.setDebugMode, this);
      this.isEnabled = bind(this.isEnabled, this);
      this.disable = bind(this.disable, this);
      this.enable = bind(this.enable, this);
      this._autodetectDebugModeAndSet = bind(this._autodetectDebugModeAndSet, this);
      this.config = bind(this.config, this);
      this.config(jQuery.extend(this.options, this.constructor.options));
      this._href = window.location.href;
      this._console = console;
      this._autodetectDebugModeAndSet();
    }

    JQueryDebug.prototype.config = function(options) {
      if (options) {
        this.options = jQuery.extend(this.options, options);
      }
      return this.options;
    };

    JQueryDebug.prototype._autodetectDebugModeAndSet = function() {
      var ref, ref1;
      if ((ref = jQuery.url("?" + this.options.urlParam)) === '0' || ref === '1' || ref === 'true' || ref === 'false') {
        this.setDebugMode(jQuery.url("?" + this.options.urlParam));
        return;
      }
      if ((ref1 = Cookies.get(this.options.cookieName)) === '0' || ref1 === '1' || ref1 === 'true' || ref1 === 'false') {
        this.setDebugMode(Cookies.get(this.options.cookieName));
        return;
      }
      return this.setDebugMode(!this.isProduction());
    };

    JQueryDebug.prototype.enable = function() {
      return this.setDebugMode(true);
    };

    JQueryDebug.prototype.disable = function() {
      return this.setDebugMode(false);
    };

    JQueryDebug.prototype.isEnabled = function() {
      return this.debugEnabled;
    };

    JQueryDebug.prototype.setDebugMode = function(state) {
      if (state === 'true' || state === '1' || state === 1 || state === true) {
        this.debugEnabled = true;
      }
      if (state === 'false' || state === '0' || state === 0 || state === false) {
        this.debugEnabled = false;
      }
      return Cookies.set(this.options.cookieName, this.debugEnabled);
    };

    JQueryDebug.prototype.isDevelopment = function() {
      var host, i, len, ref;
      if (this._href.indexOf('file://') > -1) {
        return true;
      }
      ref = this.options.developmentHosts;
      for (i = 0, len = ref.length; i < len; i++) {
        host = ref[i];
        if (this._href.indexOf(host) > -1) {
          return true;
        }
      }
      return false;
    };

    JQueryDebug.prototype.isProduction = function() {
      return !this.isDevelopment();
    };

    JQueryDebug.prototype._log = function(type, args) {
      var err;
      if (!this.debugEnabled) {
        return;
      }
      try {
        return this._console[type].apply(this._console, args);
      } catch (_error) {
        err = _error;
      }
    };

    JQueryDebug.prototype.log = function() {
      return this._log('log', arguments);
    };

    JQueryDebug.prototype.debug = function() {
      return this._log('debug', arguments);
    };

    JQueryDebug.prototype.error = function() {
      return this._log('error', arguments);
    };

    JQueryDebug.prototype.info = function() {
      return this._log('info', arguments);
    };

    JQueryDebug.prototype.warn = function() {
      return this._log('warn', arguments);
    };

    JQueryDebug.prototype.alert = function(msg) {
      if (this.debugEnabled) {
        return alert(msg);
      }
    };

    return JQueryDebug;

  })();

  if (typeof jQuery !== 'undefined') {
    instance = new JQueryDebug();
    $ = jQuery;
    $.extend({
      debug: function() {
        var ref;
        if (!arguments.length) {
          return instance.isEnabled();
        }
        if ((ref = arguments[0]) === 'true' || ref === 1 || ref === true || ref === 'false' || ref === 0 || ref === false) {
          return instance.setDebugMode(arguments[0]);
        } else {
          return instance.config(arguments[0]);
        }
      }
    });
    $.extend($.debug, instance);
    $.debug.instance = instance;
  }

}).call(this);
