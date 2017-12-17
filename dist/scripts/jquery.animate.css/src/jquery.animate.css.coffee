
jQuery.fn.extend
  animateCss: (animationCssClass, duration, complete) ->
    @each () ->
      durationSeconds = (duration / 1000)
      $this = $(this)
      $this
        .css("animation-duration", durationSeconds + 's')
        .addClass("animate #{animationCssClass}")

      setTimeout(->
        $this.removeClass("animate #{animationCssClass}")
        complete($this) if complete
      , duration)
