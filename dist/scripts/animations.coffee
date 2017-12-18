class @AnimationFadeIn extends Animation
  constructor: (@options)->
    super @options
    for $el in @animatedElements
      do ($el) ->
        setTimeout(
          ->
            $el.animate({opacity: 1}, $el.options.speed)
          ,
          $el.options.wait
        )


class @AnimationInView extends Animation
  constructor: (@options)->
    super @options
    @setupAnimations()

  setupAnimations: =>
    for $el in @animatedElements
      $el.css($el.options.css)

    $(window).bind('scroll', @checkAnimatedElemets)
    $(window).bind('resize', @checkAnimatedElemets)

    for $el in @animatedElements
      do ($el, @doAnimatedElement) ->
        setTimeout(
          ->
            @doAnimatedElement $el
          ,
          $el.options.wait
        )

  checkAnimatedElemets: =>
    top = $(window).scrollTop() + $(window).height()
    for $el in @animatedElements
      @doAnimatedElement $el

  doAnimatedElement: ($el) ->
    top = $(window).scrollTop() + $(window).height()
    if(top + $el.options.offsetTop > $el.offset().top)
      $el.animate({opacity: 1, top: 0}, $el.options.speed)

class @AnimationFixedOnTop
  constructor: (@options)->
    @animatedElements = $(@options.selector)
    @undoElements = []
    @setupAnimations()

  setupAnimations: =>
    $(window).bind('scroll', @checkAnimatedElemets)
    $(window).bind('resize', @checkAnimatedElemets)
    @checkAnimatedElemets()

  checkUndoAnimatedElements: =>
    top = $(window).scrollTop()

    indexToDel = []
    for entry, index in @undoElements
      if top < entry.top
        entry.el.css(entry.css)
        entry.el.removeClass 'fixed'
        indexToDel.push index

    for index in indexToDel
      @undoElements.slice(index, 1)

  checkAnimatedElemets: =>
    @checkUndoAnimatedElements()

    top = $(window).scrollTop()

    @animatedElements.each((i, el) =>
      $el = $(el)

      return if $el.css('position') == 'fixed'

      offset = $el.offset()
      if(top > offset.top)
        @undoElements.push
          el: $el
          top: offset.top
          css:
            position: $el.css('position')
            left: $el.css('left')

        $el.css
          position: 'fixed'
          top: 0
          left: offset.left

        $el.addClass 'fixed'
    )
