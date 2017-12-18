
class @JqueryAnimatePlugin extends AbstractFormsliderPlugin
  @config =
    duration: 1000
    selector: '.answer'
    next:
      inEffect:  'swingReverse'
      outEffect: 'swingReverse'
    prev:
      inEffect:  'swing'
      outEffect: 'swing'

  init: =>
    @on('before.question', @doAnimation)

  doAnimation: (event, currentSlide, direction, nextSlide) =>
    inEffect  = @config[direction].inEffect
    outEffect = @config[direction].outEffect
    duration  = @config.duration
    selector  = @config.selector

    $(selector, nextSlide).animateCss(outEffect, duration, =>
      @trigger('do-equal-height', event, currentSlide)
    )
