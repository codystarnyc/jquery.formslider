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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFuY3lib3guanMiLCJzb3VyY2VzIjpbImZhbmN5Ym94LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFNLE1BQU0sQ0FBQztJQUNFLGtCQUFBO01BQ1gsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQURXOzt1QkFHYixhQUFBLEdBQWUsU0FBQTthQUNiLENBQUEsQ0FBRSxXQUFGLENBQWMsQ0FBQyxRQUFmLENBQ0U7UUFBQSxRQUFBLEVBQVcsSUFBWDtRQUNBLFNBQUEsRUFBWSxJQURaO1FBRUEsS0FBQSxFQUFTLEtBRlQ7UUFHQSxNQUFBLEVBQVUsS0FIVjtRQUlBLFFBQUEsRUFBVyxJQUpYO1FBS0EsVUFBQSxFQUFhLEtBTGI7UUFNQSxVQUFBLEVBQWEsTUFOYjtRQU9BLFdBQUEsRUFBYyxNQVBkO1FBUUEsT0FBQSxFQUNFO1VBQUEsT0FBQSxFQUNFO1lBQUEsTUFBQSxFQUFRLEtBQVI7V0FERjtTQVRGO09BREY7SUFEYTs7Ozs7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuRmFuY3lib3hcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHNldHVwRmFuY3lib3goKVxuXG4gIHNldHVwRmFuY3lib3g6IC0+XG4gICAgJChcIi5mYW5jeWJveFwiKS5mYW5jeWJveChcbiAgICAgIG1heFdpZHRoXHQ6IDEwMDAsXG4gICAgICBmaXRUb1ZpZXdcdDogdHJ1ZSxcbiAgICAgIHdpZHRoXHRcdDogJzkwJScsXG4gICAgICBoZWlnaHRcdFx0OiAnNzAlJyxcbiAgICAgIGF1dG9TaXplXHQ6IHRydWUsXG4gICAgICBjbG9zZUNsaWNrXHQ6IGZhbHNlLFxuICAgICAgb3BlbkVmZmVjdFx0OiAnbm9uZScsXG4gICAgICBjbG9zZUVmZmVjdFx0OiAnbm9uZScsXG4gICAgICBoZWxwZXJzOlxuICAgICAgICBvdmVybGF5OlxuICAgICAgICAgIGxvY2tlZDogZmFsc2VcbiAgICApXG4iXX0=
