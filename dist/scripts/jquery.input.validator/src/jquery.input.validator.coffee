
#= include input.validator.coffee

if typeof jQuery != 'undefined'
  $ = jQuery
  jQuery.fn.iValidator = (config = null) ->
    $this = $(this)

    instance = $this.data('ivalidator')

    if !instance || config != null
      $this.data('ivalidator', new InputValidator($this, config || {}))

      instance = $this.data('ivalidator')

    return instance
