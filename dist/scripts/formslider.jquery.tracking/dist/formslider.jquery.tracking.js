(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.JqueryTracking = (function(superClass) {
    extend(JqueryTracking, superClass);

    function JqueryTracking() {
      this.onTrack = bind(this.onTrack, this);
      this.onTrackConversionError = bind(this.onTrackConversionError, this);
      this.init = bind(this.init, this);
      return JqueryTracking.__super__.constructor.apply(this, arguments);
    }

    JqueryTracking.config = {
      initialize: true,
      eventCategory: 'formslider',
      trackFormSubmission: true,
      conversionErrorEvantName: 'conversion-error',
      sessionLifeTimeDays: 1,
      cookiePrefix: 'tracking_',
      cookiePath: '.example.com',
      sourceParamName: 'utm_source',
      campaignParamName: 'utm_campaign',
      storageParams: {
        'utm_source': 'organic',
        'utm_campaign': 'organic'
      },
      adapter: []
    };

    JqueryTracking.prototype.init = function() {
      var submissionPlugin;
      if (this.config.initialize) {
        $.tracking(this.config);
      }
      this.on('track', this.onTrack);
      if (!this.config.trackFormSubmission) {
        return;
      }
      submissionPlugin = this.formslider.plugins.get('FormSubmissionPlugin');
      if (submissionPlugin) {
        this.on(submissionPlugin.config.successEventName, this.onTrackConversion);
        return this.on(submissionPlugin.config.errorEventName, this.onTrackConversionError);
      }
    };

    JqueryTracking.prototype.onTrackConversion = function() {
      return $.tracking.conversion();
    };

    JqueryTracking.prototype.onTrackConversionError = function() {
      return $.tracking.event(this.config.eventCategory, this.config.conversionErrorEvantName);
    };

    JqueryTracking.prototype.onTrack = function(event, source, value, category) {
      if (category == null) {
        category = null;
      }
      return $.tracking.event(category || this.config.eventCategory, source, value, '', '');
    };

    return JqueryTracking;

  })(AbstractFormsliderPlugin);

}).call(this);
