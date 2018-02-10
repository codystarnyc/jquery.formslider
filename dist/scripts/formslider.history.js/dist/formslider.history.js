(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.HistoryJsController = (function(superClass) {
    extend(HistoryJsController, superClass);

    function HistoryJsController() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return HistoryJsController.__super__.constructor.apply(this, arguments);
    }

    HistoryJsController.config = {
      updateUrl: false,
      resetStatesOnLoad: true
    };

    HistoryJsController.prototype.init = function() {
      this.on('after', this.onAfter);
      this.time = new Date().getTime();
      this.pushCurrentHistoryState();
      return History.Adapter.bind(window, 'statechange', this.handleHistoryChange);
    };

    HistoryJsController.prototype.onAfter = function() {
      return this.pushCurrentHistoryState();
    };

    HistoryJsController.prototype.pushCurrentHistoryState = function() {
      var hash, index;
      index = this.index();
      hash = null;
      if (this.config.updateUrl) {
        hash = "?slide=" + index;
      }
      this.logger.debug('pushCurrentHistoryState', "index:" + index);
      return History.pushState({
        index: index,
        time: this.time
      }, null, hash);
    };

    HistoryJsController.prototype.handleHistoryChange = function(event) {
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

    return HistoryJsController;

  })(AbstractFormsliderPlugin);

}).call(this);
