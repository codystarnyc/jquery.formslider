(function() {
  this.Animation = (function() {
    function Animation(options) {
      var $el, data_key, el, i, len, ref, ref1, value;
      this.options = options;
      this.animatedElements = [];
      ref = $(this.options.selector);
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
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

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmpzIiwic291cmNlcyI6WyJhbmltYXRpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQU0sSUFBQyxDQUFBO0lBQ1EsbUJBQUMsT0FBRDtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsVUFBRDtNQUNaLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtBQUVwQjtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsR0FBQSxHQUFNLENBQUEsQ0FBRSxFQUFGO1FBQ04sSUFBQyxDQUFBLGdCQUFnQixDQUFDLElBQWxCLENBQXVCLEdBQXZCO1FBQ0EsR0FBRyxDQUFDLE9BQUosR0FBYyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLElBQUMsQ0FBQSxPQUFwQjtBQUNkO0FBQUEsYUFBQSxnQkFBQTs7VUFDRSxJQUErQixRQUFBLElBQVksSUFBQyxDQUFBLE9BQTVDO1lBQUEsR0FBRyxDQUFDLE9BQVEsQ0FBQSxRQUFBLENBQVosR0FBc0IsTUFBdEI7O0FBREY7QUFKRjtJQUhXOzs7OztBQURmIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBAQW5pbWF0aW9uXG4gIGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpLT5cbiAgICBAYW5pbWF0ZWRFbGVtZW50cyA9IFtdXG4gICAgIyBtZXJnZSBkYXRhIGFuZCBvcHRpb24gdmFsdWVzXG4gICAgZm9yIGVsIGluICQoQG9wdGlvbnMuc2VsZWN0b3IpXG4gICAgICAkZWwgPSAkKGVsKVxuICAgICAgQGFuaW1hdGVkRWxlbWVudHMucHVzaCAkZWxcbiAgICAgICRlbC5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIEBvcHRpb25zKVxuICAgICAgZm9yIGRhdGFfa2V5LCB2YWx1ZSBvZiAkZWwuZGF0YSgpXG4gICAgICAgICRlbC5vcHRpb25zW2RhdGFfa2V5XT12YWx1ZSBpZiBkYXRhX2tleSBvZiBAb3B0aW9uc1xuIl19
