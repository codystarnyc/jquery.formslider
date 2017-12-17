(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.JqueryAnimatePlugin = (function(superClass) {
    extend(JqueryAnimatePlugin, superClass);

    function JqueryAnimatePlugin() {
      this.init = bind(this.init, this);
      return JqueryAnimatePlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryAnimatePlugin.config = {
      duration: 1000,
      selector: '.answer',
      next: {
        inEffect: 'swingReverse',
        outEffect: 'swingReverse'
      },
      prev: {
        inEffect: 'swing',
        outEffect: 'swing'
      },
      actions: {
        before: function(plugin, current, direction, next) {
          var duration, inEffect, outEffect, selector;
          inEffect = plugin.config[direction].inEffect;
          outEffect = plugin.config[direction].outEffect;
          duration = plugin.config.duration;
          selector = plugin.config.selector;
          if ($(current).data('role') === 'question') {
            $(selector, current).animateCss(outEffect, duration);
          }
          if ($(next).data('role') === 'question') {
            return $(selector, next).animateCss(inEffect, duration);
          }
        }
      }
    };

    JqueryAnimatePlugin.prototype.init = function() {
      var callback, eventName, ref, results;
      ref = this.config.actions;
      results = [];
      for (eventName in ref) {
        callback = ref[eventName];
        results.push(this.on(eventName, (function(_this) {
          return function(event, current, direction, next) {
            return callback(_this, current, direction, next);
          };
        })(this)));
      }
      return results;
    };

    return JqueryAnimatePlugin;

  })(AbstractFormsliderPlugin);

}).call(this);
