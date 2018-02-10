
class @JqueryAnimate extends AbstractFormsliderPlugin
  @config =
    duration: 800
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

    $(selector, currentSlide).animateCss(outEffect, duration)

    $(selector, nextSlide).animateCss(outEffect, duration)
