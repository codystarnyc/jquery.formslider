#= include animation.coffee
#= include animations.coffee
#= include fancybox.coffee
#= include tooltips.coffee

class @Application
  constructor: ->
    @options =
      animations:
        fixedOnTop:
          selector: '.fixed-on-top'
        fadeIn:
          selector: '.fade-in-on-load'
          wait: 1200
          speed: 1700
        inView:
          selector: '.animate-if-in-view'
          speed:    830
          wait: 1200
          offsetTop: 100
          css:
            opacity:  0
            position: 'relative'
            top:      '100px'

    animations = @options.animations
    @animationFixedOnTop = new AnimationFixedOnTop(animations.fixedOnTop)
    @animationInView     = new AnimationInView    (animations.inView)
    @animationFadeIn     = new AnimationFadeIn    (animations.fadeIn)
    @fancybox            = new Fancybox()
    @tooltips            = new Tooltips('.tooltip')

(($) ->
  Raven.context( ->
    window.application = new Application()
  )

)(jQuery)
