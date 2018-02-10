
class @DramaticLoader extends AbstractFormsliderLoader
  @config =
    duration: 2500
    finishAnimationDuration: 2500
    hideElementsOnHalf:      '.hide-on-half'
    showElementsOnHalf:      '.show-on-half'
    bounceOutOnHalf:         '.bounce-out-on-half'
    bounceDownOnNext:        '.bounce-down-on-enter'

  doAnimation: =>
    @on('leaving.next', @doAnimationOnNextSlide)

    @logger.debug "doAnimation(#{@config.finishAnimationDuration})"

    $elementsToHide      = $(@config.hideElementsOnHalf, @slide)
    $elementsToShow      = $(@config.showElementsOnHalf, @slide)
    $elementsToBounceOut = $(@config.bounceOutOnHalf, @slide)

    $elementsToHide.fadeOut().animateCss('bounceOut', 400, ->
      $elementsToShow.css({
        display: 'block'
      })
      .fadeIn()
      .animateCss('bounceIn', 500, ->
        $elementsToBounceOut.animateCss('bounceOut', 400)
                            .animate({opacity: 0}, 400)
      )
    )

    setTimeout(
      @finishAnimation,
      @config.duration
    )

  finishAnimation: =>
    setTimeout(
      @stop,
      @config.finishAnimationDuration
    )

  doAnimationOnNextSlide: (event, current, direction, next) =>
    $elementsToBounceDown = $(@config.bounceDownOnNext, next)
    $elementsToBounceDown.css({opacity: 0})
      .animateCss('bounceInDown', 600)
      .animate({opacity: 1}, 600)
