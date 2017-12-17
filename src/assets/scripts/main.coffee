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

    @animationFixedOnTop = new AnimationFixedOnTop(@options.animations.fixedOnTop)
    @animationInView     = new AnimationInView    (@options.animations.inView)
    @animationFadeIn     = new AnimationFadeIn    (@options.animations.fadeIn)
    @fancybox            = new Fancybox()
    @tooltips            = new Tooltips('.tooltip')

(($) ->

    window.application = new Application()

)(jQuery)
