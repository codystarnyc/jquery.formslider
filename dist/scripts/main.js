(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Animation = (function() {
    function Animation(options) {
      var $el, data_key, el, j, len, ref, ref1, value;
      this.options = options;
      this.animatedElements = [];
      ref = $(this.options.selector);
      for (j = 0, len = ref.length; j < len; j++) {
        el = ref[j];
        $el = $(el);
        this.animatedElements.push($el);
        $el.options = $.extend(true, {}, this.options);
        ref1 = $el.data();
        for (data_key in ref1) {
          value = ref1[data_key];
          if (data_key in this.options) {
            $el.options[data_key] = value;
          }
        }
      }
    }

    return Animation;

  })();

  this.AnimationFadeIn = (function(superClass) {
    extend(AnimationFadeIn, superClass);

    function AnimationFadeIn(options) {
      var $el, fn, j, len, ref;
      this.options = options;
      AnimationFadeIn.__super__.constructor.call(this, this.options);
      ref = this.animatedElements;
      fn = function($el) {
        return setTimeout(function() {
          return $el.animate({
            opacity: 1
          }, $el.options.speed);
        }, $el.options.wait);
      };
      for (j = 0, len = ref.length; j < len; j++) {
        $el = ref[j];
        fn($el);
      }
    }

    return AnimationFadeIn;

  })(Animation);

  this.AnimationInView = (function(superClass) {
    extend(AnimationInView, superClass);

    function AnimationInView(options) {
      this.options = options;
      this.checkAnimatedElemets = bind(this.checkAnimatedElemets, this);
      this.setupAnimations = bind(this.setupAnimations, this);
      AnimationInView.__super__.constructor.call(this, this.options);
      this.setupAnimations();
    }

    AnimationInView.prototype.setupAnimations = function() {
      var $el, j, k, len, len1, ref, ref1, results;
      ref = this.animatedElements;
      for (j = 0, len = ref.length; j < len; j++) {
        $el = ref[j];
        $el.css($el.options.css);
      }
      $(window).bind('scroll', this.checkAnimatedElemets);
      $(window).bind('resize', this.checkAnimatedElemets);
      ref1 = this.animatedElements;
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        $el = ref1[k];
        results.push((function($el, doAnimatedElement) {
          this.doAnimatedElement = doAnimatedElement;
          return setTimeout(function() {
            return this.doAnimatedElement($el);
          }, $el.options.wait);
        })($el, this.doAnimatedElement));
      }
      return results;
    };

    AnimationInView.prototype.checkAnimatedElemets = function() {
      var $el, j, len, ref, results, top;
      top = $(window).scrollTop() + $(window).height();
      ref = this.animatedElements;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        $el = ref[j];
        results.push(this.doAnimatedElement($el));
      }
      return results;
    };

    AnimationInView.prototype.doAnimatedElement = function($el) {
      var top;
      top = $(window).scrollTop() + $(window).height();
      if (top + $el.options.offsetTop > $el.offset().top) {
        return $el.animate({
          opacity: 1,
          top: 0
        }, $el.options.speed);
      }
    };

    return AnimationInView;

  })(Animation);

  this.AnimationFixedOnTop = (function() {
    function AnimationFixedOnTop(options) {
      this.options = options;
      this.checkAnimatedElemets = bind(this.checkAnimatedElemets, this);
      this.checkUndoAnimatedElements = bind(this.checkUndoAnimatedElements, this);
      this.setupAnimations = bind(this.setupAnimations, this);
      this.animatedElements = $(this.options.selector);
      this.undoElements = [];
      this.setupAnimations();
    }

    AnimationFixedOnTop.prototype.setupAnimations = function() {
      $(window).bind('scroll', this.checkAnimatedElemets);
      $(window).bind('resize', this.checkAnimatedElemets);
      return this.checkAnimatedElemets();
    };

    AnimationFixedOnTop.prototype.checkUndoAnimatedElements = function() {
      var entry, index, indexToDel, j, k, len, len1, ref, results, top;
      top = $(window).scrollTop();
      indexToDel = [];
      ref = this.undoElements;
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        entry = ref[index];
        if (top < entry.top) {
          entry.el.css(entry.css);
          entry.el.removeClass('fixed');
          indexToDel.push(index);
        }
      }
      results = [];
      for (k = 0, len1 = indexToDel.length; k < len1; k++) {
        index = indexToDel[k];
        results.push(this.undoElements.slice(index, 1));
      }
      return results;
    };

    AnimationFixedOnTop.prototype.checkAnimatedElemets = function() {
      var top;
      this.checkUndoAnimatedElements();
      top = $(window).scrollTop();
      return this.animatedElements.each((function(_this) {
        return function(i, el) {
          var $el, offset;
          $el = $(el);
          if ($el.css('position') === 'fixed') {
            return;
          }
          offset = $el.offset();
          if (top > offset.top) {
            _this.undoElements.push({
              el: $el,
              top: offset.top,
              css: {
                position: $el.css('position'),
                left: $el.css('left')
              }
            });
            $el.css({
              position: 'fixed',
              top: 0,
              left: offset.left
            });
            return $el.addClass('fixed');
          }
        };
      })(this));
    };

    return AnimationFixedOnTop;

  })();

  window.Fancybox = (function() {
    function Fancybox() {
      this.setupFancybox();
    }

    Fancybox.prototype.setupFancybox = function() {
      return $(".fancybox").fancybox({
        maxWidth: 1000,
        fitToView: true,
        width: '90%',
        height: '70%',
        autoSize: true,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        helpers: {
          overlay: {
            locked: false
          }
        }
      });
    };

    return Fancybox;

  })();

  this.Tooltips = (function() {
    function Tooltips(selector) {
      $(selector).each(function() {
        var $this;
        $this = $(this);
        return $this.tooltipster({
          theme: $this.data('tooltip-theme') || 'tooltipster-light',
          contentAsHTML: $this.data('tooltip-html') || true,
          animation: $this.data('tooltip-animation') || 'grow',
          position: $this.data('tooltip-position') || 'bottom',
          maxWidth: $this.data('tooltip-max-width') || null
        });
      });
    }

    return Tooltips;

  })();

  this.Application = (function() {
    function Application() {
      var animations;
      this.options = {
        animations: {
          fixedOnTop: {
            selector: '.fixed-on-top'
          },
          fadeIn: {
            selector: '.fade-in-on-load',
            wait: 1200,
            speed: 1700
          },
          inView: {
            selector: '.animate-if-in-view',
            speed: 830,
            wait: 1200,
            offsetTop: 100,
            css: {
              opacity: 0,
              position: 'relative',
              top: '100px'
            }
          }
        }
      };
      animations = this.options.animations;
      this.animationFixedOnTop = new AnimationFixedOnTop(animations.fixedOnTop);
      this.animationInView = new AnimationInView(animations.inView);
      this.animationFadeIn = new AnimationFadeIn(animations.fadeIn);
      this.fancybox = new Fancybox();
      this.tooltips = new Tooltips('.tooltip');
    }

    return Application;

  })();

  (function($) {
    return Raven.context(function() {
      return window.application = new Application();
    });
  })(jQuery);

}).call(this);
