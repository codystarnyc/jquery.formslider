(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.HistoryJsPlugin = (function(superClass) {
    extend(HistoryJsPlugin, superClass);

    function HistoryJsPlugin() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return HistoryJsPlugin.__super__.constructor.apply(this, arguments);
    }

    HistoryJsPlugin.config = {
      updateUrl: false,
      resetStatesOnLoad: true
    };

    HistoryJsPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return History.Adapter.bind(window, 'statechange', this.handleHistoryChange);
    };

    HistoryJsPlugin.prototype.onAfter = function() {
      return this.pushCurrentHistoryState();
    };

    HistoryJsPlugin.prototype.pushCurrentHistoryState = function() {
      var hash;
      hash = null;
      if (this.config.updateUrl) {
        hash = "?slide=" + (this.formslider.index());
      }
      this.logger.debug('pushCurrentHistoryState', "index:" + (this.formslider.index()));
      return History.pushState({
        index: this.formslider.index(),
        time: this.time
      }, null, hash);
    };

    HistoryJsPlugin.prototype.handleHistoryChange = function(event) {
      var ref, state;
      state = History.getState();
      if (!((state != null ? (ref = state.data) != null ? ref.index : void 0 : void 0) > -1)) {
        return;
      }
      if (this.config.resetStatesOnLoad) {
        if (state.data.time !== this.time) {
          return;
        }
      }
      this.logger.debug('handleHistoryChange', state.data.index);
      return this.formslider.goto(state.data.index);
    };

    return HistoryJsPlugin;

  })(AbstractFormsliderPlugin);

}).call(this);
