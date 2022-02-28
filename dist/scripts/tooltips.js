(function() {
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

}).call(this);
