(function() {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBTSxJQUFDLENBQUE7SUFDUSxxQkFBQTtBQUNYLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxHQUNFO1FBQUEsVUFBQSxFQUNFO1VBQUEsVUFBQSxFQUNFO1lBQUEsUUFBQSxFQUFVLGVBQVY7V0FERjtVQUVBLE1BQUEsRUFDRTtZQUFBLFFBQUEsRUFBVSxrQkFBVjtZQUNBLElBQUEsRUFBTSxJQUROO1lBRUEsS0FBQSxFQUFPLElBRlA7V0FIRjtVQU1BLE1BQUEsRUFDRTtZQUFBLFFBQUEsRUFBVSxxQkFBVjtZQUNBLEtBQUEsRUFBVSxHQURWO1lBRUEsSUFBQSxFQUFNLElBRk47WUFHQSxTQUFBLEVBQVcsR0FIWDtZQUlBLEdBQUEsRUFDRTtjQUFBLE9BQUEsRUFBVSxDQUFWO2NBQ0EsUUFBQSxFQUFVLFVBRFY7Y0FFQSxHQUFBLEVBQVUsT0FGVjthQUxGO1dBUEY7U0FERjs7TUFpQkYsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUM7TUFDdEIsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUksbUJBQUosQ0FBd0IsVUFBVSxDQUFDLFVBQW5DO01BQ3ZCLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUksZUFBSixDQUF3QixVQUFVLENBQUMsTUFBbkM7TUFDdkIsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBSSxlQUFKLENBQXdCLFVBQVUsQ0FBQyxNQUFuQztNQUN2QixJQUFDLENBQUEsUUFBRCxHQUF1QixJQUFJLFFBQUosQ0FBQTtNQUN2QixJQUFDLENBQUEsUUFBRCxHQUF1QixJQUFJLFFBQUosQ0FBYSxVQUFiO0lBeEJaOzs7Ozs7RUEwQmYsQ0FBQyxTQUFDLENBQUQ7V0FDQyxLQUFLLENBQUMsT0FBTixDQUFlLFNBQUE7YUFDYixNQUFNLENBQUMsV0FBUCxHQUFxQixJQUFJLFdBQUosQ0FBQTtJQURSLENBQWY7RUFERCxDQUFELENBQUEsQ0FLRSxNQUxGO0FBM0JBIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQEFwcGxpY2F0aW9uXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBvcHRpb25zID1cbiAgICAgIGFuaW1hdGlvbnM6XG4gICAgICAgIGZpeGVkT25Ub3A6XG4gICAgICAgICAgc2VsZWN0b3I6ICcuZml4ZWQtb24tdG9wJ1xuICAgICAgICBmYWRlSW46XG4gICAgICAgICAgc2VsZWN0b3I6ICcuZmFkZS1pbi1vbi1sb2FkJ1xuICAgICAgICAgIHdhaXQ6IDEyMDBcbiAgICAgICAgICBzcGVlZDogMTcwMFxuICAgICAgICBpblZpZXc6XG4gICAgICAgICAgc2VsZWN0b3I6ICcuYW5pbWF0ZS1pZi1pbi12aWV3J1xuICAgICAgICAgIHNwZWVkOiAgICA4MzBcbiAgICAgICAgICB3YWl0OiAxMjAwXG4gICAgICAgICAgb2Zmc2V0VG9wOiAxMDBcbiAgICAgICAgICBjc3M6XG4gICAgICAgICAgICBvcGFjaXR5OiAgMFxuICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIHRvcDogICAgICAnMTAwcHgnXG5cbiAgICBhbmltYXRpb25zID0gQG9wdGlvbnMuYW5pbWF0aW9uc1xuICAgIEBhbmltYXRpb25GaXhlZE9uVG9wID0gbmV3IEFuaW1hdGlvbkZpeGVkT25Ub3AoYW5pbWF0aW9ucy5maXhlZE9uVG9wKVxuICAgIEBhbmltYXRpb25JblZpZXcgICAgID0gbmV3IEFuaW1hdGlvbkluVmlldyAgICAoYW5pbWF0aW9ucy5pblZpZXcpXG4gICAgQGFuaW1hdGlvbkZhZGVJbiAgICAgPSBuZXcgQW5pbWF0aW9uRmFkZUluICAgIChhbmltYXRpb25zLmZhZGVJbilcbiAgICBAZmFuY3lib3ggICAgICAgICAgICA9IG5ldyBGYW5jeWJveCgpXG4gICAgQHRvb2x0aXBzICAgICAgICAgICAgPSBuZXcgVG9vbHRpcHMoJy50b29sdGlwJylcblxuKCgkKSAtPlxuICBSYXZlbi5jb250ZXh0KCAtPlxuICAgIHdpbmRvdy5hcHBsaWNhdGlvbiA9IG5ldyBBcHBsaWNhdGlvbigpXG4gIClcblxuKShqUXVlcnkpXG4iXX0=
