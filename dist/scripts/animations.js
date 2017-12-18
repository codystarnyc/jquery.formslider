(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9ucy5qcyIsInNvdXJjZXMiOlsiYW5pbWF0aW9ucy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOzs7O0VBQU0sSUFBQyxDQUFBOzs7SUFDUSx5QkFBQyxPQUFEO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxVQUFEO01BQ1osaURBQU0sSUFBQyxDQUFBLE9BQVA7QUFDQTtXQUNLLFNBQUMsR0FBRDtlQUNELFVBQUEsQ0FDRSxTQUFBO2lCQUNFLEdBQUcsQ0FBQyxPQUFKLENBQVk7WUFBQyxPQUFBLEVBQVMsQ0FBVjtXQUFaLEVBQTBCLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBdEM7UUFERixDQURGLEVBSUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUpkO01BREM7QUFETCxXQUFBLHFDQUFBOztXQUNNO0FBRE47SUFGVzs7OztLQURnQjs7RUFhekIsSUFBQyxDQUFBOzs7SUFDUSx5QkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7OztNQUNaLGlEQUFNLElBQUMsQ0FBQSxPQUFQO01BQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBQTtJQUZXOzs4QkFJYixlQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO0FBQUE7QUFBQSxXQUFBLHFDQUFBOztRQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFwQjtBQURGO01BR0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxRQUFmLEVBQXlCLElBQUMsQ0FBQSxvQkFBMUI7TUFDQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFFBQWYsRUFBeUIsSUFBQyxDQUFBLG9CQUExQjtBQUVBO0FBQUE7V0FBQSx3Q0FBQTs7cUJBQ0ssQ0FBQSxTQUFDLEdBQUQsRUFBTSxpQkFBTjtVQUFNLElBQUMsQ0FBQSxvQkFBRDtpQkFDUCxVQUFBLENBQ0UsU0FBQTttQkFDRSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsR0FBbkI7VUFE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QUEsRUFBSSxHQUFKO2NBQ0EsR0FBQSxFQUFLLE1BQU0sQ0FBQyxHQURaO2NBRUEsR0FBQSxFQUNFO2dCQUFBLFFBQUEsRUFBVSxHQUFHLENBQUMsR0FBSixDQUFRLFVBQVIsQ0FBVjtnQkFDQSxJQUFBLEVBQU0sR0FBRyxDQUFDLEdBQUosQ0FBUSxNQUFSLENBRE47ZUFIRjthQURGO1lBT0EsR0FBRyxDQUFDLEdBQUosQ0FDRTtjQUFBLFFBQUEsRUFBVSxPQUFWO2NBQ0EsR0FBQSxFQUFLLENBREw7Y0FFQSxJQUFBLEVBQU0sTUFBTSxDQUFDLElBRmI7YUFERjttQkFLQSxHQUFHLENBQUMsUUFBSixDQUFhLE9BQWIsRUFiRjs7UUFOcUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0lBTG9COzs7OztBQXBFeEIiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBAQW5pbWF0aW9uRmFkZUluIGV4dGVuZHMgQW5pbWF0aW9uXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpLT5cbiAgICBzdXBlciBAb3B0aW9uc1xuICAgIGZvciAkZWwgaW4gQGFuaW1hdGVkRWxlbWVudHNcbiAgICAgIGRvICgkZWwpIC0+XG4gICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgLT5cbiAgICAgICAgICAgICRlbC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgJGVsLm9wdGlvbnMuc3BlZWQpXG4gICAgICAgICAgLFxuICAgICAgICAgICRlbC5vcHRpb25zLndhaXRcbiAgICAgICAgKVxuXG5cbmNsYXNzIEBBbmltYXRpb25JblZpZXcgZXh0ZW5kcyBBbmltYXRpb25cbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuICAgIHN1cGVyIEBvcHRpb25zXG4gICAgQHNldHVwQW5pbWF0aW9ucygpXG5cbiAgc2V0dXBBbmltYXRpb25zOiA9PlxuICAgIGZvciAkZWwgaW4gQGFuaW1hdGVkRWxlbWVudHNcbiAgICAgICRlbC5jc3MoJGVsLm9wdGlvbnMuY3NzKVxuXG4gICAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIEBjaGVja0FuaW1hdGVkRWxlbWV0cylcbiAgICAkKHdpbmRvdykuYmluZCgncmVzaXplJywgQGNoZWNrQW5pbWF0ZWRFbGVtZXRzKVxuXG4gICAgZm9yICRlbCBpbiBAYW5pbWF0ZWRFbGVtZW50c1xuICAgICAgZG8gKCRlbCwgQGRvQW5pbWF0ZWRFbGVtZW50KSAtPlxuICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgIC0+XG4gICAgICAgICAgICBAZG9BbmltYXRlZEVsZW1lbnQgJGVsXG4gICAgICAgICAgLFxuICAgICAgICAgICRlbC5vcHRpb25zLndhaXRcbiAgICAgICAgKVxuXG4gIGNoZWNrQW5pbWF0ZWRFbGVtZXRzOiA9PlxuICAgIHRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKVxuICAgIGZvciAkZWwgaW4gQGFuaW1hdGVkRWxlbWVudHNcbiAgICAgIEBkb0FuaW1hdGVkRWxlbWVudCAkZWxcblxuICBkb0FuaW1hdGVkRWxlbWVudDogKCRlbCkgLT5cbiAgICB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICBpZih0b3AgKyAkZWwub3B0aW9ucy5vZmZzZXRUb3AgPiAkZWwub2Zmc2V0KCkudG9wKVxuICAgICAgJGVsLmFuaW1hdGUoe29wYWNpdHk6IDEsIHRvcDogMH0sICRlbC5vcHRpb25zLnNwZWVkKVxuXG5jbGFzcyBAQW5pbWF0aW9uRml4ZWRPblRvcFxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKS0+XG4gICAgQGFuaW1hdGVkRWxlbWVudHMgPSAkKEBvcHRpb25zLnNlbGVjdG9yKVxuICAgIEB1bmRvRWxlbWVudHMgPSBbXVxuICAgIEBzZXR1cEFuaW1hdGlvbnMoKVxuXG4gIHNldHVwQW5pbWF0aW9uczogPT5cbiAgICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgQGNoZWNrQW5pbWF0ZWRFbGVtZXRzKVxuICAgICQod2luZG93KS5iaW5kKCdyZXNpemUnLCBAY2hlY2tBbmltYXRlZEVsZW1ldHMpXG4gICAgQGNoZWNrQW5pbWF0ZWRFbGVtZXRzKClcblxuICBjaGVja1VuZG9BbmltYXRlZEVsZW1lbnRzOiA9PlxuICAgIHRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKVxuXG4gICAgaW5kZXhUb0RlbCA9IFtdXG4gICAgZm9yIGVudHJ5LCBpbmRleCBpbiBAdW5kb0VsZW1lbnRzXG4gICAgICBpZiB0b3AgPCBlbnRyeS50b3BcbiAgICAgICAgZW50cnkuZWwuY3NzKGVudHJ5LmNzcylcbiAgICAgICAgZW50cnkuZWwucmVtb3ZlQ2xhc3MgJ2ZpeGVkJ1xuICAgICAgICBpbmRleFRvRGVsLnB1c2ggaW5kZXhcblxuICAgIGZvciBpbmRleCBpbiBpbmRleFRvRGVsXG4gICAgICBAdW5kb0VsZW1lbnRzLnNsaWNlKGluZGV4LCAxKVxuXG4gIGNoZWNrQW5pbWF0ZWRFbGVtZXRzOiA9PlxuICAgIEBjaGVja1VuZG9BbmltYXRlZEVsZW1lbnRzKClcblxuICAgIHRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKVxuXG4gICAgQGFuaW1hdGVkRWxlbWVudHMuZWFjaCgoaSwgZWwpID0+XG4gICAgICAkZWwgPSAkKGVsKVxuXG4gICAgICByZXR1cm4gaWYgJGVsLmNzcygncG9zaXRpb24nKSA9PSAnZml4ZWQnXG5cbiAgICAgIG9mZnNldCA9ICRlbC5vZmZzZXQoKVxuICAgICAgaWYodG9wID4gb2Zmc2V0LnRvcClcbiAgICAgICAgQHVuZG9FbGVtZW50cy5wdXNoXG4gICAgICAgICAgZWw6ICRlbFxuICAgICAgICAgIHRvcDogb2Zmc2V0LnRvcFxuICAgICAgICAgIGNzczpcbiAgICAgICAgICAgIHBvc2l0aW9uOiAkZWwuY3NzKCdwb3NpdGlvbicpXG4gICAgICAgICAgICBsZWZ0OiAkZWwuY3NzKCdsZWZ0JylcblxuICAgICAgICAkZWwuY3NzXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCdcbiAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICBsZWZ0OiBvZmZzZXQubGVmdFxuXG4gICAgICAgICRlbC5hZGRDbGFzcyAnZml4ZWQnXG4gICAgKVxuIl19
