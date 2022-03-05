(function() {
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

}).call(this);
