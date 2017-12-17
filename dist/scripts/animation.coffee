
class @Animation
  constructor: (@options)->
    @animatedElements = []
    # merge data and option values
    for el in $(@options.selector)
      $el = $(el)
      @animatedElements.push $el
      $el.options = $.extend(true, {}, @options)
      for data_key, value of $el.data()
        $el.options[data_key]=value if data_key of @options
