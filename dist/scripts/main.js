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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOzs7O0VBQU0sSUFBQyxDQUFBO0lBQ1EsbUJBQUMsT0FBRDtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsVUFBRDtNQUNaLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtBQUVwQjtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsR0FBQSxHQUFNLENBQUEsQ0FBRSxFQUFGO1FBQ04sSUFBQyxDQUFBLGdCQUFnQixDQUFDLElBQWxCLENBQXVCLEdBQXZCO1FBQ0EsR0FBRyxDQUFDLE9BQUosR0FBYyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLElBQUMsQ0FBQSxPQUFwQjtBQUNkO0FBQUEsYUFBQSxnQkFBQTs7VUFDRSxJQUErQixRQUFBLElBQVksSUFBQyxDQUFBLE9BQTVDO1lBQUEsR0FBRyxDQUFDLE9BQVEsQ0FBQSxRQUFBLENBQVosR0FBc0IsTUFBdEI7O0FBREY7QUFKRjtJQUhXOzs7Ozs7RUFVVCxJQUFDLENBQUE7OztJQUNRLHlCQUFDLE9BQUQ7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLFVBQUQ7TUFDWixpREFBTSxJQUFDLENBQUEsT0FBUDtBQUNBO1dBQ0ssU0FBQyxHQUFEO2VBQ0QsVUFBQSxDQUNFLFNBQUE7aUJBQ0UsR0FBRyxDQUFDLE9BQUosQ0FBWTtZQUFDLE9BQUEsRUFBUyxDQUFWO1dBQVosRUFBMEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUF0QztRQURGLENBREYsRUFJRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBSmQ7TUFEQztBQURMLFdBQUEscUNBQUE7O1dBQ007QUFETjtJQUZXOzs7O0tBRGdCOztFQWF6QixJQUFDLENBQUE7OztJQUNRLHlCQUFDLE9BQUQ7TUFBQyxJQUFDLENBQUEsVUFBRDs7O01BQ1osaURBQU0sSUFBQyxDQUFBLE9BQVA7TUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO0lBRlc7OzhCQUliLGVBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7QUFBQTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQXBCO0FBREY7TUFHQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFFBQWYsRUFBeUIsSUFBQyxDQUFBLG9CQUExQjtNQUNBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsUUFBZixFQUF5QixJQUFDLENBQUEsb0JBQTFCO0FBRUE7QUFBQTtXQUFBLHdDQUFBOztxQkFDSyxDQUFBLFNBQUMsR0FBRCxFQUFNLGlCQUFOO1VBQU0sSUFBQyxDQUFBLG9CQUFEO2lCQUNQLFVBQUEsQ0FDRSxTQUFBO21CQUNFLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixHQUFuQjtVQURGLENBREYsRUFJRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBSmQ7UUFEQyxDQUFBLENBQUgsQ0FBSSxHQUFKLEVBQVMsSUFBQyxDQUFBLGlCQUFWO0FBREY7O0lBUGU7OzhCQWdCakIsb0JBQUEsR0FBc0IsU0FBQTtBQUNwQixVQUFBO01BQUEsR0FBQSxHQUFNLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxTQUFWLENBQUEsQ0FBQSxHQUF3QixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFBO0FBQzlCO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQ0UsSUFBQyxDQUFBLGlCQUFELENBQW1CLEdBQW5CO0FBREY7O0lBRm9COzs4QkFLdEIsaUJBQUEsR0FBbUIsU0FBQyxHQUFEO0FBQ2pCLFVBQUE7TUFBQSxHQUFBLEdBQU0sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLFNBQVYsQ0FBQSxDQUFBLEdBQXdCLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQUE7TUFDOUIsSUFBRyxHQUFBLEdBQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFsQixHQUE4QixHQUFHLENBQUMsTUFBSixDQUFBLENBQVksQ0FBQyxHQUE5QztlQUNFLEdBQUcsQ0FBQyxPQUFKLENBQVk7VUFBQyxPQUFBLEVBQVMsQ0FBVjtVQUFhLEdBQUEsRUFBSyxDQUFsQjtTQUFaLEVBQWtDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBOUMsRUFERjs7SUFGaUI7Ozs7S0ExQlU7O0VBK0J6QixJQUFDLENBQUE7SUFDUSw2QkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7Ozs7TUFDWixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsQ0FBQSxDQUFFLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBWDtNQUNwQixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsZUFBRCxDQUFBO0lBSFc7O2tDQUtiLGVBQUEsR0FBaUIsU0FBQTtNQUNmLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsUUFBZixFQUF5QixJQUFDLENBQUEsb0JBQTFCO01BQ0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxRQUFmLEVBQXlCLElBQUMsQ0FBQSxvQkFBMUI7YUFDQSxJQUFDLENBQUEsb0JBQUQsQ0FBQTtJQUhlOztrQ0FLakIseUJBQUEsR0FBMkIsU0FBQTtBQUN6QixVQUFBO01BQUEsR0FBQSxHQUFNLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxTQUFWLENBQUE7TUFFTixVQUFBLEdBQWE7QUFDYjtBQUFBLFdBQUEscURBQUE7O1FBQ0UsSUFBRyxHQUFBLEdBQU0sS0FBSyxDQUFDLEdBQWY7VUFDRSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQVQsQ0FBYSxLQUFLLENBQUMsR0FBbkI7VUFDQSxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVQsQ0FBcUIsT0FBckI7VUFDQSxVQUFVLENBQUMsSUFBWCxDQUFnQixLQUFoQixFQUhGOztBQURGO0FBTUE7V0FBQSw4Q0FBQTs7cUJBQ0UsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQW9CLEtBQXBCLEVBQTJCLENBQTNCO0FBREY7O0lBVnlCOztrQ0FhM0Isb0JBQUEsR0FBc0IsU0FBQTtBQUNwQixVQUFBO01BQUEsSUFBQyxDQUFBLHlCQUFELENBQUE7TUFFQSxHQUFBLEdBQU0sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLFNBQVYsQ0FBQTthQUVOLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRCxFQUFJLEVBQUo7QUFDckIsY0FBQTtVQUFBLEdBQUEsR0FBTSxDQUFBLENBQUUsRUFBRjtVQUVOLElBQVUsR0FBRyxDQUFDLEdBQUosQ0FBUSxVQUFSLENBQUEsS0FBdUIsT0FBakM7QUFBQSxtQkFBQTs7VUFFQSxNQUFBLEdBQVMsR0FBRyxDQUFDLE1BQUosQ0FBQTtVQUNULElBQUcsR0FBQSxHQUFNLE1BQU0sQ0FBQyxHQUFoQjtZQUNFLEtBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUNFO2NBQUEsRUFBQSxFQUFJLEdBQUo7Y0FDQSxHQUFBLEVBQUssTUFBTSxDQUFDLEdBRFo7Y0FFQSxHQUFBLEVBQ0U7Z0JBQUEsUUFBQSxFQUFVLEdBQUcsQ0FBQyxHQUFKLENBQVEsVUFBUixDQUFWO2dCQUNBLElBQUEsRUFBTSxHQUFHLENBQUMsR0FBSixDQUFRLE1BQVIsQ0FETjtlQUhGO2FBREY7WUFPQSxHQUFHLENBQUMsR0FBSixDQUNFO2NBQUEsUUFBQSxFQUFVLE9BQVY7Y0FDQSxHQUFBLEVBQUssQ0FETDtjQUVBLElBQUEsRUFBTSxNQUFNLENBQUMsSUFGYjthQURGO21CQUtBLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQWJGOztRQU5xQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7SUFMb0I7Ozs7OztFQTJCbEIsTUFBTSxDQUFDO0lBQ0Usa0JBQUE7TUFDWCxJQUFDLENBQUEsYUFBRCxDQUFBO0lBRFc7O3VCQUdiLGFBQUEsR0FBZSxTQUFBO2FBQ2IsQ0FBQSxDQUFFLFdBQUYsQ0FBYyxDQUFDLFFBQWYsQ0FDRTtRQUFBLFFBQUEsRUFBVyxJQUFYO1FBQ0EsU0FBQSxFQUFZLElBRFo7UUFFQSxLQUFBLEVBQVMsS0FGVDtRQUdBLE1BQUEsRUFBVSxLQUhWO1FBSUEsUUFBQSxFQUFXLElBSlg7UUFLQSxVQUFBLEVBQWEsS0FMYjtRQU1BLFVBQUEsRUFBYSxNQU5iO1FBT0EsV0FBQSxFQUFjLE1BUGQ7UUFRQSxPQUFBLEVBQ0U7VUFBQSxPQUFBLEVBQ0U7WUFBQSxNQUFBLEVBQVEsS0FBUjtXQURGO1NBVEY7T0FERjtJQURhOzs7Ozs7RUFlWCxJQUFDLENBQUE7SUFDUSxrQkFBQyxRQUFEO01BQ1gsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLElBQVosQ0FBaUIsU0FBQTtBQUNmLFlBQUE7UUFBQSxLQUFBLEdBQVEsQ0FBQSxDQUFFLElBQUY7ZUFFUixLQUFLLENBQUMsV0FBTixDQUNFO1VBQUEsS0FBQSxFQUFlLEtBQUssQ0FBQyxJQUFOLENBQVcsZUFBWCxDQUFBLElBQStCLG1CQUE5QztVQUNBLGFBQUEsRUFBZSxLQUFLLENBQUMsSUFBTixDQUFXLGNBQVgsQ0FBQSxJQUE4QixJQUQ3QztVQUVBLFNBQUEsRUFBZSxLQUFLLENBQUMsSUFBTixDQUFXLG1CQUFYLENBQUEsSUFBbUMsTUFGbEQ7VUFHQSxRQUFBLEVBQWUsS0FBSyxDQUFDLElBQU4sQ0FBVyxrQkFBWCxDQUFBLElBQWtDLFFBSGpEO1VBSUEsUUFBQSxFQUFlLEtBQUssQ0FBQyxJQUFOLENBQVcsbUJBQVgsQ0FBQSxJQUFtQyxJQUpsRDtTQURGO01BSGUsQ0FBakI7SUFEVzs7Ozs7O0VBYVQsSUFBQyxDQUFBO0lBQ1EscUJBQUE7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FDRTtRQUFBLFVBQUEsRUFDRTtVQUFBLFVBQUEsRUFDRTtZQUFBLFFBQUEsRUFBVSxlQUFWO1dBREY7VUFFQSxNQUFBLEVBQ0U7WUFBQSxRQUFBLEVBQVUsa0JBQVY7WUFDQSxJQUFBLEVBQU0sSUFETjtZQUVBLEtBQUEsRUFBTyxJQUZQO1dBSEY7VUFNQSxNQUFBLEVBQ0U7WUFBQSxRQUFBLEVBQVUscUJBQVY7WUFDQSxLQUFBLEVBQVUsR0FEVjtZQUVBLElBQUEsRUFBTSxJQUZOO1lBR0EsU0FBQSxFQUFXLEdBSFg7WUFJQSxHQUFBLEVBQ0U7Y0FBQSxPQUFBLEVBQVUsQ0FBVjtjQUNBLFFBQUEsRUFBVSxVQURWO2NBRUEsR0FBQSxFQUFVLE9BRlY7YUFMRjtXQVBGO1NBREY7O01BaUJGLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDO01BQ3RCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJLG1CQUFKLENBQXdCLFVBQVUsQ0FBQyxVQUFuQztNQUN2QixJQUFDLENBQUEsZUFBRCxHQUF1QixJQUFJLGVBQUosQ0FBd0IsVUFBVSxDQUFDLE1BQW5DO01BQ3ZCLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUksZUFBSixDQUF3QixVQUFVLENBQUMsTUFBbkM7TUFDdkIsSUFBQyxDQUFBLFFBQUQsR0FBdUIsSUFBSSxRQUFKLENBQUE7TUFDdkIsSUFBQyxDQUFBLFFBQUQsR0FBdUIsSUFBSSxRQUFKLENBQWEsVUFBYjtJQXhCWjs7Ozs7O0VBMEJmLENBQUMsU0FBQyxDQUFEO1dBQ0MsS0FBSyxDQUFDLE9BQU4sQ0FBZSxTQUFBO2FBQ2IsTUFBTSxDQUFDLFdBQVAsR0FBcUIsSUFBSSxXQUFKLENBQUE7SUFEUixDQUFmO0VBREQsQ0FBRCxDQUFBLENBS0UsTUFMRjtBQXRLQSIsInNvdXJjZXNDb250ZW50IjpbIiM9IGluY2x1ZGUgYW5pbWF0aW9uLmNvZmZlZVxuIz0gaW5jbHVkZSBhbmltYXRpb25zLmNvZmZlZVxuIz0gaW5jbHVkZSBmYW5jeWJveC5jb2ZmZWVcbiM9IGluY2x1ZGUgdG9vbHRpcHMuY29mZmVlXG5cbmNsYXNzIEBBcHBsaWNhdGlvblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAb3B0aW9ucyA9XG4gICAgICBhbmltYXRpb25zOlxuICAgICAgICBmaXhlZE9uVG9wOlxuICAgICAgICAgIHNlbGVjdG9yOiAnLmZpeGVkLW9uLXRvcCdcbiAgICAgICAgZmFkZUluOlxuICAgICAgICAgIHNlbGVjdG9yOiAnLmZhZGUtaW4tb24tbG9hZCdcbiAgICAgICAgICB3YWl0OiAxMjAwXG4gICAgICAgICAgc3BlZWQ6IDE3MDBcbiAgICAgICAgaW5WaWV3OlxuICAgICAgICAgIHNlbGVjdG9yOiAnLmFuaW1hdGUtaWYtaW4tdmlldydcbiAgICAgICAgICBzcGVlZDogICAgODMwXG4gICAgICAgICAgd2FpdDogMTIwMFxuICAgICAgICAgIG9mZnNldFRvcDogMTAwXG4gICAgICAgICAgY3NzOlxuICAgICAgICAgICAgb3BhY2l0eTogIDBcbiAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgICAgICB0b3A6ICAgICAgJzEwMHB4J1xuXG4gICAgYW5pbWF0aW9ucyA9IEBvcHRpb25zLmFuaW1hdGlvbnNcbiAgICBAYW5pbWF0aW9uRml4ZWRPblRvcCA9IG5ldyBBbmltYXRpb25GaXhlZE9uVG9wKGFuaW1hdGlvbnMuZml4ZWRPblRvcClcbiAgICBAYW5pbWF0aW9uSW5WaWV3ICAgICA9IG5ldyBBbmltYXRpb25JblZpZXcgICAgKGFuaW1hdGlvbnMuaW5WaWV3KVxuICAgIEBhbmltYXRpb25GYWRlSW4gICAgID0gbmV3IEFuaW1hdGlvbkZhZGVJbiAgICAoYW5pbWF0aW9ucy5mYWRlSW4pXG4gICAgQGZhbmN5Ym94ICAgICAgICAgICAgPSBuZXcgRmFuY3lib3goKVxuICAgIEB0b29sdGlwcyAgICAgICAgICAgID0gbmV3IFRvb2x0aXBzKCcudG9vbHRpcCcpXG5cbigoJCkgLT5cbiAgUmF2ZW4uY29udGV4dCggLT5cbiAgICB3aW5kb3cuYXBwbGljYXRpb24gPSBuZXcgQXBwbGljYXRpb24oKVxuICApXG5cbikoalF1ZXJ5KVxuIl19
