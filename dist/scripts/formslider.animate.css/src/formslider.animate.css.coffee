
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
    actions:
      before: (plugin, current, direction, next) ->
        inEffect  = plugin.config[direction].inEffect
        outEffect = plugin.config[direction].outEffect
        duration  = plugin.config.duration
        selector  = plugin.config.selector

        if $(current).data('role') == 'question'
          $(selector, current).animateCss(outEffect, duration)

        if $(next).data('role') == 'question'
          $(selector, next).animateCss(inEffect, duration)

  init: =>
    for eventName, callback of @config.actions
      @on(eventName, (event, current, direction, next) =>
        callback(@, current, direction, next)
      )
