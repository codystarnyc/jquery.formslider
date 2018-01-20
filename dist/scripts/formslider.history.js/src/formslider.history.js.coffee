class @HistoryJsPlugin extends AbstractFormsliderPlugin
  @config =
    updateUrl: false
    resetStatesOnLoad: true

  init: =>
    @on('after', @onAfter)

    @time = new Date().getTime()

    @pushCurrentHistoryState()

    History.Adapter.bind(window, 'statechange', @handleHistoryChange)

  onAfter: =>
    @pushCurrentHistoryState()

  pushCurrentHistoryState: =>
    hash = null
    hash = "?slide=#{@formslider.index()}" if @config.updateUrl

    @logger.debug('pushCurrentHistoryState', "index:#{@formslider.index()}")

    History.pushState(
      { index: @formslider.index(), time: @time },
      null,
      hash
    )

  handleHistoryChange: (event) =>
    state = History.getState()

    return unless state?.data?.index > -1

    if @config.resetStatesOnLoad
      return unless state.data.time == @time

    @logger.debug('handleHistoryChange', state.data.index)


    @formslider.goto(state.data.index)
