class @HistoryJsController extends AbstractFormsliderPlugin
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
    index = @index()
    hash  = null
    hash  = "?slide=#{index}" if @config.updateUrl

    @logger.debug('pushCurrentHistoryState', "index:#{index}")

    History.pushState(
      { index: index, time: @time },
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
