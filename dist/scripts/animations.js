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
      this.doAnimatedElement = bind(this.doAnimatedElement, this);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9ucy5qcyIsInNvdXJjZXMiOlsiYW5pbWF0aW9ucy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOzs7O0VBQU0sSUFBQyxDQUFBOzs7SUFDUSx5QkFBQyxPQUFEO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxVQUFEO01BQ1osaURBQU0sSUFBQyxDQUFBLE9BQVA7QUFDQTtXQUNLLFNBQUMsR0FBRDtlQUNELFVBQUEsQ0FDRSxTQUFBO2lCQUNFLEdBQUcsQ0FBQyxPQUFKLENBQVk7WUFBQyxPQUFBLEVBQVMsQ0FBVjtXQUFaLEVBQTBCLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBdEM7UUFERixDQURGLEVBSUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUpkO01BREM7QUFETCxXQUFBLHFDQUFBOztXQUNNO0FBRE47SUFGVzs7OztLQURnQjs7RUFhekIsSUFBQyxDQUFBOzs7SUFDUSx5QkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7Ozs7TUFDWixpREFBTSxJQUFDLENBQUEsT0FBUDtNQUNBLElBQUMsQ0FBQSxlQUFELENBQUE7SUFGVzs7OEJBSWIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtBQUFBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxHQUFHLENBQUMsR0FBSixDQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBcEI7QUFERjtNQUdBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsUUFBZixFQUF5QixJQUFDLENBQUEsb0JBQTFCO01BQ0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxRQUFmLEVBQXlCLElBQUMsQ0FBQSxvQkFBMUI7QUFFQTtBQUFBO1dBQUEsd0NBQUE7O3FCQUNLLENBQUEsU0FBQyxHQUFELEVBQU0saUJBQU47VUFBTSxJQUFDLENBQUEsb0JBQUQ7aUJBQ1AsVUFBQSxDQUNFLFNBQUE7bUJBQ0UsSUFBQyxDQUFBLGlCQUFELENBQW1CLEdBQW5CO1VB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QUFBLEVBQUksR0FBSjtjQUNBLEdBQUEsRUFBSyxNQUFNLENBQUMsR0FEWjtjQUVBLEdBQUEsRUFDRTtnQkFBQSxRQUFBLEVBQVUsR0FBRyxDQUFDLEdBQUosQ0FBUSxVQUFSLENBQVY7Z0JBQ0EsSUFBQSxFQUFNLEdBQUcsQ0FBQyxHQUFKLENBQVEsTUFBUixDQUROO2VBSEY7YUFERjtZQU9BLEdBQUcsQ0FBQyxHQUFKLENBQ0U7Y0FBQSxRQUFBLEVBQVUsT0FBVjtjQUNBLEdBQUEsRUFBSyxDQURMO2NBRUEsSUFBQSxFQUFNLE1BQU0sQ0FBQyxJQUZiO2FBREY7bUJBS0EsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBYkY7O1FBTnFCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QjtJQUxvQjs7Ozs7QUFwRXhCIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQEFuaW1hdGlvbkZhZGVJbiBleHRlbmRzIEFuaW1hdGlvblxuICBjb25zdHJ1Y3RvcjogKEBvcHRpb25zKS0+XG4gICAgc3VwZXIgQG9wdGlvbnNcbiAgICBmb3IgJGVsIGluIEBhbmltYXRlZEVsZW1lbnRzXG4gICAgICBkbyAoJGVsKSAtPlxuICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgIC0+XG4gICAgICAgICAgICAkZWwuYW5pbWF0ZSh7b3BhY2l0eTogMX0sICRlbC5vcHRpb25zLnNwZWVkKVxuICAgICAgICAgICxcbiAgICAgICAgICAkZWwub3B0aW9ucy53YWl0XG4gICAgICAgIClcblxuXG5jbGFzcyBAQW5pbWF0aW9uSW5WaWV3IGV4dGVuZHMgQW5pbWF0aW9uXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpLT5cbiAgICBzdXBlciBAb3B0aW9uc1xuICAgIEBzZXR1cEFuaW1hdGlvbnMoKVxuXG4gIHNldHVwQW5pbWF0aW9uczogPT5cbiAgICBmb3IgJGVsIGluIEBhbmltYXRlZEVsZW1lbnRzXG4gICAgICAkZWwuY3NzKCRlbC5vcHRpb25zLmNzcylcblxuICAgICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCBAY2hlY2tBbmltYXRlZEVsZW1ldHMpXG4gICAgJCh3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIEBjaGVja0FuaW1hdGVkRWxlbWV0cylcblxuICAgIGZvciAkZWwgaW4gQGFuaW1hdGVkRWxlbWVudHNcbiAgICAgIGRvICgkZWwsIEBkb0FuaW1hdGVkRWxlbWVudCkgLT5cbiAgICAgICAgc2V0VGltZW91dChcbiAgICAgICAgICAtPlxuICAgICAgICAgICAgQGRvQW5pbWF0ZWRFbGVtZW50ICRlbFxuICAgICAgICAgICxcbiAgICAgICAgICAkZWwub3B0aW9ucy53YWl0XG4gICAgICAgIClcblxuICBjaGVja0FuaW1hdGVkRWxlbWV0czogPT5cbiAgICB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICBmb3IgJGVsIGluIEBhbmltYXRlZEVsZW1lbnRzXG4gICAgICBAZG9BbmltYXRlZEVsZW1lbnQgJGVsXG5cbiAgZG9BbmltYXRlZEVsZW1lbnQ6ICgkZWwpID0+XG4gICAgdG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpXG4gICAgaWYodG9wICsgJGVsLm9wdGlvbnMub2Zmc2V0VG9wID4gJGVsLm9mZnNldCgpLnRvcClcbiAgICAgICRlbC5hbmltYXRlKHtvcGFjaXR5OiAxLCB0b3A6IDB9LCAkZWwub3B0aW9ucy5zcGVlZClcblxuY2xhc3MgQEFuaW1hdGlvbkZpeGVkT25Ub3BcbiAgY29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuICAgIEBhbmltYXRlZEVsZW1lbnRzID0gJChAb3B0aW9ucy5zZWxlY3RvcilcbiAgICBAdW5kb0VsZW1lbnRzID0gW11cbiAgICBAc2V0dXBBbmltYXRpb25zKClcblxuICBzZXR1cEFuaW1hdGlvbnM6ID0+XG4gICAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIEBjaGVja0FuaW1hdGVkRWxlbWV0cylcbiAgICAkKHdpbmRvdykuYmluZCgncmVzaXplJywgQGNoZWNrQW5pbWF0ZWRFbGVtZXRzKVxuICAgIEBjaGVja0FuaW1hdGVkRWxlbWV0cygpXG5cbiAgY2hlY2tVbmRvQW5pbWF0ZWRFbGVtZW50czogPT5cbiAgICB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKClcblxuICAgIGluZGV4VG9EZWwgPSBbXVxuICAgIGZvciBlbnRyeSwgaW5kZXggaW4gQHVuZG9FbGVtZW50c1xuICAgICAgaWYgdG9wIDwgZW50cnkudG9wXG4gICAgICAgIGVudHJ5LmVsLmNzcyhlbnRyeS5jc3MpXG4gICAgICAgIGVudHJ5LmVsLnJlbW92ZUNsYXNzICdmaXhlZCdcbiAgICAgICAgaW5kZXhUb0RlbC5wdXNoIGluZGV4XG5cbiAgICBmb3IgaW5kZXggaW4gaW5kZXhUb0RlbFxuICAgICAgQHVuZG9FbGVtZW50cy5zbGljZShpbmRleCwgMSlcblxuICBjaGVja0FuaW1hdGVkRWxlbWV0czogPT5cbiAgICBAY2hlY2tVbmRvQW5pbWF0ZWRFbGVtZW50cygpXG5cbiAgICB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKClcblxuICAgIEBhbmltYXRlZEVsZW1lbnRzLmVhY2goKGksIGVsKSA9PlxuICAgICAgJGVsID0gJChlbClcblxuICAgICAgcmV0dXJuIGlmICRlbC5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2ZpeGVkJ1xuXG4gICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KClcbiAgICAgIGlmKHRvcCA+IG9mZnNldC50b3ApXG4gICAgICAgIEB1bmRvRWxlbWVudHMucHVzaFxuICAgICAgICAgIGVsOiAkZWxcbiAgICAgICAgICB0b3A6IG9mZnNldC50b3BcbiAgICAgICAgICBjc3M6XG4gICAgICAgICAgICBwb3NpdGlvbjogJGVsLmNzcygncG9zaXRpb24nKVxuICAgICAgICAgICAgbGVmdDogJGVsLmNzcygnbGVmdCcpXG5cbiAgICAgICAgJGVsLmNzc1xuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnXG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgbGVmdDogb2Zmc2V0LmxlZnRcblxuICAgICAgICAkZWwuYWRkQ2xhc3MgJ2ZpeGVkJ1xuICAgIClcbiJdfQ==
