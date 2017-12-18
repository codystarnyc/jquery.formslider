(function() {
  this.Application = (function() {
    function Application() {
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
      this.animationFixedOnTop = new AnimationFixedOnTop(this.options.animations.fixedOnTop);
      this.animationInView = new AnimationInView(this.options.animations.inView);
      this.animationFadeIn = new AnimationFadeIn(this.options.animations.fadeIn);
      this.fancybox = new Fancybox();
      this.tooltips = new Tooltips('.tooltip');
    }

    return Application;

  })();

  (function($) {
    return window.application = new Application();
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBTSxJQUFDLENBQUE7SUFDUSxxQkFBQTtNQUNYLElBQUMsQ0FBQSxPQUFELEdBQ0U7UUFBQSxVQUFBLEVBQ0U7VUFBQSxVQUFBLEVBQ0U7WUFBQSxRQUFBLEVBQVUsZUFBVjtXQURGO1VBRUEsTUFBQSxFQUNFO1lBQUEsUUFBQSxFQUFVLGtCQUFWO1lBQ0EsSUFBQSxFQUFNLElBRE47WUFFQSxLQUFBLEVBQU8sSUFGUDtXQUhGO1VBTUEsTUFBQSxFQUNFO1lBQUEsUUFBQSxFQUFVLHFCQUFWO1lBQ0EsS0FBQSxFQUFVLEdBRFY7WUFFQSxJQUFBLEVBQU0sSUFGTjtZQUdBLFNBQUEsRUFBVyxHQUhYO1lBSUEsR0FBQSxFQUNFO2NBQUEsT0FBQSxFQUFVLENBQVY7Y0FDQSxRQUFBLEVBQVUsVUFEVjtjQUVBLEdBQUEsRUFBVSxPQUZWO2FBTEY7V0FQRjtTQURGOztNQWlCRixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBSSxtQkFBSixDQUF3QixJQUFDLENBQUEsT0FBTyxDQUFDLFVBQVUsQ0FBQyxVQUE1QztNQUN2QixJQUFDLENBQUEsZUFBRCxHQUF1QixJQUFJLGVBQUosQ0FBd0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBNUM7TUFDdkIsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBSSxlQUFKLENBQXdCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQTVDO01BQ3ZCLElBQUMsQ0FBQSxRQUFELEdBQXVCLElBQUksUUFBSixDQUFBO01BQ3ZCLElBQUMsQ0FBQSxRQUFELEdBQXVCLElBQUksUUFBSixDQUFhLFVBQWI7SUF2Qlo7Ozs7OztFQXlCZixDQUFDLFNBQUMsQ0FBRDtXQUVHLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLElBQUksV0FBSixDQUFBO0VBRnhCLENBQUQsQ0FBQSxDQUlFLE1BSkY7QUExQkEiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBAQXBwbGljYXRpb25cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQG9wdGlvbnMgPVxuICAgICAgYW5pbWF0aW9uczpcbiAgICAgICAgZml4ZWRPblRvcDpcbiAgICAgICAgICBzZWxlY3RvcjogJy5maXhlZC1vbi10b3AnXG4gICAgICAgIGZhZGVJbjpcbiAgICAgICAgICBzZWxlY3RvcjogJy5mYWRlLWluLW9uLWxvYWQnXG4gICAgICAgICAgd2FpdDogMTIwMFxuICAgICAgICAgIHNwZWVkOiAxNzAwXG4gICAgICAgIGluVmlldzpcbiAgICAgICAgICBzZWxlY3RvcjogJy5hbmltYXRlLWlmLWluLXZpZXcnXG4gICAgICAgICAgc3BlZWQ6ICAgIDgzMFxuICAgICAgICAgIHdhaXQ6IDEyMDBcbiAgICAgICAgICBvZmZzZXRUb3A6IDEwMFxuICAgICAgICAgIGNzczpcbiAgICAgICAgICAgIG9wYWNpdHk6ICAwXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgdG9wOiAgICAgICcxMDBweCdcblxuICAgIEBhbmltYXRpb25GaXhlZE9uVG9wID0gbmV3IEFuaW1hdGlvbkZpeGVkT25Ub3AoQG9wdGlvbnMuYW5pbWF0aW9ucy5maXhlZE9uVG9wKVxuICAgIEBhbmltYXRpb25JblZpZXcgICAgID0gbmV3IEFuaW1hdGlvbkluVmlldyAgICAoQG9wdGlvbnMuYW5pbWF0aW9ucy5pblZpZXcpXG4gICAgQGFuaW1hdGlvbkZhZGVJbiAgICAgPSBuZXcgQW5pbWF0aW9uRmFkZUluICAgIChAb3B0aW9ucy5hbmltYXRpb25zLmZhZGVJbilcbiAgICBAZmFuY3lib3ggICAgICAgICAgICA9IG5ldyBGYW5jeWJveCgpXG4gICAgQHRvb2x0aXBzICAgICAgICAgICAgPSBuZXcgVG9vbHRpcHMoJy50b29sdGlwJylcblxuKCgkKSAtPlxuXG4gICAgd2luZG93LmFwcGxpY2F0aW9uID0gbmV3IEFwcGxpY2F0aW9uKClcblxuKShqUXVlcnkpXG4iXX0=
