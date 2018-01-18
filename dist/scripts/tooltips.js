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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcHMuanMiLCJzb3VyY2VzIjpbInRvb2x0aXBzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFNLElBQUMsQ0FBQTtJQUNRLGtCQUFDLFFBQUQ7TUFDWCxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsSUFBWixDQUFpQixTQUFBO0FBQ2YsWUFBQTtRQUFBLEtBQUEsR0FBUSxDQUFBLENBQUUsSUFBRjtlQUVSLEtBQUssQ0FBQyxXQUFOLENBQ0U7VUFBQSxLQUFBLEVBQWUsS0FBSyxDQUFDLElBQU4sQ0FBVyxlQUFYLENBQUEsSUFBK0IsbUJBQTlDO1VBQ0EsYUFBQSxFQUFlLEtBQUssQ0FBQyxJQUFOLENBQVcsY0FBWCxDQUFBLElBQThCLElBRDdDO1VBRUEsU0FBQSxFQUFlLEtBQUssQ0FBQyxJQUFOLENBQVcsbUJBQVgsQ0FBQSxJQUFtQyxNQUZsRDtVQUdBLFFBQUEsRUFBZSxLQUFLLENBQUMsSUFBTixDQUFXLGtCQUFYLENBQUEsSUFBa0MsUUFIakQ7VUFJQSxRQUFBLEVBQWUsS0FBSyxDQUFDLElBQU4sQ0FBVyxtQkFBWCxDQUFBLElBQW1DLElBSmxEO1NBREY7TUFIZSxDQUFqQjtJQURXOzs7OztBQURmIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQFRvb2x0aXBzXG4gIGNvbnN0cnVjdG9yOiAoc2VsZWN0b3IpLT5cbiAgICAkKHNlbGVjdG9yKS5lYWNoKC0+XG4gICAgICAkdGhpcyA9ICQodGhpcylcblxuICAgICAgJHRoaXMudG9vbHRpcHN0ZXJcbiAgICAgICAgdGhlbWU6ICAgICAgICAgJHRoaXMuZGF0YSgndG9vbHRpcC10aGVtZScpIHx8ICd0b29sdGlwc3Rlci1saWdodCdcbiAgICAgICAgY29udGVudEFzSFRNTDogJHRoaXMuZGF0YSgndG9vbHRpcC1odG1sJykgfHzCoHRydWVcbiAgICAgICAgYW5pbWF0aW9uOiAgICAgJHRoaXMuZGF0YSgndG9vbHRpcC1hbmltYXRpb24nKSB8fCAnZ3JvdydcbiAgICAgICAgcG9zaXRpb246ICAgICAgJHRoaXMuZGF0YSgndG9vbHRpcC1wb3NpdGlvbicpIHx8ICdib3R0b20nXG4gICAgICAgIG1heFdpZHRoOiAgICAgICR0aGlzLmRhdGEoJ3Rvb2x0aXAtbWF4LXdpZHRoJykgfHwgbnVsbFxuICAgIClcbiJdfQ==
