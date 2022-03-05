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
